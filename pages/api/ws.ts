import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '../../lib/mongodb';
import Game from '../../models/Game';
import { getRandomQuestions } from '../../lib/gameData';
import { Game as GameType, WSMessage, Team, Player } from '../../types/game';

interface ExtendedWebSocket extends WebSocket {
  id: string;
  gameCode?: string;
  playerId?: string;
  role: 'host' | 'player' | 'display';
}

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map<string, ExtendedWebSocket>();

function generateGameCode(): string {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function broadcast(gameCode: string, message: WSMessage, excludeId?: string) {
  clients.forEach((client, clientId) => {
    if (client.gameCode === gameCode && clientId !== excludeId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

async function createGame(hostId: string): Promise<GameType> {
  await connectDB();
  
  const gameCode = generateGameCode();
  const questions = getRandomQuestions();
  
  const rounds = [
    {
      id: 'round1',
      name: 'Round 1',
      questions: questions.slice(0, 3),
      currentQuestionIndex: 0
    },
    {
      id: 'round2', 
      name: 'Round 2',
      questions: questions.slice(3, 6),
      currentQuestionIndex: 0
    },
    {
      id: 'round3',
      name: 'Round 3', 
      questions: questions.slice(6, 9),
      currentQuestionIndex: 0
    }
  ];

  const teams: Team[] = [
    {
      id: 'team1',
      name: 'Team 1',
      score: 0,
      players: [],
      strikes: 0
    },
    {
      id: 'team2', 
      name: 'Team 2',
      score: 0,
      players: [],
      strikes: 0
    }
  ];

  const gameData: GameType = {
    id: uuidv4(),
    code: gameCode,
    hostId,
    teams,
    rounds,
    currentRoundIndex: 0,
    currentTeamTurn: 'team1',
    gameState: 'waiting',
    buzzerPressed: null,
    createdAt: new Date(),
    isActive: true
  };

  const game = new Game(gameData);
  await game.save();
  
  return gameData;
}

wss.on('connection', (ws: ExtendedWebSocket) => {
  ws.id = uuidv4();
  clients.set(ws.id, ws);

  ws.on('message', async (data: Buffer) => {
    try {
      const message: WSMessage = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'host_create':
          try {
            const game = await createGame(ws.id);
            ws.gameCode = game.code;
            ws.role = 'host';
            
            ws.send(JSON.stringify({
              type: 'game_created',
              data: { game, hostId: ws.id }
            }));
          } catch (error) {
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to create game' }
            }));
          }
          break;

        case 'player_join':
          try {
            await connectDB();
            const game = await Game.findOne({ code: message.gameCode, isActive: true });
            
            if (!game) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Game not found' }
              }));
              return;
            }

            ws.gameCode = message.gameCode;
            ws.playerId = ws.id;
            ws.role = 'player';

            // Add player to waiting list (host will assign to team)
            ws.send(JSON.stringify({
              type: 'joined_game',
              data: { 
                game: game.toObject(),
                playerId: ws.id,
                playerName: message.data.playerName
              }
            }));

            // Notify host of new player
            broadcast(message.gameCode!, {
              type: 'player_joined',
              data: {
                playerId: ws.id,
                playerName: message.data.playerName
              }
            }, ws.id);

          } catch (error) {
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to join game' }
            }));
          }
          break;

        case 'buzzer_press':
          try {
            await connectDB();
            const game = await Game.findOne({ code: message.gameCode, isActive: true });
            
            if (!game || game.gameState !== 'buzzer') {
              return;
            }

            // Check if buzzer already pressed
            if (game.buzzerPressed) {
              return game.buzzerPressed.teamId;
            }

            // Find player info
            let playerName = '';
            let teamId = '';
            
            for (const team of game.teams) {
              const player = team.players.find((p: any) => p.id === ws.id);
              if (player) {
                playerName = player.name;
                teamId = team.id;
                break;
              }
            }

            game.buzzerPressed = {
              playerId: ws.id,
              playerName,
              teamId,
              timestamp: Date.now()
            };
            game.gameState = 'answering';
            
            await game.save();

            broadcast(message.gameCode!, {
              type: 'buzzer_pressed',
              data: {
                playerId: ws.id,
                playerName,
                teamId,
                game: game.toObject()
              }
            });

          } catch (error) {
            console.error('Buzzer press error:', error);
          }
          break;

        case 'host_action':
          try {
            await connectDB();
            const game = await Game.findOne({ code: message.gameCode, isActive: true });
            
            if (!game || game.hostId !== ws.id) {
              return;
            }

            const action = message.data;
            
            switch (action.type) {
              case 'reveal_answer':
                const currentRound = game.rounds[game.currentRoundIndex];
                const currentQuestion = currentRound.questions[currentRound.currentQuestionIndex];
                const answerIndex = action.data.answerIndex;
                
                if (currentQuestion.answers[answerIndex]) {
                  currentQuestion.answers[answerIndex].revealed = true;
                  
                  // Add points to current team
                  const currentTeam = game.teams.find((t: any) => t.id === game.currentTeamTurn);
                  if (currentTeam) {
                    currentTeam.score += currentQuestion.answers[answerIndex].points;
                  }
                }
                break;

              case 'add_strike':
                const team = game.teams.find((t: any) => t.id === action.data.teamId);
                if (team && team.strikes < 3) {
                  team.strikes += 1;
                }
                break;

              case 'reset_buzzer':
                game.buzzerPressed = null;
                game.gameState = 'buzzer';
                break;

              case 'next_question':
                const round = game.rounds[game.currentRoundIndex];
                if (round.currentQuestionIndex < round.questions.length - 1) {
                  round.currentQuestionIndex += 1;
                } else if (game.currentRoundIndex < game.rounds.length - 1) {
                  game.currentRoundIndex += 1;
                  game.rounds[game.currentRoundIndex].currentQuestionIndex = 0;
                } else {
                  game.gameState = 'finished';
                }
                
                // Reset strikes for new question
                game.teams.forEach((team: any) => {
                  team.strikes = 0;
                });
                game.buzzerPressed = null;
                game.gameState = 'buzzer';
                break;

              case 'manage_teams':
                if (action.data.operation === 'add_player') {
                  const targetTeam = game.teams.find((t: any) => t.id === action.data.teamId);
                  if (targetTeam) {
                    targetTeam.players.push({
                      id: action.data.playerId,
                      name: action.data.playerName,
                      teamId: action.data.teamId,
                      isConnected: true
                    });
                  }
                }
                break;
            }

            await game.save();

            broadcast(message.gameCode!, {
              type: 'game_update',
              data: { game: game.toObject() }
            });

          } catch (error) {
            console.error('Host action error:', error);
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Invalid message format' }
      }));
    }
  });

  ws.on('close', () => {
    clients.delete(ws.id);
  });
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'WebSocket server running on port 8080' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}