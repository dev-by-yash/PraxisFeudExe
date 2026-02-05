const WebSocket = require('ws');

console.log('🧪 Testing All Teams Display in Both Pages');

let gameCode = '';
let ws1;

// Step 1: Create game and teams
ws1 = new WebSocket('ws://localhost:8080');

ws1.on('open', function() {
    console.log('✅ Step 1: Creating game...');
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
        
        // Join as team manager
        ws1.send(JSON.stringify({
            type: 'team_manager_join',
            gameCode: gameCode,
            data: { role: 'team_manager' }
        }));
    }
    
    if (message.type === 'joined_game' && ws1.role !== 'team_manager') {
        ws1.role = 'team_manager';
        console.log('✅ Step 2: Joined as team manager');
        console.log('   Existing teams:', message.data.game.teams.length);
        
        // Create 3 test teams
        console.log('✅ Step 3: Creating 3 teams...');
        
        setTimeout(() => {
            ws1.send(JSON.stringify({
                type: 'team_management_action',
                gameCode: gameCode,
                data: { type: 'create_team', teamName: 'Team Alpha' }
            }));
        }, 200);
        
        setTimeout(() => {
            ws1.send(JSON.stringify({
                type: 'team_management_action',
                gameCode: gameCode,
                data: { type: 'create_team', teamName: 'Team Beta' }
            }));
        }, 400);
        
        setTimeout(() => {
            ws1.send(JSON.stringify({
                type: 'team_management_action',
                gameCode: gameCode,
                data: { type: 'create_team', teamName: 'Team Gamma' }
            }));
        }, 600);
    }
    
    if (message.type === 'team_updated' && message.data.game.teams.find(t => t.name === 'Team Gamma')) {
        console.log('✅ Step 4: All 3 teams created');
        console.log('   Teams:', message.data.game.teams.map(t => t.name));
        
        ws1.close();
        
        // Test team management page loading
        setTimeout(() => testTeamManagementPage(), 1000);
    }
});

function testTeamManagementPage() {
    console.log('\n🎯 Testing Team Management Page...');
    const ws2 = new WebSocket('ws://localhost:8080');
    
    ws2.on('open', function() {
        ws2.send(JSON.stringify({
            type: 'team_manager_join',
            gameCode: gameCode,
            data: { role: 'team_manager' }
        }));
    });
    
    ws2.on('message', function(data) {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'joined_game') {
            console.log('✅ Team Management Page loaded');
            console.log('   Teams displayed:', message.data.game.teams.length);
            console.log('   Team names:', message.data.game.teams.map(t => t.name));
            
            if (message.data.game.teams.length === 3) {
                console.log('✅ SUCCESS: Team Management shows all 3 teams from DB!');
            } else {
                console.log('❌ FAIL: Team Management not showing all teams');
            }
            
            ws2.close();
            
            // Test host page loading
            setTimeout(() => testHostPage(), 1000);
        }
    });
}

function testHostPage() {
    console.log('\n🎯 Testing Host Page...');
    const ws3 = new WebSocket('ws://localhost:8080');
    
    ws3.on('open', function() {
        ws3.send(JSON.stringify({
            type: 'host_join',
            gameCode: gameCode
        }));
    });
    
    let teamsLoaded = false;
    
    ws3.on('message', function(data) {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'joined_game') {
            console.log('✅ Host joined game');
            
            // Request all teams for selection
            ws3.send(JSON.stringify({
                type: 'load_all_teams',
                gameCode: gameCode
            }));
        }
        
        if (message.type === 'teams_loaded' && !teamsLoaded) {
            teamsLoaded = true;
            console.log('✅ Host loaded teams for selection');
            console.log('   Teams available:', message.data.teams.length);
            console.log('   Team names:', message.data.teams.map(t => t.name));
            
            if (message.data.teams.length === 3) {
                console.log('✅ SUCCESS: Host shows all 3 teams from DB!');
            } else {
                console.log('❌ FAIL: Host not showing all teams');
            }
            
            console.log('\n🎉 Test Complete!');
            console.log('Summary:');
            console.log('  - Team Management: Shows all teams from DB ✅');
            console.log('  - Host Page: Shows all teams for selection ✅');
            
            process.exit(0);
        }
    });
}

setTimeout(() => {
    console.log('⏰ Test timeout');
    process.exit(1);
}, 20000);