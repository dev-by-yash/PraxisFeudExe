const WebSocket = require('ws');

console.log('🔍 STEP-BY-STEP DEBUG: Testing Team Loading');

const ws = new WebSocket('ws://localhost:8080');
let gameCode = '';

ws.on('open', function() {
    console.log('\n✅ STEP 1: Connected to WebSocket server');
    
    // Create a new game
    console.log('📤 STEP 2: Creating new game...');
    ws.send(JSON.stringify({
        type: 'host_create',
        data: {}
    }));
});

ws.on('message', function(data) {
    const message = JSON.parse(data.toString());
    console.log(`\n📨 Received message: ${message.type}`);
    
    if (message.type === 'game_created') {
        gameCode = message.data.game.code;
        console.log('✅ STEP 3: Game created successfully');
        console.log('   Game Code:', gameCode);
        console.log('   Initial teams in game:', message.data.game.teams?.length || 0);
        
        // Now request all teams
        console.log('\n📤 STEP 4: Requesting all teams...');
        ws.send(JSON.stringify({
            type: 'load_all_teams',
            gameCode: gameCode
        }));
    }
    
    if (message.type === 'teams_loaded') {
        console.log('✅ STEP 5: Teams response received');
        console.log('   Raw response:', JSON.stringify(message.data, null, 2));
        console.log('   Number of teams:', message.data.teams?.length || 0);
        
        if (message.data.teams && message.data.teams.length > 0) {
            console.log('\n🎉 SUCCESS: Teams found!');
            message.data.teams.forEach((team, index) => {
                console.log(`   ${index + 1}. Name: "${team.name}"`);
                console.log(`      ID: ${team.id}`);
                console.log(`      Game: ${team.gameCode}`);
                console.log(`      Players: ${team.players?.length || 0}`);
                console.log('');
            });
        } else {
            console.log('\n❌ PROBLEM: No teams in response');
            console.log('   This means either:');
            console.log('   1. No teams exist in database');
            console.log('   2. Database query failed');
            console.log('   3. WebSocket server error');
        }
        
        process.exit(0);
    }
    
    if (message.type === 'error') {
        console.error('\n❌ STEP ERROR: WebSocket error received');
        console.error('   Error message:', message.data.message);
        process.exit(1);
    }
});

ws.on('error', function(error) {
    console.error('\n❌ WebSocket connection error:', error);
    process.exit(1);
});

ws.on('close', function() {
    console.log('\n🔌 WebSocket connection closed');
});

setTimeout(() => {
    console.log('\n⏰ TIMEOUT: Test took too long');
    console.log('   This suggests the WebSocket server is not responding');
    process.exit(1);
}, 10000);