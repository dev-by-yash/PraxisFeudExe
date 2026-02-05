const WebSocket = require('ws');

console.log('🧪 Testing Host with Existing Game Code');

const ws = new WebSocket('ws://localhost:8080');
const existingGameCode = 'J1TY'; // This game has 2 teams: praxis, apexia

ws.on('open', function() {
    console.log('✅ Connected to WebSocket server');
    
    // Try to join existing game as host
    console.log('🔍 Trying to load teams for existing game:', existingGameCode);
    ws.send(JSON.stringify({
        type: 'load_all_teams',
        gameCode: existingGameCode
    }));
});

ws.on('message', function(data) {
    const message = JSON.parse(data.toString());
    console.log('📨 Received message:', message.type);
    
    if (message.type === 'teams_loaded') {
        console.log('✅ Teams loaded successfully!');
        console.log('   Number of teams:', message.data.teams.length);
        console.log('   Team names:', message.data.teams.map(t => t.name));
        
        if (message.data.teams.length > 0) {
            console.log('🎉 SUCCESS: Found teams for existing game!');
            message.data.teams.forEach(team => {
                console.log(`   - ${team.name} (${team.players.length} players)`);
            });
        }
        
        process.exit(0);
    }
    
    if (message.type === 'error') {
        console.error('❌ Error:', message.data.message);
        process.exit(1);
    }
});

setTimeout(() => {
    console.log('⏰ Test timeout');
    process.exit(1);
}, 5000);