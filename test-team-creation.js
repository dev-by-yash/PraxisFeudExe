const WebSocket = require('ws');

// Test team creation directly
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function() {
    console.log('Connected to WebSocket server');
    
    // First, create a game
    ws.send(JSON.stringify({
        type: 'host_create',
        data: {}
    }));
});

ws.on('message', function(data) {
    const message = JSON.parse(data.toString());
    console.log('Received:', message.type, message.data);
    
    if (message.type === 'game_created') {
        const gameCode = message.data.game.code;
        console.log('Game created with code:', gameCode);
        
        // Now test team management
        setTimeout(() => {
            console.log('Testing team creation...');
            ws.send(JSON.stringify({
                type: 'team_management_action',
                gameCode: gameCode,
                data: {
                    type: 'create_team',
                    teamName: 'Test Team ' + Date.now()
                }
            }));
        }, 1000);
    }
    
    if (message.type === 'team_updated') {
        console.log('Team updated successfully!');
        console.log('Teams:', message.data.game.teams.map(t => t.name));
        process.exit(0);
    }
});

ws.on('error', function(error) {
    console.error('WebSocket error:', error);
});

ws.on('close', function() {
    console.log('WebSocket connection closed');
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('Test timeout');
    process.exit(1);
}, 10000);