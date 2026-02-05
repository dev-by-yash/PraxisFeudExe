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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Feud.Exe</h1>
          <p className="text-blue-200 text-lg">Execution Begins With The Beep</p>
        </div>

        <div className="space-y-6">
          {/* Host Game */}
          <button
            onClick={handleHostGame}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🎮 Host New Game
          </button>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-white font-semibold mb-4 text-center">Join Existing Game</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter 4-digit game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase().slice(0, 4))}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                maxLength={4}
              />

              <input
                type="text"
                placeholder="Enter your team name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleJoinAsPlayer}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                >
                  🔥 Join as Player
                </button>

                <button
                  onClick={handleJoinAsDisplay}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                >
                  📺 Join as Display
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Teams of 4 • 3 Rounds • 9 Questions
          </p>
        </div>
      </div>
    </div>
  );
}