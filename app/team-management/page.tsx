'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Game, WSMessage, Team, Player } from '../../types/game';
import { getWebSocketUrl } from '../../lib/websocket';

function TeamManagementContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams?.get('code') || 'STANDALONE'; // Use STANDALONE if no game code
  
  const [teams, setTeams] = useState<Team[]>([]); // Direct teams state instead of game
  const [isConnected, setIsConnected] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  // Debug: Log teams state changes
  useEffect(() => {
    console.log('🔄 Teams state changed:', teams.length, teams);
  }, [teams]);

  useEffect(() => {
    // Connect to WebSocket
    wsRef.current = new WebSocket(getWebSocketUrl());
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected for team management (standalone mode)');
      setIsConnected(true);
      // Load all teams directly
      setTimeout(() => {
        if (wsRef.current) {
          console.log('Requesting all teams from database...');
          wsRef.current.send(JSON.stringify({
            type: 'load_all_teams_standalone'
          }));
        }
      }, 500);
    };

    wsRef.current.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      console.log('Team management received message:', message);
      
      switch (message.type) {
        case 'teams_loaded':
          console.log('📨 Teams loaded from database:', message.data.teams.length);
          console.log('📨 Teams data:', message.data.teams);
          message.data.teams.forEach((team: Team, index: number) => {
            console.log(`  ${index + 1}. ${team.name} - ${team.players?.length || 0} players`);
          });
          console.log('📨 Setting teams state...');
          setTeams(message.data.teams);
          console.log('✅ Teams state updated');
          break;
        case 'error':
          console.error('WebSocket error:', message.data);
          alert(message.data.message);
          break;
        default:
          console.log('Unhandled message type:', message.type);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []); // Remove gameCode dependency

  const sendTeamAction = (action: any) => {
    console.log('Sending team action:', action);
    if (wsRef.current) {
      const message = {
        type: 'team_management_action_standalone',
        data: action
      };
      console.log('WebSocket message:', message);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  };

  const createTeam = () => {
    if (newTeamName.trim()) {
      console.log('Creating team:', newTeamName.trim());
      sendTeamAction({
        type: 'create_team',
        teamName: newTeamName.trim()
      });
      setNewTeamName('');
    }
  };

  const addPlayer = () => {
    if (newPlayerName.trim() && selectedTeamId) {
      console.log('=== ADD PLAYER START ===');
      console.log('Player name:', newPlayerName.trim());
      console.log('Selected team ID:', selectedTeamId);
      console.log('Game code:', gameCode);
      console.log('WebSocket connected:', wsRef.current?.readyState === WebSocket.OPEN);
      
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      console.log('Generated player ID:', playerId);
      
      const action = {
        type: 'add_player_to_team',
        playerId,
        playerName: newPlayerName.trim(),
        teamId: selectedTeamId
      };
      console.log('Sending action:', action);
      
      sendTeamAction(action);
      
      console.log('=== ADD PLAYER END ===');
      setNewPlayerName('');
      setSelectedTeamId('');
    } else {
      console.warn('Cannot add player - missing name or team:', {
        hasName: !!newPlayerName.trim(),
        hasTeam: !!selectedTeamId
      });
    }
  };

  const removePlayer = (playerId: string, teamId: string) => {
    console.log('Removing player:', playerId, 'from team:', teamId);
    sendTeamAction({
      type: 'remove_player_from_team',
      playerId,
      teamId
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Connecting to server...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-8 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/Hype_Date.png)' }}
      />
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-black/40" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-300">Manage teams and players independently</p>
          <p className="text-sm text-gray-400 mt-2">Teams loaded: {teams.length}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Create Team */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Create Team</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
                onKeyPress={(e) => e.key === 'Enter' && createTeam()}
              />
              <button
                onClick={createTeam}
                disabled={!newTeamName.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold text-lg"
              >
                Add
              </button>
            </div>
          </div>

          {/* Add Player */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Add Player</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Player name"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
              />
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-lg"
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || !selectedTeamId}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold text-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Teams */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team: Team) => (
              <div key={team.id} className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4">{team.name}</h3>
                <div className="space-y-2">
                  {team.players.length === 0 ? (
                    <p className="text-gray-400 italic">No players</p>
                  ) : (
                    team.players.map((player: Player) => (
                      <div key={player.id} className="flex justify-between items-center bg-gray-600 p-3 rounded">
                        <span className="text-lg">{player.name}</span>
                        <button
                          onClick={() => removePlayer(player.id, team.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-lg font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {teams.length === 0 && (
            <p className="text-gray-400 text-center text-lg">No teams created yet</p>
          )}
        </div>
      </div>
    </div>
  );
}


export default function TeamManagementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading team management...</div>
      </div>
    }>
      <TeamManagementContent />
    </Suspense>
  );
}
