const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

// Simple in-memory storage for testing
const games = new Map();
const teams = new Map();

// Sample teams for testing
teams.set('team1', { id: 'team1', name: 'praxis', isActive: true });
teams.set('team2', { id: 'team2', name: 'google', isActive: true });

function generateGameCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();

function broadcast(gameCode, message, excludeId) {
  clients.forEach((client, clientId) => {
    if (client.gameCode === gameCode && clientId !== excludeId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

wss.on('connection', (ws) => {
  ws.id = uuidv4();
  clients.set(ws.id, ws);
  
  console.log(`Client connected: ${ws.id}`);

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received:', message);
      
      switch (message.type) {
        case 'host_create':
          const gameCode = generateGameCode();
          const game = {
            id: uuidv4(),
            code: gameCode,
            hostId: ws.id,
            teams: [],
            gameState: 'waiting',
            buzzerPressed: null,
            createdAt: new Date(),
            isActive: true
          };
          
          games.set(gameCode, game);
          ws.gameCode = gameCode;
          ws.role = 'host';
          
          ws.send(JSON.stringify({
            type: 'game_created',
            data: { game, hostId: ws.id }
          }));
          
          console.log(`Game created: ${gameCode}`);
          break;

        case 'player_join':
          const playerGame = games.get(message.gameCode);
          if (!playerGame) {
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Game not found' }
            }));
            return;
          }

          const teamName = message.data.teamName;
          const playerTeam = Array.from(teams.values()).find(t => t.name.toLowerCase() === teamName.toLowerCase());
          
          if (!playerTeam) {
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: `Team "${teamName}" not found. Available teams: ${Array.from(teams.values()).map(t => t.name).join(', ')}` }
            }));
            return;
          }

          ws.gameCode = message.gameCode;
          ws.teamId = playerTeam.id;
          ws.teamName = playerTeam.name;
          ws.role = 'player';

          ws.send(JSON.stringify({
            type: 'joined_game',
            data: { 
              game: playerGame,
              teamId: playerTeam.id,
              teamName: playerTeam.name
            }
          }));

          console.log(`Player joined team: ${playerTeam.name} in game ${message.gameCode}`);
          break;

        case 'display_join':
          const displayGame = games.get(message.gameCode);
          if (!displayGame) {
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Game not found' }
            }));
            return;
          }

          ws.gameCode = message.gameCode;
          ws.role = 'display';

          ws.send(JSON.stringify({
            type: 'joined_game',
            data: { game: displayGame }
          }));

          console.log(`Display joined game: ${message.gameCode}`);
          break;

        case 'buzzer_press':
          console.log('🔔 Buzzer press received:', message);
          const buzzerGame = games.get(message.gameCode);
          
          if (!buzzerGame) {
            console.log('❌ Game not found:', message.gameCode);
            return;
          }
          
          console.log('🎮 Current game state:', buzzerGame.gameState);
          console.log('🔍 Current buzzer state:', buzzerGame.buzzerPressed);
          
          if (buzzerGame.gameState !== 'buzzer') {
            console.log('❌ Game state is not buzzer:', buzzerGame.gameState);
            return;
          }

          // Clear any existing buzzer press
          if (buzzerGame.buzzerPressed) {
            console.log('🔄 Clearing previous buzzer press');
            buzzerGame.buzzerPressed = null;
          }

          const teamId = message.data?.teamId || ws.teamId;
          const buzzerTeam = teams.get(teamId);
          
          if (!buzzerTeam) {
            console.error('❌ Team not found for buzzer press:', teamId);
            return;
          }

          console.log('✅ Team found for buzzer:', buzzerTeam.name);

          // Update game state
          buzzerGame.buzzerPressed = {
            teamId: buzzerTeam.id,
            teamName: buzzerTeam.name,
            timestamp: Date.now()
          };
          buzzerGame.gameState = 'answering';

          const buzzerData = {
            teamId: buzzerTeam.id,
            teamName: buzzerTeam.name,
            timestamp: Date.now()
          };

          console.log('📤 Broadcasting buzzer_pressed:', buzzerData);
          
          broadcast(message.gameCode, {
            type: 'buzzer_pressed',
            data: buzzerData
          });

          broadcast(message.gameCode, {
            type: 'game_update',
            data: { game: buzzerGame }
          });

          console.log(`🎉 Buzzer pressed by team: ${buzzerTeam.name}`);
          break;

        case 'host_action':
          const hostGame = games.get(message.gameCode);
          if (!hostGame || hostGame.hostId !== ws.id) {
            return;
          }

          const action = message.data;
          
          switch (action.type) {
            case 'enable_buzzer':
              console.log('🔔 Enabling buzzer');
              hostGame.gameState = 'buzzer';
              hostGame.buzzerPressed = null;
              
              broadcast(message.gameCode, {
                type: 'buzzer_enabled',
                data: { gameState: 'buzzer' }
              });
              
              broadcast(message.gameCode, {
                type: 'game_update',
                data: { game: hostGame }
              });
              
              console.log('✅ Buzzer enabled');
              return;

            case 'reset_buzzer':
              console.log('🔄 Resetting buzzer');
              hostGame.buzzerPressed = null;
              hostGame.gameState = 'buzzer';
              
              broadcast(message.gameCode, {
                type: 'buzzer_reset',
                data: { gameState: 'buzzer' }
              });
              
              broadcast(message.gameCode, {
                type: 'game_update',
                data: { game: hostGame }
              });
              
              console.log('✅ Buzzer reset');
              return;
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(ws.id);
    console.log(`Client disconnected: ${ws.id}`);
  });
});

console.log('🚀 Test Buzzer WebSocket server running on port 8080');
console.log('📝 Available teams: praxis, google');
console.log('🎮 Ready for testing!');