'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const router = useRouter();

  const handleHostGame = () => {
    router.push('/host');
  };

  const handleJoinAsPlayer = () => {
    if (gameCode.length === 4 && playerName.trim()) {
      router.push(`/player?code=${gameCode}&team=${encodeURIComponent(playerName)}`);
    } else {
      alert('Please enter a valid 4-character game code and your team name');
    }
  };

  const handleJoinAsDisplay = () => {
    if (gameCode.length === 4) {
      router.push(`/display?code=${gameCode}`);
    } else {
      alert('Please enter a valid 4-character game code');
    }
  };

  const handleJoinAsLeaderboard = () => {
    if (gameCode.length === 4) {
      router.push(`/leaderboard?code=${gameCode}`);
    } else {
      alert('Please enter a valid 4-character game code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/Hype_Date.png)' }}
      />
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-black/50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 w-full max-w-lg shadow-2xl border border-white/10 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Feud.Exe Logo" className="h-24 w-auto drop-shadow-2xl" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Roslindale', 'Arial Black', sans-serif" }}>Feud.Exe</h1>
          <p className="text-blue-300 text-xl font-medium" style={{ fontFamily: "'Roslindale', Arial, sans-serif" }}>Execution Begins With The Beep</p>
        </div>

        <div className="space-y-6">
          {/* Host Game */}
          <button
            onClick={handleHostGame}
            className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg text-lg"
          >
            <span className="text-2xl mr-2">🎮</span> Host New Game
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/70 font-medium">OR</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg text-center mb-4" style={{ fontFamily: "'Roslindale', Arial, sans-serif" }}>Join Existing Game</h3>
            
            <input
              type="text"
              placeholder="Enter 4-digit game code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase().slice(0, 4))}
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-center text-xl font-bold placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 tracking-widest"
              maxLength={4}
            />

            <input
              type="text"
              placeholder="Enter your team name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                onClick={handleJoinAsPlayer}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
              >
                <span className="text-xl mr-2">🔥</span> Join as Player
              </button>

              <button
                onClick={handleJoinAsDisplay}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
              >
                <span className="text-xl mr-2">📺</span> Join as Display
              </button>

              <button
                onClick={handleJoinAsLeaderboard}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
              >
                <span className="text-xl mr-2">🏆</span> Leaderboard
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/50 text-sm font-medium" style={{ fontFamily: "'Roslindale', Arial, sans-serif" }}>
            Teams of 4 • 3 Rounds • 9 Questions
          </p>
        </div>
      </div>
    </div>
  );
}