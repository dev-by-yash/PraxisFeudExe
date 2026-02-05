const WebSocket = require('ws');

console.log('🧪 Testing Host Loading Teams');

const ws = new WebSocket('ws://localhost:8080');
let gameCode = '';

ws.on('open', function() {
    console.log('✅ Connected to WebSocket server');
    
    // Create a new game as host
    ws.send(JSON.stringify({
        type: 'host_create',
        data: {}
    }));
});

ws.on('message', function(data) {
    const message = JSON.parse(data.toString());
    console.log('📨 Received message:', message.type);
    
    if (message.type === 'game_created') {
        gameCode = message.data.game.code;
        console.log('✅ Game created with code:', gameCode);
        console.log('   Initial teams in game:', message.data.game.teams.length);
        
        // Now try to load all teams for this game
        console.log('🔍 Requesting all teams for game:', gameCode);
        ws.send(JSON.stringify({
            type: 'load_all_teams',
            gameCode: gameCode
        }));
    }
    
    if (message.type === 'teams_loaded') {
        console.log('✅ Teams loaded successfully!');
        console.log('   Number of teams:', message.data.teams.length);
        console.log('   Team names:', message.data.teams.map(t => t.name));
        
        if (message.data.teams.length === 0) {
            console.log('⚠️  No teams found for this game code');
            console.log('   This is expected for a new game');
            console.log('   Teams need to be created in team management first');
        }
        
        process.exit(0);
    }
    
    if (message.type === 'error') {
        console.error('❌ Error:', message.data.message);
        process.exit(1);
    }
});

ws.on('error', function(error) {
    console.error('❌ WebSocket error:', error);
    process.exit(1);
});

setTimeout(() => {
    console.log('⏰ Test timeout');
    process.exit(1);
}, 10000);