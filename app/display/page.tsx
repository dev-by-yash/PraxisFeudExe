'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Game, WSMessage } from '../../types/game';
import { getWebSocketUrl } from '../../lib/websocket';

function DisplayPageContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams?.get('code');
  
  const [game, setGame] = useState<Game | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!gameCode) return;

    // Connect to WebSocket
    wsRef.current = new WebSocket(getWebSocketUrl());
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      // Join as display (not as player with team)
      wsRef.current?.send(JSON.stringify({
        type: 'display_join',
        gameCode
      }));
    };

    wsRef.current.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'joined_game':
          console.log('📺 Display joined game');
          setGame(message.data.game);
          break;
        case 'game_update':
          console.log('📺 Display received game_update');
          setGame(message.data.game);
          break;
        case 'answer_revealed':
          console.log('📺 Display received answer_revealed');
          // Update only the answer state, preserve team scores
          setGame(prevGame => {
            if (!prevGame) return prevGame;
            
            const updatedRounds = [...prevGame.rounds];
            const currentRound = updatedRounds[prevGame.currentRoundIndex];
            if (currentRound) {
              const currentQuestion = currentRound.questions[currentRound.currentQuestionIndex];
              if (currentQuestion && currentQuestion.answers[message.data.answerIndex]) {
                currentQuestion.answers[message.data.answerIndex].revealed = true;
              }
            }
            
            return {
              ...prevGame,
              rounds: updatedRounds
            };
          });
          break;
        case 'question_changed':
          console.log('📺 Display received question_changed');
          console.log('   New round index:', message.data.currentRoundIndex);
          console.log('   New question index:', message.data.currentQuestionIndex);
          // Update game state but preserve team scores
          setGame(prevGame => {
            if (!prevGame) return prevGame;
            
            // Update the rounds structure properly
            const updatedRounds = [...prevGame.rounds];
            if (updatedRounds[message.data.currentRoundIndex]) {
              updatedRounds[message.data.currentRoundIndex].currentQuestionIndex = message.data.currentQuestionIndex;
            }
            
            return {
              ...prevGame,
              currentRoundIndex: message.data.currentRoundIndex,
              rounds: updatedRounds,
              gameState: message.data.gameState,
              buzzerPressed: null,
              // Reset strikes but preserve scores
              teams: prevGame.teams.map(team => ({
                ...team,
                strikes: 0,
                // Keep the score!
                score: team.score
              }))
            };
          });
          break;
        case 'points_updated':
          console.log('📺 Display received points_updated');
          // Update team scores
          setGame(prevGame => {
            if (!prevGame) return prevGame;
            
            return {
              ...prevGame,
              teams: prevGame.teams.map(team => ({
                ...team,
                score: message.data.scores[team.id] || team.score
              }))
            };
          });
          break;
        case 'buzzer_pressed':
          console.log('📺 Display received buzzer_pressed:', message.data);
          // Update game state when buzzer is pressed
          setGame(prevGame => prevGame ? {
            ...prevGame,
            buzzerPressed: {
              teamId: message.data.teamId,
              teamName: message.data.teamName,
              timestamp: message.data.timestamp
            },
            gameState: 'answering'
          } : null);
          break;
        case 'buzzer_enabled':
          console.log('📺 Display received buzzer_enabled');
          setGame(prevGame => prevGame ? {
            ...prevGame,
            buzzerPressed: null,
            gameState: 'buzzer'
          } : null);
          break;
        case 'buzzer_reset':
          console.log('📺 Display received buzzer_reset');
          setGame(prevGame => prevGame ? {
            ...prevGame,
            buzzerPressed: null,
            gameState: 'buzzer'
          } : null);
          break;
        case 'error':
          console.error('📺 Display error:', message.data.message);
          break;
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      wsRef.current?.close();
    };
  }, [gameCode]);

  if (!gameCode) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center">
        <div className="text-white text-4xl">Invalid game code</div>
      </div>
    );
  }

  if (!isConnected || !game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-4xl">Connecting to game...</div>
      </div>
    );
  }

  const currentRound = game.rounds[game.currentRoundIndex];
  const currentQuestion = currentRound?.questions[currentRound.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/30 p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-5xl font-bold">Feud.Exe</h1>
            <p className="text-2xl text-blue-200">Execution Begins With The Beep</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">Round {game.currentRoundIndex + 1}</p>
            <p className="text-xl text-gray-300">Question {(currentRound?.currentQuestionIndex || 0) + 1} of 3</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Teams */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {game.teams.map((team, index) => (
            <div
              key={team.id}
              className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center ${
                game.currentTeamTurn === team.id ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              <h2 className="text-4xl font-bold mb-4">{team.name}</h2>
              <div className="text-6xl font-bold mb-4">{team.score}</div>
              
              {/* Strikes */}
              <div className="flex justify-center space-x-3 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${
                      i < team.strikes ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Players */}
              <div className="space-y-2">
                {team.players.map((player) => (
                  <div key={player.id} className="text-xl bg-white/10 p-2 rounded-lg">
                    {player.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8">
            <h3 className="text-4xl font-bold text-center mb-8">{currentQuestion.text}</h3>
            
            {/* Simple Buzzer Message - Persistent */}
            {game.buzzerPressed && (
              <div className="bg-green-600 rounded-3xl p-6 mb-8 text-center">
                <p className="text-4xl font-bold text-white">
                  🔥 Team "{game.buzzerPressed.teamName || 'Unknown'}" pressed the buzzer first! 🔥
                </p>
              </div>
            )}

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-800 p-2 mb-4 text-xs text-white">
                <div>Game State: {game.gameState}</div>
                <div>Buzzer Pressed: {game.buzzerPressed ? `Yes - ${game.buzzerPressed.teamName}` : 'No'}</div>
                <div>Teams: {game.teams?.length || 0}</div>
              </div>
            )}

            {/* Answers */}
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl flex justify-between items-center text-2xl font-bold ${
                    answer.revealed 
                      ? 'bg-green-600 animate-pulse' 
                      : 'bg-gray-700'
                  }`}
                >
                  <span className="flex items-center">
                    <span className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                      {index + 1}
                    </span>
                    {answer.revealed ? answer.text : '???'}
                  </span>
                  <span className="text-4xl">
                    {answer.revealed ? answer.points : '?'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game State */}
        <div className="text-center">
          {game.gameState === 'waiting' && (
            <p className="text-3xl text-yellow-400">Waiting for players to join...</p>
          )}
          {game.gameState === 'buzzer' && (
            <p className="text-3xl text-green-400 animate-bounce">Ready for buzzer!</p>
          )}
          {game.gameState === 'answering' && (
            <p className="text-3xl text-blue-400">Answering in progress...</p>
          )}
          {game.gameState === 'finished' && (
            <div className="text-center">
              <p className="text-5xl text-yellow-400 font-bold mb-4">Game Over!</p>
              <p className="text-3xl">
                Winner: {game.teams.reduce((winner, team) => 
                  team.score > winner.score ? team : winner
                ).name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DisplayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-4xl">Loading...</div>
    </div>}>
      <DisplayPageContent />
    </Suspense>
  );
}