const WebSocket = require('ws');

// Test only the team_manager_join functionality
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function() {
    console.log('Connected to WebSocket server');
    
    // Try to join an existing game as team manager
    // Use a game code that should exist (from your logs: W7JI)
    console.log('Testing team_manager_join with game code W7JI...');
    ws.send(JSON.stringify({
        type: 'team_manager_join',
        gameCode: 'W7JI',
        data: { role: 'team_manager' }
    }));
});

ws.on('message', function(data) {
    const message = JSON.parse(data.toString());
    console.log('Received message type:', message.type);
    console.log('Full message:', JSON.stringify(message, null, 2));
    
    if (message.type === 'joined_game') {
        console.log('SUCCESS: Team manager joined successfully!');
        console.log('Game has', message.data.game.teams.length, 'teams');
        process.exit(0);
    }
    
    if (message.type === 'error') {
        console.error('ERROR:', message.data.message);
        process.exit(1);
    }
});

ws.on('error', function(error) {
    console.error('WebSocket error:', error);
    process.exit(1);
});

ws.on('close', function() {
    console.log('WebSocket connection closed');
});

// Timeout after 5 seconds
setTimeout(() => {
    console.log('Timeout - no response received');
    process.exit(1);
}, 5000);