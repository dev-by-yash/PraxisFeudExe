const WebSocket = require('ws');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yashm13114:sh5VlCTZNnkShVVP@cluster0.lgqyj4p.mongodb.net/praxisFeudExe';
const PORT = parseInt(process.env.PORT) || 8080;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Team Schema (separate collection)
const TeamSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gameCode: { type: String, required: true },
  score: { type: Number, default: 0 },
  strikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

TeamSchema.index({ gameCode: 1 });
TeamSchema.index({ id: 1 });

const Team = mongoose.model('Team', TeamSchema);

// Player Schema (separate collection)
const PlayerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gameCode: { type: String, required: true },
  teamId: { type: String, default: null }, // null means waiting/unassigned
  teamName: { type: String, default: null }, // for easy reference
  isConnected: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

PlayerSchema.index({ gameCode: 1 });
PlayerSchema.index({ teamId: 1 });
PlayerSchema.index({ id: 1 });

const Player = mongoose.model('Player', PlayerSchema);

// UsedQuestion Schema - Track questions that have been used in games
const UsedQuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  questionText: { type: String, required: true },
  usedAt: { type: Date, default: Date.now },
  gameCode: { type: String, required: true }
});

UsedQuestionSchema.index({ questionId: 1 });

const UsedQuestion = mongoose.model('UsedQuestion', UsedQuestionSchema);

// Game Schema
const AnswerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  points: { type: Number, required: true },
  revealed: { type: Boolean, default: false }
});

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  answers: [AnswerSchema],
  currentAnswerIndex: { type: Number, default: 0 }
});

const RoundSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  questions: [QuestionSchema],
  currentQuestionIndex: { type: Number, default: 0 }
});

const GameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  hostId: { type: String, required: true },
  teams: [{ type: mongoose.Schema.Types.Mixed }], // Will store team references
  rounds: [RoundSchema],
  currentRoundIndex: { type: Number, default: 0 },
  currentTeamTurn: { type: String, default: '' },
  gameState: {
    type: String,
    enum: ['waiting', 'playing', 'buzzer', 'answering', 'finished'],
    default: 'waiting'
  },
  buzzerPressed: {
    playerId: String,
    playerName: String,
    teamId: String,
    teamName: String,
    timestamp: Number
  },
  questionVisible: { type: Boolean, default: false }, // Track if question is shown on display
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Game = mongoose.model('Game', GameSchema);

// Import real questions
const realQuestions = require('./realQuestions');

// Sample questions (kept for reference, but using realQuestions now)
const sampleQuestions = realQuestions;

function getRandomQuestions() {
  const shuffled = [...sampleQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 9);
}

function generateGameCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// WebSocket Server
const wss = new WebSocket.Server({
  port: PORT,
  host: '0.0.0.0' // Listen on all network interfaces
});
const clients = new Map();

console.log(`🚀 WebSocket server started on port ${PORT}`);
console.log('📡 Listening on all network interfaces (0.0.0.0)');
console.log('💡 Access from other devices using your computer\'s IP address');

function broadcast(gameCode, message, excludeId) {
  console.log(`📡 Broadcasting ${message.type} to game ${gameCode}`);
  let sentCount = 0;
  clients.forEach((client, clientId) => {
    if (client.gameCode === gameCode && clientId !== excludeId && client.readyState === WebSocket.OPEN) {
      console.log(`   📤 Sending to client ${clientId} (role: ${client.role || 'unknown'})`);
      client.send(JSON.stringify(message));
      sentCount++;
    }
  });
  console.log(`📡 Broadcast complete: sent to ${sentCount} clients`);
}

async function createGame(hostId) {
  const gameCode = generateGameCode();
  
  // Don't assign questions yet - host will select them
  const rounds = [
    {
      id: 'round1',
      name: 'Round 1',
      questions: [],
      currentQuestionIndex: 0
    },
    {
      id: 'round2',
      name: 'Round 2',
      questions: [],
      currentQuestionIndex: 0
    },
    {
      id: 'round3',
      name: 'Round 3',
      questions: [],
      currentQuestionIndex: 0
    }
  ];

  const teams = []; // Start with no teams - they will be selected from database

  const gameData = {
    id: uuidv4(),
    code: gameCode,
    hostId,
    teams,
    rounds,
    currentRoundIndex: 0,
    currentTeamTurn: 'team1',
    gameState: 'waiting',
    buzzerPressed: null,
    questionsSelected: false, // Track if questions have been selected
    createdAt: new Date(),
    isActive: true
  };

  const game = new Game(gameData);
  await game.save();

  return gameData;
}

// Function to get all available questions for selection (excluding used ones)
async function getAllQuestions() {
  // Get all used question IDs
  const usedQuestions = await UsedQuestion.find({});
  const usedQuestionIds = new Set(usedQuestions.map(q => q.questionId));
  
  // Filter out used questions
  const availableQuestions = sampleQuestions.filter(q => !usedQuestionIds.has(q.id));
  
  console.log(`📊 Total questions: ${sampleQuestions.length}`);
  console.log(`📊 Used questions: ${usedQuestionIds.size}`);
  console.log(`📊 Available questions: ${availableQuestions.length}`);
  
  return availableQuestions;
}

