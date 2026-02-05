const WebSocket = require('ws');

// Test team creation exactly like the team management page
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
    console.log('Received:', message.type);
    
    if (message.type === 'game_created') {
        const gameCode = message.data.game.code;
        console.log('Game created with code:', gameCode);
        
        // Now join as team manager (like the team management page does)
        setTimeout(() => {
            console.log('Joining as team manager...');
            ws.send(JSON.stringify({
                type: 'team_manager_join',
                gameCode: gameCode,
                data: { role: 'team_manager' }
            }));
        }, 1000);
    }
    
    if (message.type === 'joined_game') {
        console.log('Joined as team manager successfully');
        const gameCode = message.data.game.code;
        
        // Now test team management action (exactly like team management page)
        setTimeout(() => {
            console.log('Testing team management action...');
            ws.send(JSON.stringify({
                type: 'team_management_action',
                gameCode: gameCode,
                data: {
                    type: 'create_team',
                    teamName: 'Test Team Direct'
                }
            }));
        }, 1000);
    }
    
    if (message.type === 'team_updated') {
        console.log('SUCCESS: Team updated!');
        console.log('Teams:', message.data.game.teams.map(t => t.name));
        process.exit(0);
    }
    
    if (message.type === 'error') {
        console.error('Error:', message.data.message);
        process.exit(1);
    }
});

ws.on('error', function(error) {
    console.error('WebSocket error:', error);
});

ws.on('close', function() {
    console.log('WebSocket connection closed');
});

// Timeout after 15 seconds
setTimeout(() => {
    console.log('Test timeout - no response received');
    process.exit(1);
}, 15000);