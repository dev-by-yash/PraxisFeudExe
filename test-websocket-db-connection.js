// Test the exact same database connection and models as the WebSocket server
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection (same as WebSocket server)
const MONGODB_URI = 'mongodb+srv://yashm13114:sh5VlCTZNnkShVVP@cluster0.lgqyj4p.mongodb.net/praxisFeudExe';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Team Schema (exact copy from WebSocket server)
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

// Player Schema (exact copy from WebSocket server)
const PlayerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gameCode: { type: String, required: true },
  teamId: { type: String, default: null },
  teamName: { type: String, default: null },
  isConnected: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

PlayerSchema.index({ gameCode: 1 });
PlayerSchema.index({ teamId: 1 });
PlayerSchema.index({ id: 1 });

const Player = mongoose.model('Player', PlayerSchema);

async function testDatabaseQueries() {
  try {
    console.log('🔍 Testing WebSocket server database queries...');
    
    // Test 1: Query all teams (no filter)
    console.log('\n📊 Test 1: All teams (no filter)');
    const allTeamsNoFilter = await Team.find({});
    console.log(`   Found: ${allTeamsNoFilter.length} teams`);
    allTeamsNoFilter.forEach(team => {
      console.log(`   - ${team.name} (Game: ${team.gameCode}, Active: ${team.isActive})`);
    });
    
    // Test 2: Query active teams only
    console.log('\n📊 Test 2: Active teams only');
    const activeTeams = await Team.find({ isActive: true });
    console.log(`   Found: ${activeTeams.length} active teams`);
    activeTeams.forEach(team => {
      console.log(`   - ${team.name} (Game: ${team.gameCode})`);
    });
    
    // Test 3: Query teams for specific game
    console.log('\n📊 Test 3: Teams for game J1TY');
    const j1tyTeams = await Team.find({ gameCode: 'J1TY', isActive: true });
    console.log(`   Found: ${j1tyTeams.length} teams for J1TY`);
    j1tyTeams.forEach(team => {
      console.log(`   - ${team.name}`);
    });
    
    // Test 4: Query all players
    console.log('\n📊 Test 4: All players');
    const allPlayers = await Player.find({});
    console.log(`   Found: ${allPlayers.length} players`);
    allPlayers.forEach(player => {
      console.log(`   - ${player.name} (Team: ${player.teamName || 'None'}, Game: ${player.gameCode})`);
    });
    
    console.log('\n✅ Database connection test completed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database test error:', error);
    process.exit(1);
  }
}

mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
  testDatabaseQueries();
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});