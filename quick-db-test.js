const WebSocket = require('ws');

console.log('🧪 Quick Database Test');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function() {
    console.log('✅ Connected');
    
    // Create game
    ws.send(JSON.stringify({
        type: 'host_create',
        data: {}
    }));
});

ws.on('message', function(data) {
    const message = JSON.parse(data.toString());
    
    if (message.type === 'game_created') {
        const gameCode = message.data.game.code;
        console.log('✅ Game created:', gameCode);
        
        // Join as team manager
        ws.send(JSON.stringify({
            type: 'team_manager_join',
            gameCode: gameCode,
            data: { role: 'team_manager' }
        }));
    }
    
    if (message.type === 'joined_game') {
        console.log('✅ Joined as team manager');
        
        // Create team
        ws.send(JSON.stringify({
            type: 'team_management_action',
            gameCode: message.data.game.code,
            data: {
                type: 'create_team',
                teamName: 'DB Test Team'
            }
        }));
    }
    
    if (message.type === 'team_updated') {
        console.log('✅ Team created successfully!');
        console.log('Teams:', message.data.game.teams.map(t => t.name));
        console.log('🎉 Database test complete!');
        process.exit(0);
    }
    
    if (message.type === 'error') {
        console.error('❌ Error:', message.data.message);
        process.exit(1);
    }
});

setTimeout(() => {
    console.log('⏰ Timeout');
    process.exit(1);
}, 5000);