wss.on('connection', (ws) => {
  ws.id = uuidv4();
  ws.playerId = ws.id; // Store player ID for easy access
  clients.set(ws.id, ws);

  console.log(`✅ Client connected: ${ws.id}`);
  console.log(`   Total clients: ${clients.size}`);

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`📨 Received from ${ws.id}:`, message);
      console.log(`   Message type: ${message.type}`);
      console.log(`   Game code: ${message.gameCode || 'N/A'}`);

      switch (message.type) {
        case 'host_create':
          try {
            console.log('🎮 Creating game for host:', ws.id);
            const game = await createGame(ws.id);
            ws.gameCode = game.code;
            ws.role = 'host';

            // Don't load teams automatically - host must select teams explicitly
            // This ensures scores start at 0 when teams are selected for a new game
            const response = {
              type: 'game_created',
              data: { game: game, hostId: ws.id }
            };

            console.log('📤 Sending game_created response to:', ws.id);
            console.log('   Game code:', game.code);
            console.log('   WebSocket ready state:', ws.readyState);

            ws.send(JSON.stringify(response));

            console.log(`✅ Game created: ${game.code} - host must select teams`);
          } catch (error) {
            console.error('❌ Create game error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to create game' }
            }));
          }
          break;

        case 'team_manager_join':
          console.log('Team manager join request:', message);
          try {
            console.log('Looking for game with code:', message.gameCode);
            const game = await Game.findOne({ code: message.gameCode, isActive: true });

            if (!game) {
              console.error('Game not found for code:', message.gameCode);
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Game not found' }
              }));
              return;
            }

            console.log('Found game:', game.code);
            ws.gameCode = message.gameCode;
            ws.role = 'team_manager';

            // Load ALL teams and players (not filtered by game code - teams are global)
            const teams = await Team.find({ isActive: true });
            const players = await Player.find({ isActive: true });

            console.log(`📊 Found ${teams.length} teams and ${players.length} players (global)`);

            // Build game object with teams and their players
            const teamsWithPlayers = teams.map(team => ({
              id: team.id,
              name: team.name,
              score: team.score || 0,
              strikes: team.strikes || 0,
              players: players.filter(p => p.teamId === team.id).map(p => ({
                id: p.id,
                name: p.name,
                teamId: p.teamId,
                isConnected: p.isConnected
              }))
            }));

            // Update game object
            const gameWithTeams = {
              ...game.toObject(),
              teams: teamsWithPlayers
            };

            ws.send(JSON.stringify({
              type: 'joined_game',
              data: {
                game: gameWithTeams
              }
            }));

            console.log(`✅ Team manager joined game: ${message.gameCode} with ${teams.length} teams from database`);
          } catch (error) {
            console.error('Team manager join error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to join as team manager: ' + error.message }
            }));
          }
          break;

        case 'team_management_action':
          console.log('Received team management action:', message.data);
          try {
            const game = await Game.findOne({ code: message.gameCode, isActive: true });

            if (!game) {
              console.error('Game not found for code:', message.gameCode);
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Game not found' }
              }));
              return;
            }

            const action = message.data;
            console.log('Processing action:', action.type);

            switch (action.type) {
              case 'create_team':
                const newTeamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newTeam = new Team({
                  id: newTeamId,
                  name: action.teamName,
                  gameCode: 'GLOBAL', // Teams are global, not tied to specific game
                  score: 0,
                  strikes: 0
                });
                await newTeam.save();
                console.log(`✅ Created team in DB: ${action.teamName} (GLOBAL)`);
                break;

              case 'delete_team':
                // Delete team from database
                await Team.deleteOne({ id: action.teamId });

                // Move all players from this team back to waiting (set teamId to null)
                await Player.updateMany(
                  { teamId: action.teamId },
                  { $set: { teamId: null, teamName: null } }
                );
                console.log(`✅ Deleted team from DB: ${action.teamId}`);
                break;

              case 'add_player_to_team':
                const targetTeam = await Team.findOne({ id: action.teamId });
                if (targetTeam) {
                  // Check if player already exists
                  let player = await Player.findOne({ id: action.playerId });

                  if (player) {
                    // Update existing player
                    player.teamId = action.teamId;
                    player.teamName = targetTeam.name;
                    player.gameCode = 'GLOBAL'; // Players are global too
                    await player.save();
                  } else {
                    // Create new player
                    player = new Player({
                      id: action.playerId,
                      name: action.playerName,
                      gameCode: 'GLOBAL', // Players are global
                      teamId: action.teamId,
                      teamName: targetTeam.name,
                      isConnected: true
                    });
                    await player.save();
                  }
                  console.log(`✅ Added player to DB: ${action.playerName} -> ${targetTeam.name}`);
                }
                break;

              case 'remove_player_from_team':
                // Set player's teamId to null (move to waiting)
                await Player.updateOne(
                  { id: action.playerId },
                  { $set: { teamId: null, teamName: null } }
                );
                console.log(`✅ Removed player from team in DB: ${action.playerId}`);
                break;

              case 'move_player':
                const toTeam = await Team.findOne({ id: action.toTeamId });
                if (toTeam) {
                  await Player.updateOne(
                    { id: action.playerId },
                    { $set: { teamId: action.toTeamId, teamName: toTeam.name } }
                  );
                  console.log(`✅ Moved player in DB: ${action.playerId} -> ${toTeam.name}`);
                }
                break;

              case 'rename_team':
                const teamToRename = await Team.findOne({ id: action.teamId });
                if (teamToRename) {
                  teamToRename.name = action.newName;
                  await teamToRename.save();

                  // Update all players with this team's new name
                  await Player.updateMany(
                    { teamId: action.teamId },
                    { $set: { teamName: action.newName } }
                  );
                  console.log(`✅ Renamed team in DB: ${action.newName}`);
                }
                break;
            }

            // Fetch updated teams and players from database (ALL teams, not filtered by game code)
            const teams = await Team.find({ isActive: true });
            const players = await Player.find({ isActive: true });

            console.log(`📊 Fetched ${teams.length} teams and ${players.length} players from database (global)`);

            // Build game object with teams and their players
            const teamsWithPlayers = teams.map(team => ({
              id: team.id,
              name: team.name,
              score: team.score || 0,
              strikes: team.strikes || 0,
              players: players.filter(p => p.teamId === team.id).map(p => ({
                id: p.id,
                name: p.name,
                teamId: p.teamId,
                isConnected: p.isConnected
              }))
            }));

            console.log(`📊 Built teams with players:`, teamsWithPlayers.map(t => `${t.name} (${t.players.length} players)`));

            // Update game document with team references
            game.teams = teamsWithPlayers;
            await game.save();

            console.log('✅ Broadcasting team updates...');
            
            // Send teams_loaded message specifically for team management page
            broadcast(message.gameCode, {
              type: 'teams_loaded',
              data: { teams: teamsWithPlayers }
            });

            // Also broadcast game update for other clients
            broadcast(message.gameCode, {
              type: 'game_update',
              data: { game: game.toObject() }
            });

            console.log(`✅ Team management action completed: ${action.type}`);
          } catch (error) {
            console.error('❌ Team management action error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to perform team management action: ' + error.message }
            }));
          }
          break;

        case 'leaderboard_join':
          try {
            const game = await Game.findOne({ code: message.gameCode, isActive: true });

            if (!game) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Game not found' }
              }));
              return;
            }

            ws.gameCode = message.gameCode;
            ws.role = 'leaderboard';

            // Load all teams and their current scores from database
            const allTeams = await Team.find({ isActive: true });
            const allPlayers = await Player.find({ isActive: true });

            console.log(`📊 Leaderboard joining game ${message.gameCode}`);
            console.log(`📊 Found ${allTeams.length} teams in database`);

            // Build teams with their players and database scores
            const teamsWithPlayers = allTeams.map(team => ({
              id: team.id,
              name: team.name,
              score: team.score || 0, // Use database score
              strikes: team.strikes || 0,
              players: allPlayers.filter(p => p.teamId === team.id).map(p => ({
                id: p.id,
                name: p.name,
                teamId: p.teamId,
                isConnected: p.isConnected
              }))
            }));

            // Sort teams by score (highest first)
            const sortedTeams = teamsWithPlayers.sort((a, b) => (b.score || 0) - (a.score || 0));

            console.log(`📊 Leaderboard teams:`, sortedTeams.map(t => `${t.name}: ${t.score}`));

            // Send game with all teams sorted by score
            const gameWithTeams = {
              ...game.toObject(),
              teams: sortedTeams
            };

            ws.send(JSON.stringify({
              type: 'joined_game',
              data: { game: gameWithTeams }
            }));

            console.log(`✅ Leaderboard joined game: ${message.gameCode} with ${allTeams.length} teams`);
          } catch (error) {
            console.error('Leaderboard join error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to join leaderboard' }
            }));
          }
          break;

        case 'display_join':
          try {
            const game = await Game.findOne({ code: message.gameCode, isActive: true });

            if (!game) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Game not found' }
              }));
              return;
            }

            ws.gameCode = message.gameCode;
            ws.role = 'display';

            // Send the game with its current teams (scores are managed in the game session, not database)
            ws.send(JSON.stringify({
              type: 'joined_game',
              data: { game: game.toObject() }
            }));

            console.log(`Display joined game: ${message.gameCode} with ${game.teams?.length || 0} selected teams`);
          } catch (error) {
            console.error('Display join error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to join as display' }
            }));
          }
          break;

        case 'player_join':
          try {
            const game = await Game.findOne({ code: message.gameCode, isActive: true });

            if (!game) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Game not found' }
              }));
              return;
            }

            ws.gameCode = message.gameCode;
            ws.role = 'player';

            // Find the team by name only (ignore game code)
            console.log(`🔍 Looking for team: "${message.data.teamName}"`);
            console.log(`🔍 In game: "${message.gameCode}"`);

            const team = await Team.findOne({
              name: { $regex: new RegExp(`^${message.data.teamName}$`, 'i') }, // Case-insensitive search
              isActive: true
            });

            console.log(`🔍 Team search result:`, team ? `Found: ${team.name} (ID: ${team.id})` : 'Not found');

            // If not found, show available teams
            if (!team) {
              const allTeams = await Team.find({ isActive: true });

              console.log(`🔍 Available teams in database:`);
              allTeams.forEach((t, index) => {
                console.log(`   ${index + 1}. "${t.name}" (ID: ${t.id}, Game: ${t.gameCode})`);
              });

              let errorMessage = `Team "${message.data.teamName}" not found.`;

              if (allTeams.length > 0) {
                errorMessage += ` Available teams: ${allTeams.map(t => t.name).join(', ')}`;
              } else {
                errorMessage += ` No teams exist yet. Please create teams first.`;
              }

              ws.send(JSON.stringify({
                type: 'error',
                data: { message: errorMessage }
              }));
              return;
            }

            ws.teamId = team.id;
            ws.teamName = team.name;

            console.log(`✅ Sending joined_game with teamId: ${team.id}, teamName: ${team.name}`);

            const responseData = {
              game: game.toObject(),
              teamId: team.id,
              teamName: team.name
            };

            console.log(`📤 Response data:`, JSON.stringify(responseData, null, 2));

            ws.send(JSON.stringify({
              type: 'joined_game',
              data: responseData
            }));

            // Notify host of new player joining team
            broadcast(message.gameCode, {
              type: 'player_joined_team',
              data: {
                teamId: team.id,
                teamName: team.name
              }
            }, ws.id);

            console.log(`✅ Player joined team: ${team.name} in game ${message.gameCode}`);
          } catch (error) {
            console.error('❌ Join game error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to join game: ' + error.message }
            }));
          }
          break;

        case 'buzzer_press':
          try {
            console.log('🔔 Buzzer press received:', message);
            const game = await Game.findOne({ code: message.gameCode, isActive: true });

            if (!game) {
              console.log('❌ Game not found:', message.gameCode);
              return;
            }

            console.log('🎮 Current game state:', game.gameState);
            console.log('🔍 Current buzzer state:', game.buzzerPressed);

            if (game.gameState !== 'buzzer') {
              console.log('❌ Game state is not buzzer:', game.gameState);
              return;
            }

            // Check if buzzer was already pressed
            if (game.buzzerPressed) {
              const existingTeamName = game.buzzerPressed.teamName || 'Unknown Team';
              console.log('⚠️ Buzzer already pressed by:', existingTeamName);
              console.log('⚠️ Full buzzer data:', JSON.stringify(game.buzzerPressed));

              // Force clear the buzzer and allow this press
              console.log('🔄 Force clearing buzzer to allow new press');
              game.buzzerPressed = null;
              await game.save();
              console.log('✅ Buzzer cleared, proceeding with new press');
            }

            const teamId = message.data?.teamId || ws.teamId;
            console.log('🔍 Looking for team with ID:', teamId);

            const team = await Team.findOne({ id: teamId, isActive: true });

            if (!team) {
              console.error('❌ Team not found for buzzer press:', teamId);
              const availableTeams = await Team.find({ isActive: true }).select('id name');
              console.log('Available teams:', availableTeams);
              return;
            }

            console.log('✅ Team found for buzzer:');
            console.log('   Team ID:', team.id);
            console.log('   Team Name:', team.name);
            console.log('   Full team object:', JSON.stringify(team, null, 2));

            // Update game state
            game.buzzerPressed = {
              teamId: team.id,
              teamName: team.name,
              timestamp: Date.now()
            };
            game.gameState = 'answering';

            await game.save();
            console.log('✅ Game saved with buzzer pressed by:', team.name);

            const buzzerData = {
              teamId: team.id,
              teamName: team.name,
              timestamp: Date.now()
            };

            console.log('📤 Broadcasting buzzer_pressed to all clients:');
            console.log('   buzzerData:', JSON.stringify(buzzerData, null, 2));

            // Use broadcast function to send to all clients
            broadcast(message.gameCode, {
              type: 'buzzer_pressed',
              data: buzzerData
            });

            // Also send game update to sync the full game state
            console.log('📤 Broadcasting game_update');
            console.log('   game.buzzerPressed:', JSON.stringify(game.buzzerPressed, null, 2));

            const gameObject = game.toObject();
            console.log('   gameObject.buzzerPressed:', JSON.stringify(gameObject.buzzerPressed, null, 2));

            broadcast(message.gameCode, {
              type: 'game_update',
              data: { game: gameObject }
            });

            console.log(`🎉 Buzzer pressed by team: ${team.name} - notifications sent`);
          } catch (error) {
            console.error('❌ Buzzer press error:', error);
          }
          break;

        case 'host_join':
          try {
            const game = await Game.findOne({ code: message.gameCode, isActive: true });

            if (!game) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Game not found' }
              }));
              return;
            }

            ws.gameCode = message.gameCode;
            ws.role = 'host';

            // Load current teams from database
            const currentTeams = await Team.find({ gameCode: message.gameCode, isActive: true });
            const currentPlayers = await Player.find({ gameCode: message.gameCode, isActive: true });

            // Build teams with their players
            const teamsWithPlayers = currentTeams.map(team => ({
              id: team.id,
              name: team.name,
              score: team.score || 0,
              strikes: team.strikes || 0,
              players: currentPlayers.filter(p => p.teamId === team.id).map(p => ({
                id: p.id,
                name: p.name,
                teamId: p.teamId,
                isConnected: p.isConnected
              }))
            }));

            // Update game with current teams
            const gameWithTeams = {
              ...game.toObject(),
              teams: teamsWithPlayers
            };

            ws.send(JSON.stringify({
              type: 'joined_game',
              data: { game: gameWithTeams }
            }));

            console.log(`Host rejoined game: ${message.gameCode} with ${currentTeams.length} teams`);
          } catch (error) {
            console.error('Host join error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to join as host' }
            }));
          }
          break;

        case 'load_all_teams':
          try {
            console.log('📥 Received load_all_teams request');
            console.log('🔍 Attempting to query Team collection...');

            // Load all teams (not filtered by game code)
            const allTeams = await Team.find({ isActive: true });

            console.log(`🔍 Found ${allTeams.length} active teams in database`);

            console.log('📊 Teams result:');
            allTeams.forEach((team, index) => {
              console.log(`   ${index + 1}. ${team.name} (Game: ${team.gameCode}, ID: ${team.id}, Active: ${team.isActive})`);
            });

            // Load all players for these teams
            const allPlayers = await Player.find({
              isActive: true
            });

            console.log(`🔍 Found ${allPlayers.length} players in database`);

            // Build teams with their players
            const teamsWithPlayers = allTeams.map(team => ({
              id: team.id,
              name: team.name,
              gameCode: team.gameCode, // Include gameCode for reference
              score: team.score || 0,
              strikes: team.strikes || 0,
              players: allPlayers.filter(p => p.teamId === team.id).map(p => ({
                id: p.id,
                name: p.name,
                teamId: p.teamId,
                isConnected: p.isConnected
              }))
            }));

            console.log('📤 Sending teams_loaded response with teams:', teamsWithPlayers.map(t => `${t.name} (${t.gameCode})`));

            ws.send(JSON.stringify({
              type: 'teams_loaded',
              data: { teams: teamsWithPlayers }
            }));

            console.log(`✅ Loaded ${allTeams.length} teams for selection`);
          } catch (error) {
            console.error('❌ Load teams error:', error);
            console.error('❌ Error stack:', error.stack);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to load teams: ' + error.message }
            }));
          }
          break;

        case 'load_all_questions':
          try {
            console.log('📥 Received load_all_questions request');
            const allQuestions = await getAllQuestions();
            
            ws.send(JSON.stringify({
              type: 'questions_loaded',
              data: { questions: allQuestions }
            }));

            console.log(`✅ Loaded ${allQuestions.length} available questions for selection`);
          } catch (error) {
            console.error('❌ Load questions error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to load questions: ' + error.message }
            }));
          }
          break;

        case 'reset_used_questions':
          try {
            console.log('📥 Received reset_used_questions request');
            
            // Delete all used questions from the database
            const result = await UsedQuestion.deleteMany({});
            console.log(`✅ Cleared ${result.deletedCount} used questions`);
            
            ws.send(JSON.stringify({
              type: 'used_questions_reset',
              data: { 
                message: `Cleared ${result.deletedCount} used questions. All questions are now available.`,
                deletedCount: result.deletedCount
              }
            }));
          } catch (error) {
            console.error('❌ Reset used questions error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to reset used questions: ' + error.message }
            }));
          }
          break;

        case 'load_all_teams_standalone':
          try {
            console.log('📥 Received load_all_teams_standalone request');
            
            // Load ALL teams (not filtered by game code)
            const allTeams = await Team.find({ isActive: true });
            const allPlayers = await Player.find({ isActive: true });

            console.log(`📊 Found ${allTeams.length} teams and ${allPlayers.length} players (standalone)`);

            // Build teams with their players
            const teamsWithPlayers = allTeams.map(team => ({
              id: team.id,
              name: team.name,
              score: team.score || 0,
              strikes: team.strikes || 0,
              players: allPlayers.filter(p => p.teamId === team.id).map(p => ({
                id: p.id,
                name: p.name,
                teamId: p.teamId,
                isConnected: p.isConnected
              }))
            }));

            ws.send(JSON.stringify({
              type: 'teams_loaded',
              data: { teams: teamsWithPlayers }
            }));

            console.log(`✅ Loaded ${allTeams.length} teams for standalone management`);
          } catch (error) {
            console.error('❌ Load teams standalone error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to load teams: ' + error.message }
            }));
          }
          break;

        case 'team_management_action_standalone':
          console.log('Received standalone team management action:', message.data);
          try {
            const action = message.data;
            console.log('Processing standalone action:', action.type);

            switch (action.type) {
              case 'create_team':
                const newTeamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newTeam = new Team({
                  id: newTeamId,
                  name: action.teamName,
                  gameCode: 'GLOBAL',
                  score: 0,
                  strikes: 0
                });
                await newTeam.save();
                console.log(`✅ Created team in DB: ${action.teamName} (GLOBAL)`);
                break;

              case 'delete_team':
                await Team.deleteOne({ id: action.teamId });
                await Player.updateMany(
                  { teamId: action.teamId },
                  { $set: { teamId: null, teamName: null } }
                );
                console.log(`✅ Deleted team from DB: ${action.teamId}`);
                break;

              case 'add_player_to_team':
                const targetTeam = await Team.findOne({ id: action.teamId });
                if (targetTeam) {
                  let player = await Player.findOne({ id: action.playerId });

                  if (player) {
                    player.teamId = action.teamId;
                    player.teamName = targetTeam.name;
                    player.gameCode = 'GLOBAL';
                    await player.save();
                  } else {
                    player = new Player({
                      id: action.playerId,
                      name: action.playerName,
                      gameCode: 'GLOBAL',
                      teamId: action.teamId,
                      teamName: targetTeam.name,
                      isConnected: true
                    });
                    await player.save();
                  }
                  console.log(`✅ Added player to DB: ${action.playerName} -> ${targetTeam.name}`);
                }
                break;

              case 'remove_player_from_team':
                await Player.updateOne(
                  { id: action.playerId },
                  { $set: { teamId: null, teamName: null } }
                );
                console.log(`✅ Removed player from team in DB: ${action.playerId}`);
                break;

              case 'move_player':
                const toTeam = await Team.findOne({ id: action.toTeamId });
                if (toTeam) {
                  await Player.updateOne(
                    { id: action.playerId },
                    { $set: { teamId: action.toTeamId, teamName: toTeam.name } }
                  );
                  console.log(`✅ Moved player in DB: ${action.playerId} -> ${toTeam.name}`);
                }
                break;

              case 'rename_team':
                const teamToRename = await Team.findOne({ id: action.teamId });
                if (teamToRename) {
                  teamToRename.name = action.newName;
                  await teamToRename.save();
                  await Player.updateMany(
                    { teamId: action.teamId },
                    { $set: { teamName: action.newName } }
                  );
                  console.log(`✅ Renamed team in DB: ${action.newName}`);
                }
                break;
            }

            // Fetch updated teams and players
            const teams = await Team.find({ isActive: true });
            const players = await Player.find({ isActive: true });

            console.log(`📊 Fetched ${teams.length} teams and ${players.length} players (standalone)`);

            const teamsWithPlayers = teams.map(team => ({
              id: team.id,
              name: team.name,
              score: team.score || 0,
              strikes: team.strikes || 0,
              players: players.filter(p => p.teamId === team.id).map(p => ({
                id: p.id,
                name: p.name,
                teamId: p.teamId,
                isConnected: p.isConnected
              }))
            }));

            // Send updated teams back
            ws.send(JSON.stringify({
              type: 'teams_loaded',
              data: { teams: teamsWithPlayers }
            }));

            console.log(`✅ Standalone team management action completed: ${action.type}`);
          } catch (error) {
            console.error('❌ Standalone team management action error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to perform team management action: ' + error.message }
            }));
          }
          break;

        case 'select_questions':
          try {
            console.log('📥 Received select_questions request');
            const game = await Game.findOne({ code: message.gameCode, isActive: true });

            if (!game) {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Game not found' }
              }));
              return;
            }

            const { round1Questions, round2Questions, round3Questions } = message.data;

            // Update game rounds with selected questions (don't mark as used yet)
            game.rounds[0].questions = round1Questions;
            game.rounds[1].questions = round2Questions;
            game.rounds[2].questions = round3Questions;
            game.questionsSelected = true;

            await game.save();

            // Broadcast updated game to all clients
            broadcast(message.gameCode, {
              type: 'game_update',
              data: { game: game.toObject() }
            });

            console.log(`✅ Questions selected for game ${message.gameCode} (will be marked as used when game ends)`);
          } catch (error) {
            console.error('❌ Select questions error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              data: { message: 'Failed to select questions: ' + error.message }
            }));
          }
          break;

        case 'host_action':
          try {
            const game = await Game.findOne({ code: message.gameCode, isActive: true });

            if (!game) {
              console.log('❌ host_action: Game not found for code:', message.gameCode);
              return;
            }

            // Check hostId OR fallback to role+gameCode check (handles reconnections where ws.id changes)
            if (game.hostId !== ws.id) {
              if (ws.role === 'host' && ws.gameCode === message.gameCode) {
                console.log('⚠️ host_action: hostId mismatch but role/gameCode match - updating hostId');
                game.hostId = ws.id;
                await game.save();
              } else {
                console.log('❌ host_action: Unauthorized - hostId mismatch and role/gameCode check failed');
                console.log(`   game.hostId=${game.hostId}, ws.id=${ws.id}, ws.role=${ws.role}, ws.gameCode=${ws.gameCode}`);
                return;
              }
            }

            const action = message.data;

            switch (action.type) {
              case 'select_game_teams':
                console.log('Selecting teams for game:', action.data);

                // Load the selected teams from database
                const selectedTeams = await Team.find({
                  id: { $in: [action.data.team1Id, action.data.team2Id] },
                  isActive: true
                });

                console.log(`Found ${selectedTeams.length} teams for selection`);
                selectedTeams.forEach(team => {
                  console.log(`  - ${team.name} (${team.gameCode})`);
                });

                if (selectedTeams.length === 2) {
                  // Load players for these teams
                  const players = await Player.find({
                    teamId: { $in: [action.data.team1Id, action.data.team2Id] },
                    isActive: true
                  });

                  console.log(`Found ${players.length} players for selected teams`);

                  // Build teams with their players and RESET scores to 0 for new game
                  const teamsWithPlayers = selectedTeams.map(team => ({
                    id: team.id,
                    name: team.name,
                    score: 0, // Start fresh with 0 points for this game
                    strikes: 0,
                    players: players.filter(p => p.teamId === team.id).map(p => ({
                      id: p.id,
                      name: p.name,
                      teamId: p.teamId,
                      isConnected: p.isConnected
                    }))
                  }));

                  // Update game with selected teams
                  game.teams = teamsWithPlayers;
                  game.currentTeamTurn = teamsWithPlayers[0].id;
                  await game.save();

                  console.log(`✅ Selected teams for game with scores reset to 0: ${teamsWithPlayers.map(t => t.name).join(' vs ')}`);

                  // Send confirmation back to client
                  ws.send(JSON.stringify({
                    type: 'teams_selected',
                    data: {
                      teams: teamsWithPlayers,
                      message: `Teams selected: ${teamsWithPlayers.map(t => t.name).join(' vs ')}`
                    }
                  }));

                  // Broadcast updated game state to all clients
                  broadcast(message.gameCode, {
                    type: 'game_update',
                    data: { game: game.toObject() }
                  });

                } else {
                  console.error(`❌ Could not find both teams. Found: ${selectedTeams.length}`);
                  ws.send(JSON.stringify({
                    type: 'error',
                    data: { message: `Could not find selected teams. Found ${selectedTeams.length} of 2.` }
                  }));
                }
                break;
              case 'create_team':
                console.log('Creating team:', action.data.teamName);
                const newTeam = {
                  id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  name: action.data.teamName,
                  score: 0,
                  players: [],
                  strikes: 0
                };
                game.teams.push(newTeam);
                console.log(`Created team: ${action.data.teamName}, Teams now:`, game.teams.length);
                break;

              case 'add_player_to_team':
                console.log('Adding player to team:', action.data);
                const targetTeam = game.teams.find(t => t.id === action.data.teamId);
                if (targetTeam) {
                  // Remove player from any existing team first
                  game.teams.forEach(team => {
                    team.players = team.players.filter(p => p.id !== action.data.playerId);
                  });

                  // Add to new team
                  targetTeam.players.push({
                    id: action.data.playerId,
                    name: action.data.playerName,
                    teamId: action.data.teamId,
                    isConnected: true
                  });
                  console.log(`Added ${action.data.playerName} to ${targetTeam.name}`);
                }
                break;

              case 'remove_player_from_team':
                console.log('Removing player from team:', action.data);
                const teamWithPlayer = game.teams.find(t => t.id === action.data.teamId);
                if (teamWithPlayer) {
                  const player = teamWithPlayer.players.find(p => p.id === action.data.playerId);
                  if (player) {
                    teamWithPlayer.players = teamWithPlayer.players.filter(p => p.id !== action.data.playerId);
                    console.log(`Removed ${player.name} from ${teamWithPlayer.name}`);
                  }
                }
                break;

              case 'start_game':
                game.gameState = 'playing';
                break;

              case 'enable_buzzer':
                console.log('🔔 Enabling buzzer - clearing previous state');
                game.gameState = 'buzzer';
                game.buzzerPressed = null; // Clear any previous buzzer press

                // Save and broadcast immediately
                await game.save();
                console.log('✅ Buzzer enabled and cleared');

                broadcast(message.gameCode, {
                  type: 'buzzer_enabled',
                  data: {
                    gameState: 'buzzer',
                    message: 'Buzzer enabled - ready to buzz!'
                  }
                });

                broadcast(message.gameCode, {
                  type: 'game_update',
                  data: { game: game.toObject() }
                });

                console.log(`Host action completed: ${action.type}`);
                return;

              case 'add_points':
                console.log(`💰 Adding ${action.data.points} points to team ${action.data.teamId}`);
                console.log(`📊 Current game teams BEFORE update:`, game.teams.map(t => `${t.name}: ${t.score || 0}`));

                // Find team in game object
                const pointsTeam = game.teams.find(t => t.id === action.data.teamId);
                if (!pointsTeam) {
                  console.error(`❌ Team not found in game: ${action.data.teamId}`);
                  console.error(`   Available teams:`, game.teams.map(t => `${t.id}: ${t.name}`));
                  break;
                }

                // Update team score in game object
                const oldScore = pointsTeam.score || 0;
                const newScore = oldScore + action.data.points;
                pointsTeam.score = newScore;

                console.log(`✅ Team ${pointsTeam.name}: ${oldScore} + ${action.data.points} = ${newScore}`);
                console.log(`📊 Current game teams AFTER update:`, game.teams.map(t => `${t.name}: ${t.score || 0}`));

                // Also update the team in the database for leaderboard
                const dbTeam = await Team.findOne({ id: action.data.teamId, isActive: true });
                if (dbTeam) {
                  const dbOldScore = dbTeam.score || 0;
                  dbTeam.score = dbOldScore + action.data.points;
                  await dbTeam.save();
                  console.log(`✅ Database team ${dbTeam.name}: ${dbOldScore} + ${action.data.points} = ${dbTeam.score}`);
                }

                // Mark the game as modified to ensure Mongoose saves it
                game.markModified('teams');

                // Save the game with updated scores
                await game.save();

                console.log(`📊 Game saved. Verifying teams:`, game.teams.map(t => `${t.name}: ${t.score || 0}`));

                // Build scores object from current game state
                const scores = {};
                game.teams.forEach(team => {
                  scores[team.id] = team.score || 0;
                });

                console.log('📊 Scores to broadcast:', scores);
                console.log('📤 Broadcasting points_updated to all clients (including leaderboard)');

                // Send points_updated to update all clients
                broadcast(message.gameCode, {
                  type: 'points_updated',
                  data: { scores }
                });

                // Also send teams_loaded to leaderboard to refresh all teams
                const allTeams = await Team.find({ isActive: true });
                const allPlayers = await Player.find({ isActive: true });

                const teamsWithPlayers = allTeams.map(team => ({
                  id: team.id,
                  name: team.name,
                  score: team.score || 0,
                  strikes: team.strikes || 0,
                  players: allPlayers.filter(p => p.teamId === team.id).map(p => ({
                    id: p.id,
                    name: p.name,
                    teamId: p.teamId,
                    isConnected: p.isConnected
                  }))
                }));

                broadcast(message.gameCode, {
                  type: 'teams_loaded',
                  data: { teams: teamsWithPlayers }
                });

                console.log(`✅ Host action completed: ${action.type}`);
                return;

              case 'reveal_answer':
                console.log('🎯 Revealing answer:', action.data.answerIndex);
                const currentRound = game.rounds[game.currentRoundIndex];
                const currentQuestion = currentRound.questions[currentRound.currentQuestionIndex];
                const answerIndex = action.data.answerIndex;

                if (currentQuestion.answers[answerIndex]) {
                  currentQuestion.answers[answerIndex].revealed = true;
                  console.log(`✅ Revealed: ${currentQuestion.answers[answerIndex].text} (${currentQuestion.answers[answerIndex].points} points)`);

                  // DON'T automatically assign points - let host choose which team gets them
                  console.log('⚠️ Points not auto-assigned - host must manually assign to team');
                }

                // Save and broadcast immediately, then return to prevent general broadcast
                await game.save();
                broadcast(message.gameCode, {
                  type: 'answer_revealed',
                  data: {
                    answerIndex,
                    answer: currentQuestion.answers[answerIndex],
                    question: currentQuestion
                  }
                });
                console.log(`Host action completed: ${action.type}`);
                return;

              case 'add_strike':
                console.log('➕ Adding strike to team:', action.data.teamId);
                console.log('   Current game teams:', game.teams.map(t => `${t.name}: ${t.strikes || 0} strikes`));

                // Find the team index in the game document
                const strikeTeamIndex = game.teams.findIndex(t => t.id === action.data.teamId);

                if (strikeTeamIndex === -1) {
                  console.error('❌ Team not found:', action.data.teamId);
                  console.error('   Available teams:', game.teams.map(t => `${t.id}: ${t.name}`));
                  return;
                }

                const strikeTeam = game.teams[strikeTeamIndex];
                const currentStrikes = strikeTeam.strikes || 0;

                if (currentStrikes >= 3) {
                  console.log(`⚠️ Team ${strikeTeam.name} already has 3 strikes`);
                  return;
                }

                const newStrikes = currentStrikes + 1;
                console.log(`   Team ${strikeTeam.name}: ${currentStrikes} → ${newStrikes} strikes`);

                // Update the strikes using Mongoose's $set operator for the specific team
                // This ensures the change is properly tracked and saved
                await Game.updateOne(
                  { _id: game._id, 'teams.id': action.data.teamId },
                  { $set: { 'teams.$.strikes': newStrikes } }
                );

                console.log(`   ✅ Game document updated with $set operator`);

                // Also update the Team collection in the database for consistency
                const dbStrikeTeam = await Team.findOne({ id: action.data.teamId, isActive: true });
                if (dbStrikeTeam) {
                  dbStrikeTeam.strikes = newStrikes;
                  await dbStrikeTeam.save();
                  console.log(`   ✅ Database Team ${dbStrikeTeam.name} strikes updated to ${newStrikes}`);
                }

                // Reload the game to get the updated state
                const updatedGame = await Game.findOne({ code: message.gameCode, isActive: true });
                console.log('   Teams after update:', updatedGame.teams.map(t => `${t.name}: ${t.strikes || 0} strikes`));

                // Broadcast the updated game
                broadcast(message.gameCode, {
                  type: 'game_update',
                  data: { game: updatedGame.toObject() }
                });

                console.log(`✅ Host action completed: ${action.type}`);
                return; // Exit early, don't continue to the general save/broadcast

              case 'reset_buzzer':
                console.log('🔄 Resetting buzzer');
                game.buzzerPressed = null;
                game.gameState = 'buzzer';

                // Save and broadcast immediately
                await game.save();
                console.log('✅ Buzzer reset - game state back to buzzer');

                broadcast(message.gameCode, {
                  type: 'buzzer_reset',
                  data: {
                    gameState: 'buzzer',
                    message: 'Buzzer has been reset - ready for next buzz!'
                  }
                });

                broadcast(message.gameCode, {
                  type: 'game_update',
                  data: { game: game.toObject() }
                });

                console.log(`Host action completed: ${action.type}`);
                return;

              case 'next_question':
                console.log('➡️ Moving to next question');
                const round = game.rounds[game.currentRoundIndex];
                if (round.currentQuestionIndex < round.questions.length - 1) {
                  round.currentQuestionIndex += 1;
                  console.log(`✅ Next question in round ${game.currentRoundIndex + 1}`);
                } else if (game.currentRoundIndex < game.rounds.length - 1) {
                  game.currentRoundIndex += 1;
                  game.rounds[game.currentRoundIndex].currentQuestionIndex = 0;
                  console.log(`✅ Next round: ${game.currentRoundIndex + 1}`);
                } else {
                  game.gameState = 'finished';
                  console.log('🏁 Game finished');
                }

                // Reset strikes and buzzer for new question
                game.teams.forEach(team => {
                  team.strikes = 0;
                });
                game.buzzerPressed = null;

                // Set to 'playing' state - host must manually enable buzzer
                if (game.gameState !== 'finished') {
                  game.gameState = 'playing';
                }

                // Hide question on display when moving to next question
                game.questionVisible = false;

                // Save and broadcast immediately, then return to prevent general broadcast
                await game.save();

                // Broadcast question change
                broadcast(message.gameCode, {
                  type: 'question_changed',
                  data: {
                    currentRoundIndex: game.currentRoundIndex,
                    currentQuestionIndex: game.rounds[game.currentRoundIndex].currentQuestionIndex,
                    gameState: game.gameState,
                    questionVisible: false
                  }
                });

                console.log(`Host action completed: ${action.type}`);
                return;

              case 'show_question':
                console.log('👁️ Showing question on display');
                game.questionVisible = true;
                await game.save();

                console.log('👁️ game.questionVisible after save:', game.questionVisible);
                const gameObj = game.toObject();
                console.log('👁️ gameObj.questionVisible:', gameObj.questionVisible);

                broadcast(message.gameCode, {
                  type: 'question_visibility_changed',
                  data: {
                    questionVisible: true
                  }
                });

                broadcast(message.gameCode, {
                  type: 'game_update',
                  data: { game: gameObj }
                });

                console.log(`Host action completed: ${action.type}`);
                return;

              case 'hide_question':
                console.log('👁️ Hiding question from display');
                game.questionVisible = false;
                await game.save();

                broadcast(message.gameCode, {
                  type: 'question_visibility_changed',
                  data: {
                    questionVisible: false
                  }
                });

                broadcast(message.gameCode, {
                  type: 'game_update',
                  data: { game: game.toObject() }
                });

                console.log(`Host action completed: ${action.type}`);
                return;

              case 'end_game':
                console.log('🏁 Ending game and marking questions as used');
                
                // Collect all questions from all rounds
                const allGameQuestions = [];
                game.rounds.forEach(round => {
                  if (round.questions && round.questions.length > 0) {
                    allGameQuestions.push(...round.questions);
                  }
                });

                console.log(`📝 Found ${allGameQuestions.length} questions to mark as used`);

                // Mark all questions as used in the database
                for (const question of allGameQuestions) {
                  try {
                    // Check if already marked as used
                    const existingUsed = await UsedQuestion.findOne({ questionId: question.id });
                    
                    if (!existingUsed) {
                      const usedQuestion = new UsedQuestion({
                        questionId: question.id,
                        questionText: question.text,
                        gameCode: message.gameCode,
                        usedAt: new Date()
                      });
                      await usedQuestion.save();
                      console.log(`✅ Marked question as used: ${question.id} - "${question.text}"`);
                    } else {
                      console.log(`⚠️ Question already marked as used: ${question.id}`);
                    }
                  } catch (err) {
                    console.error(`❌ Error marking question as used: ${question.id}`, err);
                  }
                }

                // Set game state to finished
                game.gameState = 'finished';
                await game.save();

                // Broadcast game ended
                broadcast(message.gameCode, {
                  type: 'game_ended',
                  data: {
                    message: 'Game has ended. Questions have been marked as used.',
                    questionsMarked: allGameQuestions.length
                  }
                });

                broadcast(message.gameCode, {
                  type: 'game_update',
                  data: { game: game.toObject() }
                });

                console.log(`✅ Game ended. ${allGameQuestions.length} questions marked as used.`);
                return;

              case 'manage_teams':
                if (action.data.operation === 'add_player') {
                  const targetTeam = game.teams.find(t => t.id === action.data.teamId);
                  if (targetTeam) {
                    targetTeam.players.push({
                      id: action.data.playerId,
                      name: action.data.playerName,
                      teamId: action.data.teamId,
                      isConnected: true
                    });
                  }
                } else if (action.data.operation === 'remove_player') {
                  const targetTeam = game.teams.find(t => t.id === action.data.teamId);
                  if (targetTeam) {
                    targetTeam.players = targetTeam.players.filter(p => p.id !== action.data.playerId);
                  }
                } else if (action.data.operation === 'create_team') {
                  const newTeam = {
                    id: `team_${Date.now()}`,
                    name: action.data.teamName,
                    score: 0,
                    players: [],
                    strikes: 0
                  };
                  game.teams.push(newTeam);
                }
                break;
            }

            console.log(`💾 Saving game after ${action.type} action`);
            console.log(`   Teams before save:`, game.teams.map(t => `${t.name}: ${t.strikes} strikes`));

            await game.save();

            console.log(`✅ Game saved successfully`);

            // Reload the game to verify it was saved correctly
            const reloadedGame = await Game.findOne({ code: message.gameCode, isActive: true });
            console.log(`   Teams after reload:`, reloadedGame.teams.map(t => `${t.name}: ${t.strikes} strikes`));

            console.log(`📡 Broadcasting game_update after ${action.type}`);
            const gameObject = reloadedGame.toObject();
            console.log(`   Teams in broadcast:`, gameObject.teams.map(t => `${t.name}: ${t.strikes} strikes, ${t.score} points`));

            broadcast(message.gameCode, {
              type: 'game_update',
              data: { game: gameObject }
            });

            console.log(`✅ Host action completed: ${action.type}`);
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
    console.log(`Client disconnected: ${ws.id}`);
  });
});

console.log('WebSocket server running on port 8080');
console.log('MongoDB connected to:', MONGODB_URI);

