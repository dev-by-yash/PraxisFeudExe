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
            console.log('📊 Initial teams:', message.data.game.teams.map((t: Team) => `${t.name}: ${t.score}`));
            const sortedTeams = [...message.data.game.teams].sort((a: Team, b: Team) => (b.score || 0) - (a.score || 0));
            setTeams(sortedTeams);
          }
          break;
        case 'game_update':
          console.log('📊 Leaderboard received game_update');
          if (message.data.game?.teams) {
            console.log('📊 Updated teams:', message.data.game.teams.map((t: Team) => `${t.name}: ${t.score}`));
            const sortedTeams = [...message.data.game.teams].sort((a: Team, b: Team) => (b.score || 0) - (a.score || 0));
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
            console.log('📊 Teams after points update:', updatedTeams.map((t: Team) => `${t.name}: ${t.score}`));
            return updatedTeams.sort((a: Team, b: Team) => (b.score || 0) - (a.score || 0));
          });
          break;
        case 'teams_loaded':
          console.log('📊 Leaderboard received teams_loaded');
          if (message.data.teams) {
            console.log('📊 Loaded teams:', message.data.teams.map((t: Team) => `${t.name}: ${t.score}`));
            const sortedTeams = [...message.data.teams].sort((a: Team, b: Team) => (b.score || 0) - (a.score || 0));
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
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/Hype_Date.png)' }}
      />
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-black/40" />
      
      <div className="max-w-5xl mx-auto p-12 relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Leaderboard Title */}
        <h1 
          className="text-8xl font-bold mb-16"
          style={{
            fontFamily: "'FK Raster', 'Arial Black', sans-serif",
            color: '#F51BAD',
            textShadow: '0 0 30px rgba(245, 27, 173, 0.6)',
            letterSpacing: '-0.02em'
          }}
        >
          Leaderboard
        </h1>

        {teams.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-bounce">🎯</div>
            <h2 className="text-4xl font-bold mb-4">No Teams Yet</h2>
            <p className="text-2xl text-gray-300">Teams will appear here once they join the game</p>
          </div>
        ) : (
          <div className="w-full space-y-6">
            {teams.map((team, index) => {
              // Define border colors for each position
              const borderColors = [
                '#DDB100', // 1st - Yellow
                '#F5761B', // 2nd - Orange  
                '#FF4343', // 3rd - Red
                '#F51BAD', // 4th - Pink
                '#F51BAD'  // 5th+ - Pink
              ];
              
              const borderColor = borderColors[Math.min(index, 4)];
              
              return (
                <div
                  key={team.id}
                  className="relative flex items-center justify-between px-8 py-5 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, #1B59F5 0%, #7841FF 100%)',
                    border: `5px solid ${borderColor}`,
                    boxShadow: `0 0 25px ${borderColor}50`,
                    borderRadius: '60px'
                  }}
                >
                  {/* Rank Circle */}
                  <div className="flex items-center gap-6">
                    <div 
                      className="flex items-center justify-center text-4xl font-bold"
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: '#1B59F5',
                        border: `4px solid ${borderColor}`,
                        boxShadow: `0 0 20px ${borderColor}70`,
                        flexShrink: 0
                      }}
                    >
                      {index + 1}
                    </div>
                    
                    {/* Team Name */}
                    <h3 
                      className="text-5xl font-bold"
                      style={{
                        fontFamily: "'Roslindale', 'Arial Black', sans-serif",
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {team.name}
                    </h3>
                  </div>

                  {/* Score */}
                  <div 
                    className="text-6xl font-bold pr-4"
                    style={{
                      fontFamily: "'Roslindale', 'Arial Black', sans-serif",
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {team.score || 0}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="fixed bottom-6 right-6 bg-green-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center space-x-3 shadow-lg z-20">
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