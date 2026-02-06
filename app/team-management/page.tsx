'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Game, WSMessage, Team, Player } from '../../types/game';
import { getWebSocketUrl } from '../../lib/websocket';

function TeamManagementContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams?.get('code');
  
  const [game, setGame] = useState<Game | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!gameCode) return;

    // Connect to WebSocket
    wsRef.current = new WebSocket(getWebSocketUrl());
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected for team management');
      setIsConnected(true);
      // Join as team manager
      const joinMessage = {
        type: 'team_manager_join',
        gameCode,
        data: { role: 'team_manager' }
      };
      console.log('Sending join message:', joinMessage);
      wsRef.current?.send(JSON.stringify(joinMessage));
    };

    wsRef.current.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      console.log('Team management received message:', message);
      
      switch (message.type) {
        case 'joined_game':
          console.log('Updating game state:', message.data.game);
          setGame(message.data.game);
          // Load all teams from database after joining
          setTimeout(() => {
            if (wsRef.current && gameCode) {
              wsRef.current.send(JSON.stringify({
                type: 'load_all_teams',
                gameCode: gameCode
              }));
            }
          }, 500);
          break;
        case 'game_update':
        case 'team_updated':
          console.log('Updating game state:', message.data.game);
          setGame(message.data.game);
          break;
        case 'teams_loaded':
          console.log('All teams loaded:', message.data.teams);
          // Update game state with all teams from database
          setGame(prevGame => prevGame ? {
            ...prevGame,
            teams: message.data.teams
          } : null);
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
  }, [gameCode]);

  const sendTeamAction = (action: any) => {
    console.log('Sending team action:', action);
    if (wsRef.current && gameCode) {
      const message = {
        type: 'team_management_action',
        gameCode,
        data: action
      };
      console.log('WebSocket message:', message);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected or no game code');
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
      console.log('Adding player:', newPlayerName.trim(), 'to team:', selectedTeamId);
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      sendTeamAction({
        type: 'add_player_to_team',
        playerId,
        playerName: newPlayerName.trim(),
        teamId: selectedTeamId
      });
      setNewPlayerName('');
      setSelectedTeamId('');
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

  if (!gameCode) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Invalid game code</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Connecting to game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-300">Game Code: <span className="text-xl font-mono bg-blue-600 px-3 py-1 rounded">{gameCode}</span></p>
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
                {game?.teams.map((team) => (
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
            {game?.teams.map((team: Team) => (
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
          
          {game?.teams.length === 0 && (
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
