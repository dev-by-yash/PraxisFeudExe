const WebSocket = require('ws');

// Test the new database structure
const ws = new WebSocket('ws://localhost:8080');

let gameCode = '';

ws.on('open', function() {
    console.log('🔌 Connected to WebSocket server');
    
    // Step 1: Create a game
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
        console.log('   Teams loaded:', message.data.game.teams.length);
        
        // Step 3: Create a team (should save to separate Teams collection)
        console.log('📝 Step 3: Creating team in separate DB collection...');
        setTimeout(() => {
            ws.send(JSON.stringify({
                type: 'team_management_action',
                gameCode: gameCode,
                data: {
                    type: 'create_team',
                    teamName: 'Test Team DB ' + Date.now()
                }
            }));
        }, 500);
    }
    
    if (message.type === 'team_updated') {
        console.log('✅ Step 3 Complete: Team created in database!');
        console.log('   Teams now:', message.data.game.teams.map(t => t.name));
        
        // Step 4: Add a player (should save to separate Players collection)
        console.log('📝 Step 4: Adding player to separate DB collection...');
        const teamId = message.data.game.teams[message.data.game.teams.length - 1].id;
        setTimeout(() => {
            ws.send(JSON.stringify({
                type: 'team_management_action',
                gameCode: gameCode,
                data: {
                    type: 'add_player_to_team',
                    playerId: 'player_test_' + Date.now(),
                    playerName: 'Test Player DB',
                    teamId: teamId
                }
            }));
        }, 500);
    }
    
    if (message.type === 'team_updated' && message.data.game.teams.some(t => t.players.length > 0)) {
        console.log('✅ Step 4 Complete: Player added to database!');
        console.log('🎉 SUCCESS: New database structure is working!');
        console.log('📊 Final state:');
        message.data.game.teams.forEach(team => {
            console.log(`   Team: ${team.name} (${team.players.length} players)`);
            team.players.forEach(player => {
                console.log(`     - ${player.name}`);
            });
        });
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

// Timeout after 15 seconds
setTimeout(() => {
    console.log('⏰ Test timeout');
    process.exit(1);
}, 15000);