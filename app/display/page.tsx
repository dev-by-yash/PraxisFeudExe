'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Game, WSMessage } from '../../types/game';
import { getWebSocketUrl } from '../../lib/websocket';

function DisplayPageContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams?.get('code');

  const [game, setGame] = useState<Game | 0>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [showStrikeAnimation, setShowStrikeAnimation] = useState(false);
  const [currentStrikeCount, setCurrentStrikeCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const previousStrikesRef = useRef<{ [teamId: string]: number }>({});

  useEffect(() => {
    if (!gameCode) return;

    // Connect to WebSocket
    wsRef.current = new WebSocket(getWebSocketUrl());

    wsRef.current.onopen = () => {
      setIsConnected(true);
      // Join as display (not as player with team)
      wsRef.current?.send(JSON.stringify({
        type: 'display_join',
        gameCode
      }));
    };

    wsRef.current.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);

      switch (message.type) {
        case 'joined_game':
          console.log('📺 Display joined game');
          setGame(message.data.game);
          break;
        case 'game_update':
          console.log('📺 Display received game_update');
          console.log('📺 game_update data:', message.data.game);
          console.log('📺 game_update questionVisible:', message.data.game.questionVisible);
          setGame(message.data.game);
          break;
        case 'answer_revealed':
          console.log('📺 Display received answer_revealed');
          // Update only the answer state, preserve team scores
          setGame(prevGame => {
            if (!prevGame) return prevGame;

            const updatedRounds = [...prevGame.rounds];
            const currentRound = updatedRounds[prevGame.currentRoundIndex];
            if (currentRound) {
              const currentQuestion = currentRound.questions[currentRound.currentQuestionIndex];
              if (currentQuestion && currentQuestion.answers[message.data.answerIndex]) {
                currentQuestion.answers[message.data.answerIndex].revealed = true;
              }
            }

            return {
              ...prevGame,
              rounds: updatedRounds
            };
          });
          break;
        case 'question_changed':
          console.log('📺 Display received question_changed');
          console.log('   New round index:', message.data.currentRoundIndex);
          console.log('   New question index:', message.data.currentQuestionIndex);
          console.log('   Question visible:', message.data.questionVisible);
          // Update game state but preserve team scores
          setGame(prevGame => {
            if (!prevGame) return prevGame;

            // Update the rounds structure properly
            const updatedRounds = [...prevGame.rounds];
            if (updatedRounds[message.data.currentRoundIndex]) {
              updatedRounds[message.data.currentRoundIndex].currentQuestionIndex = message.data.currentQuestionIndex;
            }

            return {
              ...prevGame,
              currentRoundIndex: message.data.currentRoundIndex,
              rounds: updatedRounds,
              gameState: message.data.gameState,
              buzzerPressed: null,
              questionVisible: message.data.questionVisible !== undefined ? message.data.questionVisible : false,
              // Reset strikes but preserve scores
              teams: prevGame.teams.map(team => ({
                ...team,
                strikes: 0,
                // Keep the score!
                score: team.score
              }))
            };
          });
          break;
        case 'question_visibility_changed':
          console.log('📺 Display received question_visibility_changed:', message.data.questionVisible);
          console.log('📺 Current game state before update:', game);
          setGame(prevGame => {
            if (!prevGame) {
              console.log('📺 ERROR: prevGame is null/undefined');
              return null;
            }
            const updated = {
              ...prevGame,
              questionVisible: message.data.questionVisible
            };
            console.log('📺 Updated game.questionVisible to:', updated.questionVisible);
            return updated;
          });
          break;
        case 'points_updated':
          console.log('📺 Display received points_updated');
          // Update team scores
          setGame(prevGame => {
            if (!prevGame) return prevGame;

            return {
              ...prevGame,
              teams: prevGame.teams.map(team => ({
                ...team,
                score: message.data.scores[team.id] || team.score
              }))
            };
          });
          break;
        case 'buzzer_pressed':
          console.log('📺 Display received buzzer_pressed:', message.data);
          // Update game state when buzzer is pressed
          setGame(prevGame => prevGame ? {
            ...prevGame,
            buzzerPressed: {
              teamId: message.data.teamId,
              teamName: message.data.teamName,
              timestamp: message.data.timestamp
            },
            gameState: 'answering'
          } : null);
          break;
        case 'buzzer_enabled':
          console.log('📺 Display received buzzer_enabled');
          setGame(prevGame => prevGame ? {
            ...prevGame,
            buzzerPressed: null,
            gameState: 'buzzer'
          } : null);
          break;
        case 'buzzer_reset':
          console.log('📺 Display received buzzer_reset');
          setGame(prevGame => prevGame ? {
            ...prevGame,
            buzzerPressed: null,
            gameState: 'buzzer'
          } : null);
          break;
        case 'error':
          console.error('📺 Display error:', message.data.message);
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

  // Detect strike changes and trigger animation
  useEffect(() => {
    if (!game || !game.teams) return;

    // Initialize previousStrikesRef on first load
    const isFirstLoad = Object.keys(previousStrikesRef.current).length === 0;
    if (isFirstLoad) {
      game.teams.forEach(team => {
        previousStrikesRef.current[team.id] = team.strikes || 0;
      });
      return; // Don't trigger animation on first load
    }

    // Check if any team's strikes increased
    game.teams.forEach(team => {
      const previousStrikes = previousStrikesRef.current[team.id] || 0;
      const currentStrikes = team.strikes || 0;

      if (currentStrikes > previousStrikes) {
        // Strike was added!
        console.log(`🎬 Strike animation triggered for ${team.name}: ${previousStrikes} → ${currentStrikes}`);
        setCurrentStrikeCount(currentStrikes);
        setShowStrikeAnimation(true);

        // Hide animation after 2 seconds
        setTimeout(() => {
          setShowStrikeAnimation(false);
        }, 2000);
      }

      // Update previous strikes
      previousStrikesRef.current[team.id] = currentStrikes;
    });
  }, [game?.teams]);

  if (!gameCode) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center">
        <div className="text-white text-4xl">Invalid game code</div>
      </div>
    );
  }

  if (!isConnected || !game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-4xl">Connecting to game...</div>
      </div>
    );
  }

  const currentRound = game.rounds[game.currentRoundIndex];
  const currentQuestion = currentRound?.questions[currentRound.currentQuestionIndex];
  const hasQuestions = currentRound?.questions && currentRound.questions.length > 0;

  // Debug logging
  console.log('📺 RENDER - game.questionVisible:', game.questionVisible);
  console.log('📺 RENDER - currentQuestion exists:', !!currentQuestion);
  console.log('📺 RENDER - hasQuestions:', hasQuestions);

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/Hype_Date.png)' }}
      />
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-black/40" />
      
      {/* Strike Animation Overlay */}
      {showStrikeAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex gap-8">
            {[...Array(currentStrikeCount)].map((_, i) => (
              <div
                key={i}
                className="relative w-64 h-64 animate-strike-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Red X */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-2xl"
                >
                  {/* Red square background */}
                  <rect
                    x="5"
                    y="5"
                    width="90"
                    height="90"
                    fill="#DC2626"
                    stroke="#991B1B"
                    strokeWidth="3"
                    rx="8"
                    className="animate-pulse"
                  />
                  {/* White X */}
                  <line
                    x1="20"
                    y1="20"
                    x2="80"
                    y2="80"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="80"
                    y1="20"
                    x2="20"
                    y2="80"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-8 relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Logo - Fixed Top Right */}
        <div className="fixed top-8 right-8 z-20">
          <img src="/logo.png" alt="Feud.Exe Logo" className="h-24 w-auto drop-shadow-2xl" />
        </div>

        {/* No Questions Selected Message */}
        {!hasQuestions && (
          <div className="flex items-center justify-center min-h-screen">
            <div 
              className="p-12 rounded-3xl text-center max-w-2xl"
              style={{
                background: '#1B59F5',
                border: '4px solid #F51BAD',
                boxShadow: '0 0 40px rgba(245, 27, 173, 0.8)',
                fontFamily: "'Roslindale', 'Arial Black', sans-serif"
              }}
            >
              <p className="text-6xl mb-6">⚠️</p>
              <p className="text-4xl font-bold mb-4">No Questions Selected</p>
              <p className="text-2xl text-blue-200">
                Waiting for host to select questions...
              </p>
            </div>
          </div>
        )}

        {/* Current Question */}
        {currentQuestion && hasQuestions && (
          <>
            {/* Question Box - Full Width - Only show if questionVisible is true */}
            {game.questionVisible === true ? (
              <div className="w-full max-w-5xl mb-8">
                <div 
                  className="p-8 rounded-3xl text-center text-4xl font-bold"
                  style={{
                    background: '#1B59F5',
                    border: '4px solid #F51BAD',
                    boxShadow: '0 0 30px rgba(245, 27, 173, 0.5)',
                    fontFamily: "'Roslindale', 'Arial Black', sans-serif"
                  }}
                >
                  {currentQuestion.text}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-5xl mb-8">
                <div 
                  className="p-8 rounded-3xl text-center text-3xl font-bold"
                  style={{
                    background: '#1B59F5',
                    border: '4px solid #F51BAD',
                    boxShadow: '0 0 30px rgba(245, 27, 173, 0.5)',
                    fontFamily: "'Roslindale', 'Arial Black', sans-serif",
                    opacity: 0.5
                  }}
                >
                  Waiting for host to show question...
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="w-full max-w-6xl grid grid-cols-[auto_1fr_auto] gap-8 items-start mt-8">
              {/* Left Team Score */}
              <div 
                className="px-10 py-8 rounded-3xl text-7xl font-bold"
                style={{
                  background: '#1B59F5',
                  border: '4px solid #F51BAD',
                  boxShadow: '0 0 30px rgba(245, 27, 173, 0.5)',
                  fontFamily: "'Roslindale', 'Arial Black', sans-serif"
                }}
              >
                {game.teams[0]?.score || 0}
              </div>

              {/* Answers Grid - 2 columns, 3 rows */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.answers.map((answer, index) => (
                  <div
                    key={index}
                    className="relative p-6 rounded-3xl flex items-center justify-center text-3xl font-bold transition-all duration-300"
                    style={{
                      background: answer.revealed 
                        ? '#F51BAD' 
                        : 'radial-gradient(circle at center, #7841FF 0%, #1B59F5 100%)',
                      border: answer.revealed ? '3px solid #F51BAD' : '3px solid #F51BAD',
                      boxShadow: answer.revealed 
                        ? '0 0 30px rgba(245, 27, 173, 0.6)' 
                        : '0 0 20px rgba(120, 65, 255, 0.4)',
                      minHeight: '80px',
                      fontFamily: "'Roslindale', 'Arial Black', sans-serif"
                    }}
                  >
                    {answer.revealed ? (
                      <span className="text-white">{answer.text}</span>
                    ) : (
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold"
                        style={{
                          background: 'radial-gradient(circle at center, #7841FF 0%, #1B59F5 100%)',
                          border: '3px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 0 20px rgba(120, 65, 255, 0.6)'
                        }}
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Team Score */}
              <div 
                className="px-10 py-8 rounded-3xl text-7xl font-bold"
                style={{
                  background: '#1B59F5',
                  border: '4px solid #F51BAD',
                  boxShadow: '0 0 30px rgba(245, 27, 173, 0.5)',
                  fontFamily: "'Roslindale', 'Arial Black', sans-serif"
                }}
              >
                {game.teams[1]?.score || 0}
              </div>
            </div>
          </>
        )}

        {/* Game State Messages */}
        {game.gameState === 'buzzer' && !game.buzzerPressed && (
          <div 
            className="w-full max-w-3xl p-8 rounded-3xl text-center text-4xl font-bold animate-pulse"
            style={{
              background: '#1B59F5',
              border: '4px solid #F51BAD',
              boxShadow: '0 0 30px rgba(245, 27, 173, 0.5)',
              fontFamily: "'Roslindale', 'Arial Black', sans-serif"
            }}
          >
            Ready for buzzer!
          </div>
        )}

        {game.gameState === 'finished' && (
          <div 
            className="w-full max-w-4xl p-12 rounded-3xl text-center"
            style={{
              background: '#1B59F5',
              border: '4px solid #F51BAD',
              boxShadow: '0 0 40px rgba(245, 27, 173, 0.8)',
              fontFamily: "'Roslindale', 'Arial Black', sans-serif"
            }}
          >
            <p className="text-7xl font-bold mb-6">🎉 Game Over! 🎉</p>
            <p className="text-5xl">
              Winner: {game.teams.reduce((winner, team) =>
                team.score > winner.score ? team : winner
              ).name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DisplayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-4xl">Loading...</div>
    </div>}>
      <DisplayPageContent />
    </Suspense>
  );
}