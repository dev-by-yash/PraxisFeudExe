const WebSocket = require('ws');

console.log('🧪 Testing Fixed Host Team Loading');

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
        
        // Simulate clicking "Select Teams for Game" button
        console.log('🎯 Simulating "Select Teams for Game" button click...');
        ws.send(JSON.stringify({
            type: 'load_all_teams',
            gameCode: gameCode
        }));
    }
    
    if (message.type === 'teams_loaded') {
        console.log('✅ Teams loaded successfully!');
        console.log('   Number of teams:', message.data.teams.length);
        
        if (message.data.teams.length > 0) {
            console.log('🎉 SUCCESS: Teams found for dropdown!');
            message.data.teams.forEach(team => {
                console.log(`   - ${team.name} (Game: ${team.gameCode}, Players: ${team.players.length})`);
            });
        } else {
            console.log('⚠️  No teams found - this means no teams exist in database');
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
}, 10000);