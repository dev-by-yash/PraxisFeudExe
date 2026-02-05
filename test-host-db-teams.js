const WebSocket = require('ws');

console.log('🧪 Testing Host Loading Teams from Database');

// First create some teams in database
const ws1 = new WebSocket('ws://localhost:8080');
let gameCode = '';

ws1.on('open', function() {
    console.log('✅ Connected - Creating game and teams...');
    
    // Create game
    ws1.send(JSON.stringify({
        type: 'host_create',
        data: {}
    }));
});

ws1.on('message', function(data) {
    const message = JSON.parse(data.toString());
    
    if (message.type === 'game_created') {
        gameCode = message.data.game.code;
        console.log('✅ Game created:', gameCode);
        console.log('   Initial teams from DB:', message.data.game.teams.length);
        
        // Join as team manager to create some teams
        ws1.send(JSON.stringify({
            type: 'team_manager_join',
            gameCode: gameCode,
            data: { role: 'team_manager' }
        }));
    }
    
    if (message.type === 'joined_game' && !message.data.game.teams.find(t => t.name.includes('Alpha'))) {
        console.log('✅ Joined as team manager, creating test teams...');
        
        // Create Team Alpha
        ws1.send(JSON.stringify({
            type: 'team_management_action',
            gameCode: gameCode,
            data: {
                type: 'create_team',
                teamName: 'Team Alpha'
            }
        }));
    }
    
    if (message.type === 'team_updated' && message.data.game.teams.find(t => t.name === 'Team Alpha') && !message.data.game.teams.find(t => t.name === 'Team Beta')) {
        console.log('✅ Team Alpha created, creating Team Beta...');
        
        // Create Team Beta
        ws1.send(JSON.stringify({
            type: 'team_management_action',
            gameCode: gameCode,
            data: {
                type: 'create_team',
                teamName: 'Team Beta'
            }
        }));
    }
    
    if (message.type === 'team_updated' && message.data.game.teams.find(t => t.name === 'Team Beta')) {
        console.log('✅ Both teams created in database');
        console.log('   Teams:', message.data.game.teams.map(t => t.name));
        
        ws1.close();
        
        // Now test host loading teams from database
        setTimeout(() => {
            console.log('\\n🎯 Testing Host Loading Teams from Database...');
            testHostLoadingTeams();
        }, 1000);
    }
});

function testHostLoadingTeams() {
    const ws2 = new WebSocket('ws://localhost:8080');
    
    ws2.on('open', function() {
        console.log('✅ Host connecting to existing game...');
        
        // Host joins existing game
        ws2.send(JSON.stringify({
            type: 'host_join',
            gameCode: gameCode
        }));
    });
    
    ws2.on('message', function(data) {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'joined_game') {
            console.log('✅ Host joined game');
            console.log('   Teams loaded from DB:', message.data.game.teams.length);
            console.log('   Team names:', message.data.game.teams.map(t => t.name));
            
            if (message.data.game.teams.length > 0) {
                console.log('🎉 SUCCESS: Host is loading teams from database!');
            } else {
                console.log('❌ FAIL: Host not loading teams from database');
            }
            
            process.exit(0);
        }
        
        if (message.type === 'error') {
            console.error('❌ Error:', message.data.message);
            process.exit(1);
        }
    });
}

setTimeout(() => {
    console.log('⏰ Test timeout');
    process.exit(1);
}, 15000);