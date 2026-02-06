'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Game, WSMessage } from '../../types/game';
import { getWebSocketUrl } from '../../lib/websocket';

function PlayerPageContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams?.get('code');
  const teamName = searchParams?.get('team');
  
  console.log('🎮 Player Page Loaded');
  console.log('   Game Code:', gameCode);
  console.log('   Team Name:', teamName);
  console.log('   Full URL params:', Object.fromEntries(searchParams?.entries() || []));
  
  const [game, setGame] = useState<Game | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [canBuzz, setCanBuzz] = useState(false);
  const [buzzPressed, setBuzzPressed] = useState(false);
  const [buzzerWinnerTeam, setBuzzerWinnerTeam] = useState<string | null>(null);
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const myTeamIdRef = useRef<string | null>(null);
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (!gameCode || !teamName) return;
    
    // Prevent duplicate connections in React StrictMode
    if (hasConnectedRef.current) {
      console.log('⚠️ Skipping duplicate WebSocket connection');
      return;
    }
    
    hasConnectedRef.current = true;
    console.log('🔌 Creating WebSocket connection...');

    // Connect to WebSocket
    const wsUrl = getWebSocketUrl();
    console.log('🔌 Connecting to:', wsUrl);
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log('✅ WebSocket connection opened');
      setIsConnected(true);
      // Join game with team name
      const joinMessage = {
        type: 'player_join',
        gameCode,
        data: { teamName }
      };
      console.log('📤 Sending player_join message:', joinMessage);
      wsRef.current?.send(JSON.stringify(joinMessage));
    };

    wsRef.current.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'joined_game':
          console.log('🎮 Player joined game - Full message data:', message.data);
          console.log('   Game:', message.data.game);
          console.log('   Team ID:', message.data.teamId);
          console.log('   Team Name:', message.data.teamName);
          
          if (!message.data.teamId) {
            console.error('❌ ERROR: No teamId in joined_game message!');
            console.error('   Full message:', JSON.stringify(message, null, 2));
          }
          
          setGame(message.data.game);
          setMyTeamId(message.data.teamId);
          myTeamIdRef.current = message.data.teamId;
          setHasJoined(true);
          
          console.log('✅ State updated - myTeamId:', message.data.teamId);
          console.log('✅ Ref updated - myTeamIdRef.current:', myTeamIdRef.current);
          break;
        case 'game_update':
          console.log('Game update received:', message.data.game.gameState);
          setGame(message.data.game);
          const newGameState = message.data.game.gameState;
          console.log('🎮 Game state changed to:', newGameState);
          
          if (newGameState === 'buzzer') {
            console.log('🔔 Buzzer enabled - resetting states');
            setCanBuzz(true);
            setBuzzPressed(false);
            setBuzzerWinnerTeam(null);
          } else {
            setCanBuzz(false);
          }
          break;
        case 'buzzer_pressed':
          console.log('Buzzer pressed by team:', message.data);
          console.log('My Team ID (state):', myTeamId);
          console.log('My Team ID (ref):', myTeamIdRef.current);
          console.log('Buzzer pressed by team ID:', message.data.teamId);
          
          // The server already sends teamName in the message data
          setBuzzerWinnerTeam(message.data.teamName || 'Unknown Team');
          
          // Check if this team pressed the buzzer using ref for immediate value
          const currentTeamId = myTeamIdRef.current || myTeamId;
          if (message.data.teamId === currentTeamId) {
            setBuzzPressed(true);
            console.log('✅ My team pressed the buzzer!');
          } else {
            // Another team pressed the buzzer first
            setBuzzPressed(false);
            console.log('❌ Another team pressed the buzzer first');
          }
          // Don't disable buzzer - let reset handle it
          break;
        case 'buzzer_too_late':
          console.log('Buzzer pressed too late:', message.data);
          setBuzzerWinnerTeam(message.data.winnerTeam);
          setBuzzPressed(false);
          setCanBuzz(false);
          break;
        case 'buzzer_enabled':
          console.log('🔔 Buzzer enabled received');
          setBuzzPressed(false);
          setBuzzerWinnerTeam(null);
          setCanBuzz(true);
          console.log('✅ Buzzer ready for next press');
          break;
        case 'buzzer_reset':
          console.log('🔄 Buzzer reset received');
          setBuzzPressed(false);
          setBuzzerWinnerTeam(null);
          setCanBuzz(true);
          console.log('✅ Buzzer ready for next press');
          break;
        case 'error':
          alert(message.data.message);
          break;
      }
    };

    wsRef.current.onclose = () => {
      console.log('🔌 WebSocket closed');
      setIsConnected(false);
      hasConnectedRef.current = false;
    };

    wsRef.current.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      console.error('   WebSocket URL was:', wsUrl);
    };

    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      wsRef.current?.close();
      hasConnectedRef.current = false;
    };
  }, [gameCode, teamName]);

  const pressBuzzer = () => {
    const currentTeamId = myTeamIdRef.current || myTeamId;
    console.log('🔔 Player pressing buzzer');
    console.log('   canBuzz:', canBuzz);
    console.log('   gameCode:', gameCode);
    console.log('   myTeamId (state):', myTeamId);
    console.log('   myTeamId (ref):', myTeamIdRef.current);
    console.log('   wsRef:', !!wsRef.current);
    
    if (canBuzz && wsRef.current && gameCode && currentTeamId) {
      console.log('✅ Sending buzzer press to server');
      wsRef.current.send(JSON.stringify({
        type: 'buzzer_press',
        gameCode,
        data: { teamId: currentTeamId }
      }));
      // Immediately show buzzed state
      setBuzzPressed(true);
      setCanBuzz(false);
      console.log('✅ Buzzer press sent - showing BUZZED');
    } else {
      console.log('❌ Cannot press buzzer - missing requirements');
    }
  };

  if (!gameCode || !teamName) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Invalid game code or team name</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Connecting to game...</div>
          <div className="text-gray-400 text-sm">
            Check console for connection details
          </div>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Joining game...</div>
      </div>
    );
  }

  const currentRound = game?.rounds[game.currentRoundIndex || 0];
  const currentQuestion = currentRound?.questions[currentRound.currentQuestionIndex || 0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Feud.Exe</h1>
        <p className="text-blue-200 text-lg">Team: {teamName}</p>
        <p className="text-blue-300">Game: {gameCode}</p>
      </div>

      {/* Game Info */}
      {game && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 w-full max-w-md text-center">
          <h2 className="text-white text-xl font-semibold mb-2">
            Round {(game.currentRoundIndex || 0) + 1} of 3
          </h2>
          <p className="text-blue-200">
            Question {(currentRound?.currentQuestionIndex || 0) + 1} of 3
          </p>
          
          {currentQuestion && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-white font-medium">{currentQuestion.text}</p>
            </div>
          )}
        </div>
      )}

      {/* Buzzer Button */}
      <div className="flex flex-col items-center space-y-6">
        <button
          onClick={pressBuzzer}
          disabled={!canBuzz && !buzzPressed}
          className={`
            w-64 h-64 rounded-full text-4xl font-bold transition-all duration-200 transform
            ${canBuzz && !buzzPressed
              ? 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-2xl hover:scale-105 animate-pulse'
              : buzzPressed
              ? 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-2xl'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {buzzPressed ? '✓ BUZZED!' : canBuzz ? '🔥 BUZZ!' : 'WAIT...'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Game State: {game?.gameState}</p>
          <p className="text-sm text-gray-400 mb-4">Can Buzz: {canBuzz ? 'Yes' : 'No'}</p>
          
          {game?.gameState === 'waiting' && (
            <p className="text-white text-lg">Waiting for host to start the game...</p>
          )}
          {game?.gameState === 'playing' && (
            <p className="text-yellow-400 text-lg">Game started! Waiting for buzzer to be enabled...</p>
          )}
          {game?.gameState === 'buzzer' && !buzzPressed && !buzzerWinnerTeam && (
            <p className="text-green-400 text-lg font-semibold animate-bounce">
              Ready to buzz! Tap the button when you know the answer!
            </p>
          )}
          {game?.gameState === 'answering' && buzzerWinnerTeam && (
            <div className="space-y-2">
              {buzzPressed ? (
                <div>
                  <p className="text-green-400 text-xl font-bold animate-pulse">
                    🎉 YOUR TEAM BUZZED FIRST! 🎉
                  </p>
                  <p className="text-green-300 text-lg">
                    Wait for the host to call on your team!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-red-400 text-xl font-bold">
                    ❌ Team "{buzzerWinnerTeam}" buzzed first!
                  </p>
                  <p className="text-yellow-300 text-lg">
                    Better luck next time!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Teams Score */}
      {game && (
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-white text-lg font-semibold mb-4 text-center">Scores</h3>
          <div className="grid grid-cols-2 gap-4">
            {game.teams.map((team) => (
              <div key={team.id} className="text-center">
                <p className="text-white font-semibold">{team.name}</p>
                <p className="text-2xl font-bold text-blue-300">{team.score}</p>
                <div className="flex justify-center space-x-1 mt-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < team.strikes ? 'bg-red-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>}>
      <PlayerPageContent />
    </Suspense>
  );
}