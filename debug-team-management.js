const WebSocket = require('ws');

// Debug team management step by step
const ws = new WebSocket('ws://localhost:8080');

let gameCode = '';

ws.on('open', function() {
    console.log('✅ Connected to WebSocket server');
    
    // Step 1: Create a game first
    console.log('📝 Step 1: Creating game...');
    ws.send(JSON.stringify({
        type: 'host_create',
        data: {}
    }));
});

ws.on('message', function(data) {
    const message = JSON.parse(data.toString());
    console.log('📨 Received:', message.type);
    
    if (message.type === 'game_created') {
        gameCode = message.data.game.code;
        console.log('✅ Step 1 Complete: Game created with code:', gameCode);
        console.log('   Teams in game:', message.data.game.teams.length);
        
        // Step 2: Join as team manager
        console.log('📝 Step 2: Joining as team manager...');
        setTimeout(() => {
            ws.send(JSON.stringify({
                type: 'team_manager_join',
                gameCode: gameCode,
                data: { role: 'team_manager' }
            }));
        }, 500);
    }
    
    if (message.type === 'joined_game') {
        console.log('✅ Step 2 Complete: Joined as team manager');
        console.log('   Game loaded with teams:', message.data.game.teams.length);
        
        // Step 3: Create a team
        console.log('📝 Step 3: Creating team...');
        setTimeout(() => {
            ws.send(JSON.stringify({
                type: 'team_management_action',
                gameCode: gameCode,
                data: {
                    type: 'create_team',
                    teamName: 'Debug Team ' + Date.now()
                }
            }));
        }, 500);
    }
    
    if (message.type === 'team_updated') {
        console.log('✅ Step 3 Complete: Team created successfully!');
        console.log('   Teams now:', message.data.game.teams.map(t => t.name));
        console.log('🎉 All steps completed successfully!');
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

ws.on('close', function() {
    console.log('🔌 WebSocket connection closed');
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('⏰ Test timeout - something went wrong');
    process.exit(1);
}, 10000);