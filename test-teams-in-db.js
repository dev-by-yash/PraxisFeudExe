const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://yashm13114:sh5VlCTZNnkShVVP@cluster0.lgqyj4p.mongodb.net/praxisFeudExe';

// Team Schema
const TeamSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  gameCode: { type: String, required: true },
  score: { type: Number, default: 0 },
  strikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Team = mongoose.model('Team', TeamSchema);

mongoose.connect(MONGODB_URI).then(async () => {
  console.log('📊 Checking teams in database...');
  
  // Check all teams
  const allTeams = await Team.find({});
  console.log(`\n🏆 Total teams in database: ${allTeams.length}`);
  
  if (allTeams.length > 0) {
    console.log('\nTeams found:');
    allTeams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name} (Game: ${team.gameCode}, Active: ${team.isActive})`);
    });
    
    // Group by game code
    const teamsByGame = {};
    allTeams.forEach(team => {
      if (!teamsByGame[team.gameCode]) {
        teamsByGame[team.gameCode] = [];
      }
      teamsByGame[team.gameCode].push(team.name);
    });
    
    console.log('\n📋 Teams by Game Code:');
    Object.keys(teamsByGame).forEach(gameCode => {
      console.log(`  ${gameCode}: ${teamsByGame[gameCode].join(', ')}`);
    });
  } else {
    console.log('❌ No teams found in database');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('❌ Database error:', err);
  process.exit(1);
});