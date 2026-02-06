'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Team, WSMessage } from '../../types/game';
import { getWebSocketUrl } from '../../lib/websocket';

function LeaderboardPageContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams?.get('code');
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!gameCode) return;

    // Connect to WebSocket
    wsRef.current = new WebSocket(getWebSocketUrl());
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      // Join as leaderboard viewer
      wsRef.current?.send(JSON.stringify({
        type: 'leaderboard_join',
        gameCode
      }));
    };

    wsRef.current.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      console.log('📊 Leaderboard received message:', message.type, message.data);
      
      switch (message.type) {
        case 'joined_game':
          console.log('📊 Leaderboard joined game');
          if (message.data.game?.teams) {
            console.log('📊 Initial teams:', message.data.game.teams.map(t => `${t.name}: ${t.score}`));
            const sortedTeams = [...message.data.game.teams].sort((a, b) => (b.score || 0) - (a.score || 0));
            setTeams(sortedTeams);
          }
          break;
        case 'game_update':
          console.log('📊 Leaderboard received game_update');
          if (message.data.game?.teams) {
            console.log('📊 Updated teams:', message.data.game.teams.map(t => `${t.name}: ${t.score}`));
            const sortedTeams = [...message.data.game.teams].sort((a, b) => (b.score || 0) - (a.score || 0));
            setTeams(sortedTeams);
          }
          break;
        case 'points_updated':
          console.log('📊 Leaderboard received points_updated:', message.data.scores);
          // Update team scores and re-sort
          setTeams(prevTeams => {
            const updatedTeams = prevTeams.map(team => ({
              ...team,
              score: message.data.scores[team.id] !== undefined ? message.data.scores[team.id] : team.score
            }));
            console.log('📊 Teams after points update:', updatedTeams.map(t => `${t.name}: ${t.score}`));
            return updatedTeams.sort((a, b) => (b.score || 0) - (a.score || 0));
          });
          break;
        case 'teams_loaded':
          console.log('📊 Leaderboard received teams_loaded');
          if (message.data.teams) {
            console.log('📊 Loaded teams:', message.data.teams.map(t => `${t.name}: ${t.score}`));
            const sortedTeams = [...message.data.teams].sort((a, b) => (b.score || 0) - (a.score || 0));
            setTeams(sortedTeams);
          }
          break;
        case 'error':
          console.error('📊 Leaderboard error:', message.data.message);
          break;
        default:
          console.log('📊 Leaderboard received unhandled message:', message.type);
          break;
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      wsRef.current?.close();
    };
  }, [gameCode]);

  if (!gameCode) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center">
        <div className="text-white text-4xl">Invalid game code</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-4xl">Connecting to game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/30 p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-5xl font-bold">🏆 Leaderboard</h1>
            <p className="text-2xl text-blue-200">Real-time Team Rankings</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">Game: {gameCode}</p>
            <p className="text-lg text-gray-300">{teams.length} Teams Competing</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {teams.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold mb-4">No Teams Yet</h2>
            <p className="text-xl text-gray-300">Teams will appear here once they join the game</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team, index) => (
              <div
                key={team.id}
                className={`
                  flex items-center justify-between p-6 rounded-2xl transition-all duration-300 transform hover:scale-105
                  ${index === 0 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-2xl border-4 border-yellow-300' 
                    : index === 1 
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-xl border-2 border-gray-300'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg border-2 border-orange-400'
                    : 'bg-white/10 backdrop-blur-lg border border-white/20'
                  }
                `}
              >
                {/* Rank and Trophy */}
                <div className="flex items-center space-x-4">
                  <div className={`
                    text-6xl font-bold flex items-center justify-center w-20 h-20 rounded-full
                    ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                      index === 1 ? 'bg-gray-300 text-gray-800' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-white/20 text-white'
                    }
                  `}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  
                  <div>
                    <h3 className={`
                      text-3xl font-bold
                      ${index < 3 ? 'text-white' : 'text-white'}
                    `}>
                      {team.name}
                    </h3>
                    <p className={`
                      text-lg
                      ${index === 0 ? 'text-yellow-100' : 
                        index === 1 ? 'text-gray-100' :
                        index === 2 ? 'text-orange-100' :
                        'text-gray-300'
                      }
                    `}>
                      {team.players?.length || 0} players
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={`
                    text-5xl font-bold
                    ${index === 0 ? 'text-yellow-100' : 
                      index === 1 ? 'text-gray-100' :
                      index === 2 ? 'text-orange-100' :
                      'text-white'
                    }
                  `}>
                    {team.score || 0}
                  </div>
                  <p className={`
                    text-lg
                    ${index === 0 ? 'text-yellow-200' : 
                      index === 1 ? 'text-gray-200' :
                      index === 2 ? 'text-orange-200' :
                      'text-gray-400'
                    }
                  `}>
                    points
                  </p>
                </div>

                {/* Position Change Indicator */}
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                    LEADER!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {teams.length > 0 && (
          <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 text-center">Game Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">
                  {Math.max(...teams.map(t => t.score || 0))}
                </div>
                <p className="text-gray-300">Highest Score</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">
                  {teams.reduce((sum, team) => sum + (team.score || 0), 0)}
                </div>
                <p className="text-gray-300">Total Points</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">
                  {teams.reduce((sum, team) => sum + (team.players?.length || 0), 0)}
                </div>
                <p className="text-gray-300">Total Players</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Live Updates</span>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-4xl">Loading...</div>
    </div>}>
      <LeaderboardPageContent />
    </Suspense>
  );
}