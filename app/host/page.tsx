'use client';

// Version 2.0 - Fixed loadAllTeams error
import { useState, useEffect, useRef } from 'react';
import { Game, WSMessage, Team, Player } from '../../types/game';
import { getWebSocketUrl } from '../../lib/websocket';

export default function HostPage() {
  console.log('🚀 Host Page v2.0 loaded - loadAllTeams error should be fixed');
  
  const [game, setGame] = useState<Game | null>(null);
  const [waitingPlayers, setWaitingPlayers] = useState<{id: string, name: string}[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [allTeams, setAllTeams] = useState<Team[]>([]); // All teams from database
  const [selectedTeam1, setSelectedTeam1] = useState<string>('');
  const [selectedTeam2, setSelectedTeam2] = useState<string>('');
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [teamsManuallySelected, setTeamsManuallySelected] = useState(false); // Track if teams were manually selected
  const wsRef = useRef<WebSocket | null>(null);
  const [autoResetTimer, setAutoResetTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  
  // Question selection state
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [showQuestionSelection, setShowQuestionSelection] = useState(false);
  const [selectedRound1, setSelectedRound1] = useState<any[]>([]);
  const [selectedRound2, setSelectedRound2] = useState<any[]>([]);
  const [selectedRound3, setSelectedRound3] = useState<any[]>([]);
  const [currentRoundSelection, setCurrentRoundSelection] = useState<1 | 2 | 3>(1);
  const [questionsSelected, setQuestionsSelected] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false); // Track if question is shown on display
  const [availableQuestionsCount, setAvailableQuestionsCount] = useState(0); // Track available questions

  useEffect(() => {
    // Disable auto-reset for now - message should stay until manually reset
    // Auto-reset buzzer after 5 seconds when someone buzzes
    /*
    if (game?.buzzerPressed && !autoResetTimer) {
      console.log('🕐 Starting auto-reset timer (5 seconds)');
      setCountdown(5);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Auto-reset timer
      const timer = setTimeout(() => {
        console.log('🔄 Auto-resetting buzzer');
        resetBuzzer();
        setTimeout(() => {
          enableBuzzer();
        }, 1000);
        setAutoResetTimer(null);
        setCountdown(0);
      }, 5000);
      
      setAutoResetTimer(timer);
    }
    
    // Clear timer if buzzer is manually reset
    if (!game?.buzzerPressed && autoResetTimer) {
      console.log('🚫 Clearing auto-reset timer');
      clearTimeout(autoResetTimer);
      setAutoResetTimer(null);
      setCountdown(0);
    }
    
    return () => {
      if (autoResetTimer) {
        clearTimeout(autoResetTimer);
      }
    };
    */
  }, [game?.buzzerPressed]);

  useEffect(() => {
    // Connect to WebSocket
    const wsUrl = getWebSocketUrl();
    console.log('🔌 Host connecting to:', wsUrl);
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      // Create game
      wsRef.current?.send(JSON.stringify({
        type: 'host_create',
        data: {}
      }));
    };

    wsRef.current.onmessage = (event) => {
      console.log('📨 HOST received message:', event.data);
      const message: WSMessage = JSON.parse(event.data);
      console.log('📨 Parsed message type:', message.type);
      
      switch (message.type) {
        case 'game_created':
          console.log('✅ Game created:', message.data.game.code);
          setGame(message.data.game);
          break;
        case 'player_joined':
          setWaitingPlayers(prev => [...prev, {
            id: message.data.playerId,
            name: message.data.playerName
          }]);
          break;
        case 'game_update':
          console.log('📨 GAME_UPDATE received');
          console.log('   Server game teams:', message.data.game.teams?.length || 0);
          console.log('   Server team scores:', message.data.game.teams?.map((t: any) => `${t.name}: ${t.score} pts`));
          console.log('   Server team strikes:', message.data.game.teams?.map((t: any) => `${t.name}: ${t.strikes} strikes`));
          
          // Use server data as source of truth
          setGame(message.data.game);
          
          // Log what we just set
          console.log('✅ Game state updated');
          break;
        case 'points_updated':
          console.log('📨 POINTS_UPDATED received');
          console.log('   New scores from server:', message.data.scores);
          // Update team scores from the points_updated message
          setGame(prevGame => {
            if (!prevGame || !prevGame.teams) return prevGame;
            
            const updatedTeams = prevGame.teams.map(team => {
              const serverScore = message.data.scores[team.id];
              if (serverScore !== undefined) {
                console.log(`   Updating ${team.name}: ${team.score} -> ${serverScore}`);
                return { ...team, score: serverScore };
              }
              return team;
            });
            
            console.log('   Final scores:', updatedTeams.map(t => `${t.name}: ${t.score}`));
            
            return {
              ...prevGame,
              teams: updatedTeams
            };
          });
          break;
        case 'teams_selected':
          console.log('📨 TEAMS_SELECTED confirmation from server');
          console.log('   Selected teams:', message.data.teams);
          // Update game with confirmed team selection
          setGame(prevGame => prevGame ? {
            ...prevGame,
            teams: message.data.teams
          } : null);
          break;
        case 'answer_revealed':
          console.log('📨 ANSWER_REVEALED from server');
          console.log('   Answer:', message.data.answer.text);
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
          console.log('📨 QUESTION_CHANGED from server');
          console.log('   New round index:', message.data.currentRoundIndex);
          console.log('   New question index:', message.data.currentQuestionIndex);
          console.log('   New game state:', message.data.gameState);
          // Reset question visibility when question changes
          setQuestionVisible(false);
          // Update game state but preserve team scores
          setGame(prevGame => {
            if (!prevGame) return prevGame;
            
            // Update the rounds structure properly
            const updatedRounds = [...prevGame.rounds];
            if (updatedRounds[message.data.currentRoundIndex]) {
              updatedRounds[message.data.currentRoundIndex].currentQuestionIndex = message.data.currentQuestionIndex;
            }
            
            const newGame = {
              ...prevGame,
              currentRoundIndex: message.data.currentRoundIndex,
              rounds: updatedRounds,
              gameState: message.data.gameState,
              buzzerPressed: null,
              // Reset strikes but preserve scores
              teams: prevGame.teams.map((team: any) => ({
                ...team,
                strikes: 0,
                // Keep the score!
                score: team.score
              }))
            };
            
            console.log('✅ Host game state updated to:', newGame.gameState);
            return newGame;
          });
          break;
        case 'teams_loaded':
          console.log('📨 TEAMS_LOADED message received');
          console.log('   Raw message data:', message.data);
          console.log('   Teams array:', message.data.teams);
          console.log('   Number of teams:', message.data.teams?.length || 0);
          
          if (message.data.teams && message.data.teams.length > 0) {
            console.log('✅ Teams found:');
            message.data.teams.forEach((team: any, index: number) => {
              console.log(`   ${index + 1}. ${team.name} (ID: ${team.id}, Game: ${team.gameCode || 'unknown'})`);
              console.log(`      Players: ${team.players?.length || 0}`);
            });
          } else {
            console.log('❌ No teams in the response');
          }
          
          console.log('🔄 Setting allTeams state...');
          setAllTeams(message.data.teams || []);
          console.log('✅ allTeams state updated');
          break;
        case 'questions_loaded':
          console.log('📨 QUESTIONS_LOADED message received');
          console.log('   Number of questions:', message.data.questions?.length || 0);
          setAllQuestions(message.data.questions || []);
          setAvailableQuestionsCount(message.data.questions?.length || 0);
          console.log('✅ Questions loaded');
          break;
        case 'used_questions_reset':
          console.log('📨 USED_QUESTIONS_RESET message received');
          alert(message.data.message);
          // Reload questions after reset
          requestAllQuestions();
          break;
        case 'game_ended':
          console.log('📨 GAME_ENDED message received');
          alert(`Game Ended!\n\n${message.data.questionsMarked} questions have been marked as used and won't appear in future games.`);
          break;
        case 'buzzer_pressed':
          console.log('📨 HOST received buzzer_pressed:', message.data);
          console.log('   teamId:', message.data.teamId);
          console.log('   teamName:', message.data.teamName);
          console.log('   timestamp:', message.data.timestamp);
          
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
          console.log('📨 HOST received buzzer_enabled');
          setGame(prevGame => prevGame ? {
            ...prevGame,
            buzzerPressed: null,
            gameState: 'buzzer'
          } : null);
          break;
        case 'buzzer_reset':
          console.log('📨 HOST received buzzer_reset');
          setGame(prevGame => prevGame ? {
            ...prevGame,
            buzzerPressed: null,
            gameState: 'buzzer'
          } : null);
          break;
        case 'question_visibility_changed':
          console.log('📨 HOST received question_visibility_changed:', message.data.questionVisible);
          setQuestionVisible(message.data.questionVisible);
          break;
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const sendHostAction = (action: any) => {
    if (wsRef.current && game) {
      wsRef.current.send(JSON.stringify({
        type: 'host_action',
        gameCode: game.code,
        data: action
      }));
    }
  };

  const requestAllTeams = (gameCode: string) => {
    if (wsRef.current && gameCode) {
      console.log('📤 Requesting teams for game:', gameCode);
      wsRef.current.send(JSON.stringify({
        type: 'load_all_teams',
        gameCode: gameCode
      }));
    }
  };

  const requestAllQuestions = () => {
    if (wsRef.current) {
      console.log('📤 Requesting all questions');
      wsRef.current.send(JSON.stringify({
        type: 'load_all_questions'
      }));
    }
  };

  const resetUsedQuestions = () => {
    if (confirm('Are you sure you want to reset all used questions? This will make all questions available again for selection.')) {
      if (wsRef.current) {
        console.log('📤 Resetting used questions');
        wsRef.current.send(JSON.stringify({
          type: 'reset_used_questions'
        }));
      }
    }
  };

  const confirmQuestionSelection = () => {
    if (selectedRound1.length !== 3 || selectedRound2.length !== 3 || selectedRound3.length !== 3) {
      alert('Please select exactly 3 questions for each round');
      return;
    }

    if (wsRef.current && game) {
      console.log('📤 Sending selected questions to server');
      wsRef.current.send(JSON.stringify({
        type: 'select_questions',
        gameCode: game.code,
        data: {
          round1Questions: selectedRound1,
          round2Questions: selectedRound2,
          round3Questions: selectedRound3
        }
      }));
      
      setQuestionsSelected(true);
      setShowQuestionSelection(false);
      alert('Questions selected successfully!');
    }
  };

  const toggleQuestionSelection = (question: any) => {
    const currentSelection = currentRoundSelection === 1 ? selectedRound1 : 
                            currentRoundSelection === 2 ? selectedRound2 : selectedRound3;
    const setSelection = currentRoundSelection === 1 ? setSelectedRound1 : 
                        currentRoundSelection === 2 ? setSelectedRound2 : setSelectedRound3;

    const isSelected = currentSelection.some(q => q.id === question.id);
    
    if (isSelected) {
      // Deselect
      setSelection(currentSelection.filter(q => q.id !== question.id));
    } else {
      // Select (max 3)
      if (currentSelection.length < 3) {
        setSelection([...currentSelection, question]);
      } else {
        alert('You can only select 3 questions per round');
      }
    }
  };

  const selectTeamsForGame = () => {
    console.log('🎯 selectTeamsForGame called');
    console.log('   selectedTeam1:', selectedTeam1);
    console.log('   selectedTeam2:', selectedTeam2);
    console.log('   game:', game?.code);
    console.log('   wsRef:', !!wsRef.current);
    console.log('   allTeams length:', allTeams.length);
    
    // Early return if basic requirements not met
    if (!selectedTeam1 || !selectedTeam2) {
      console.log('❌ No teams selected');
      alert('Please select both teams');
      return;
    }
    
    if (selectedTeam1 === selectedTeam2) {
      console.log('❌ Same team selected twice');
      alert('Please select two different teams');
      return;
    }
    
    // Check if allTeams is populated
    if (!allTeams || allTeams.length === 0) {
      console.error('❌ No teams available for selection');
      alert('No teams available. Please reload teams first.');
      return;
    }
    
    console.log('🎯 Confirming team selection:', selectedTeam1, selectedTeam2);
    
    // Find the selected teams from allTeams
    const team1 = allTeams.find(t => t.id === selectedTeam1);
    const team2 = allTeams.find(t => t.id === selectedTeam2);
    
    if (team1 && team2) {
      console.log('✅ Selected teams:', team1.name, 'vs', team2.name);
      
      // Send to server to update the game with selected teams (only if we have game and wsRef)
      if (game && wsRef.current) {
        sendHostAction({
          type: 'select_game_teams',
          data: { 
            team1Id: selectedTeam1,
            team2Id: selectedTeam2
          }
        });
      } else {
        console.log('⚠️ Skipping server update - game or wsRef not available');
      }
      
      // Update local game state immediately for better UX
      console.log('🔄 Updating local game state with selected teams');
      setGame(prevGame => {
        const newGame = prevGame ? {
          ...prevGame,
          teams: [team1, team2]
        } : {
          // Create minimal game object if none exists
          id: 'temp',
          code: 'TEMP',
          hostId: 'temp',
          teams: [team1, team2],
          rounds: [],
          currentRoundIndex: 0,
          currentTeamTurn: team1.id,
          gameState: 'waiting' as const,
          buzzerPressed: null,
          createdAt: new Date(),
          isActive: true
        };
        
        console.log('✅ Local game state updated with teams:', newGame.teams.map((t: any) => t.name));
        return newGame;
      });
      
      // Mark teams as manually selected to prevent server overwrites
      setTeamsManuallySelected(true);
      console.log('🛡️ Teams marked as manually selected - will be protected from server updates');
      
      // Reset selection and close modal
      setSelectedTeam1('');
      setSelectedTeam2('');
      setShowTeamSelection(false);
      
      console.log('🎉 Teams selected for game successfully!');
    } else {
      console.error('❌ Could not find selected teams in allTeams array');
      console.log('   selectedTeam1:', selectedTeam1, 'found:', !!team1);
      console.log('   selectedTeam2:', selectedTeam2, 'found:', !!team2);
      console.log('   allTeams:', allTeams.map(t => ({id: t.id, name: t.name})));
      alert('Error: Could not find selected teams. Please try again.');
    }
  };

  const createNewTeam = (teamName: string) => {
    if (teamName.trim()) {
      sendHostAction({
        type: 'create_team',
        data: { teamName: teamName.trim() }
      });
    }
  };

  const addPlayerToTeam = (playerId: string, playerName: string, teamId: string) => {
    sendHostAction({
      type: 'add_player_to_team',
      data: { playerId, playerName, teamId }
    });
    
    // Remove from waiting list
    setWaitingPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const removePlayerFromTeam = (playerId: string, teamId: string) => {
    sendHostAction({
      type: 'remove_player_from_team',
      data: { playerId, teamId }
    });
  };

  const addPointsToTeam = (teamId: string, points: number) => {
    console.log(`💰 Client: Adding ${points} points to team ${teamId}`);
    
    // Don't update local state - wait for server response
    // This prevents desync between client and server
    
    // Send to server and let it handle the update
    if (game && wsRef.current) {
      sendHostAction({
        type: 'add_points',
        data: { teamId, points }
      });
    }
  };

  const addStrike = (teamId: string) => {
    sendHostAction({
      type: 'add_strike',
      data: { teamId }
    });
  };

  const startGame = () => {
    sendHostAction({
      type: 'start_game'
    });
  };

  const enableBuzzer = () => {
    sendHostAction({
      type: 'enable_buzzer'
    });
  };

  const resetBuzzer = () => {
    sendHostAction({
      type: 'reset_buzzer'
    });
  };

  const nextQuestion = () => {
    setQuestionVisible(false); // Hide question when moving to next
    sendHostAction({
      type: 'next_question'
    });
  };

  const showQuestionOnDisplay = () => {
    setQuestionVisible(true);
    sendHostAction({
      type: 'show_question'
    });
  };

  const hideQuestionOnDisplay = () => {
    setQuestionVisible(false);
    sendHostAction({
      type: 'hide_question'
    });
  };

  const endGame = () => {
    if (confirm('Are you sure you want to end the game? This will mark all selected questions as used and they won\'t appear in future games.')) {
      sendHostAction({
        type: 'end_game'
      });
    }
  };

  const revealAnswer = (answerIndex: number) => {
    sendHostAction({
      type: 'reveal_answer',
      data: { answerIndex }
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Connecting to server...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Creating game...</div>
      </div>
    );
  }

  const currentRound = game?.rounds?.[game.currentRoundIndex || 0];
  const currentQuestion = currentRound?.questions?.[currentRound.currentQuestionIndex || 0];

  return (
    <div className="min-h-screen text-white p-6 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/Hype_Date.png)' }}
      />
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-black/40" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Feud.Exe - Host Control</h1>
              <p className="text-gray-300">Game Code: <span className="text-2xl font-mono bg-blue-600 px-3 py-1 rounded">{game.code}</span></p>
            </div>
            <div className="text-right">
              <p className="text-lg">Round {game.currentRoundIndex + 1} of 3</p>
              <p className="text-gray-300">Question {currentRound?.currentQuestionIndex + 1} of 3</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams Overview */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              {/* <h2 className="text-xl font-bold">Game Teams</h2> */}
              <div className="space-x-2">
                <button
                  onClick={() => {
                    console.log('🎯 Select Teams button clicked');
                    console.log('   Current allTeams:', allTeams.length);
                    console.log('   Game code:', game?.code);
                    console.log('   WebSocket ready:', !!wsRef.current);
                    
                    // Load teams directly here
                    if (game?.code) {
                      requestAllTeams(game.code);
                    } else {
                      console.error('❌ No game code available');
                    }
                    
                    setShowTeamSelection(true);
                  }}
                  className="bg-blue-600 mb-10 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Select Teams for Game
                </button>
                <button
                  onClick={() => {
                    requestAllQuestions();
                    setShowQuestionSelection(true);
                  }}
                  className={`mb-10 px-4 py-2 rounded ${questionsSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                >
                  {questionsSelected ? '✓ Questions Selected' : 'Select Questions'}
                </button>
                <button
                  onClick={() => window.open(`/team-management?code=${game.code}`, '_blank')}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                >
                  Open Team Management
                </button>
                <button
                  onClick={() => window.open(`/leaderboard?code=${game.code}`, '_blank')}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
                >
                  🏆 Leaderboard
                </button>
              </div>
            </div>

            {/* Question Selection Modal */}
            {showQuestionSelection && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Select Questions for Each Round</h3>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">Available: {availableQuestionsCount} questions</p>
                      <button
                        onClick={resetUsedQuestions}
                        className="text-xs text-yellow-400 hover:text-yellow-300 underline mt-1"
                      >
                        Reset Used Questions
                      </button>
                    </div>
                  </div>
                  
                  {/* Warning if not enough questions */}
                  {availableQuestionsCount < 9 && (
                    <div className="bg-red-900 border border-red-600 rounded-lg p-4 mb-4">
                      <p className="text-red-200 font-semibold">⚠️ Warning: Only {availableQuestionsCount} questions available!</p>
                      <p className="text-red-300 text-sm mt-1">You need 9 questions (3 per round). Click "Reset Used Questions" to make all questions available again.</p>
                    </div>
                  )}
                  
                  {/* Round Tabs */}
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => setCurrentRoundSelection(1)}
                      className={`px-4 py-2 rounded ${currentRoundSelection === 1 ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      Round 1 ({selectedRound1.length}/3)
                    </button>
                    <button
                      onClick={() => setCurrentRoundSelection(2)}
                      className={`px-4 py-2 rounded ${currentRoundSelection === 2 ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      Round 2 ({selectedRound2.length}/3)
                    </button>
                    <button
                      onClick={() => setCurrentRoundSelection(3)}
                      className={`px-4 py-2 rounded ${currentRoundSelection === 3 ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      Round 3 ({selectedRound3.length}/3)
                    </button>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                    {allQuestions.map((question) => {
                      const currentSelection = currentRoundSelection === 1 ? selectedRound1 : 
                                              currentRoundSelection === 2 ? selectedRound2 : selectedRound3;
                      const isSelected = currentSelection.some(q => q.id === question.id);
                      const isUsedInOtherRound = (
                        (currentRoundSelection !== 1 && selectedRound1.some(q => q.id === question.id)) ||
                        (currentRoundSelection !== 2 && selectedRound2.some(q => q.id === question.id)) ||
                        (currentRoundSelection !== 3 && selectedRound3.some(q => q.id === question.id))
                      );

                      return (
                        <div
                          key={question.id}
                          onClick={() => !isUsedInOtherRound && toggleQuestionSelection(question)}
                          className={`p-3 rounded cursor-pointer ${
                            isSelected ? 'bg-green-600' : 
                            isUsedInOtherRound ? 'bg-gray-600 opacity-50 cursor-not-allowed' :
                            'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          <div className="font-semibold">{question.text}</div>
                          <div className="text-sm text-gray-300 mt-1">
                            {question.answers.length} answers
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={confirmQuestionSelection}
                      disabled={selectedRound1.length !== 3 || selectedRound2.length !== 3 || selectedRound3.length !== 3}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-semibold"
                    >
                      Confirm Selection
                    </button>
                    <button
                      onClick={() => setShowQuestionSelection(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Team Selection Modal */}
            {showTeamSelection && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold mb-4">Select 2 Teams for the Game</h3>
                  
                  {/* Debug Info */}
                  <div className="mb-4 p-2 bg-red-900 rounded text-xs">
                    <div>🐛 Debug Info:</div>
                    <div>allTeams.length: {allTeams.length}</div>
                    <div>Teams: {JSON.stringify(allTeams.map(t => ({name: t.name, id: t.id})))}</div>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        console.log('🔄 Manual team loading triggered');
                        console.log('   Current allTeams:', allTeams);
                        console.log('   WebSocket ready:', !!wsRef.current);
                        console.log('   Game code:', game?.code);
                        
                        if (game?.code) {
                          requestAllTeams(game.code);
                        }
                      }}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded mb-4"
                    >
                      🔄 Reload Teams (Debug)
                    </button>
                    <div>
                      <label className="block text-sm font-medium mb-2">Team 1</label>
                      {allTeams.length === 0 ? (
                        <div className="w-full px-3 py-2 bg-gray-600 text-gray-400 rounded border border-gray-600">
                          No teams loaded. Click "🔄 Reload Teams" above.
                        </div>
                      ) : (
                        <select
                          value={selectedTeam1}
                          onChange={(e) => setSelectedTeam1(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select Team 1</option>
                          {allTeams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name} ({team.players?.length || 0} players) {team.gameCode && team.gameCode !== game?.code ? `[${team.gameCode}]` : ''}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Team 2</label>
                      {allTeams.length === 0 ? (
                        <div className="w-full px-3 py-2 bg-gray-600 text-gray-400 rounded border border-gray-600">
                          No teams loaded. Click "🔄 Reload Teams" above.
                        </div>
                      ) : (
                        <select
                          value={selectedTeam2}
                          onChange={(e) => setSelectedTeam2(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select Team 2</option>
                          {allTeams.filter(team => team.id !== selectedTeam1).map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name} ({team.players?.length || 0} players) {team.gameCode && team.gameCode !== game?.code ? `[${team.gameCode}]` : ''}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={selectTeamsForGame}
                        disabled={!selectedTeam1 || !selectedTeam2 || allTeams.length === 0}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-semibold"
                      >
                        {allTeams.length === 0 ? 'Load Teams First' : 'Confirm Selection'}
                      </button>
                      <button
                        onClick={() => setShowTeamSelection(false)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Current Game Teams Display */}
            <div className="space-y-4">
              {!game?.teams || game.teams.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-lg mb-2">No teams selected for the game</p>
                  <p className="text-sm">Click "Select Teams for Game" to choose 2 teams to compete</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-green-400">Selected Teams for Game</h4>
                    <p className="text-sm text-gray-300">
                      {game.teams[0]?.name} vs {game.teams[1]?.name}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {game.teams.map((team: Team, index: number) => (
                      <div key={team.id} className="p-4 bg-gray-700 rounded-lg border-2 border-green-500">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold text-green-400">
                            {team.name} {index === 0 ? '(Team 1)' : '(Team 2)'}
                          </h4>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-blue-400">{team.score}</span>
                            <div className="text-sm text-gray-400">Players: {team.players?.length || 0}</div>
                          </div>
                        </div>
                        
                        {/* Strikes Display */}
                        <div className="flex items-center mb-3">
                          <span className="text-sm text-gray-400 mr-2">Strikes:</span>
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full mr-1 ${
                                i < (team.strikes || 0) ? 'bg-red-500' : 'bg-gray-600'
                              }`}
                            />
                          ))}
                          <span className="text-xs font-bold text-red-400 ml-2">({team.strikes || 0}/3)</span>
                        </div>
                        
                        <div className="space-y-1">
                          {team.players && team.players.length > 0 ? (
                            team.players.map((player: Player) => (
                              <div key={player.id} className="bg-gray-600 p-2 rounded">
                                <span className="text-sm">{player.name}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm italic">No players assigned</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Game Actions for Selected Teams */}
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <h5 className="font-semibold mb-2">Game Actions</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedTeam1('');
                          setSelectedTeam2('');
                          setTeamsManuallySelected(false); // Reset protection
                          setGame(prevGame => prevGame ? { ...prevGame, teams: [] } : null);
                        }}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                      >
                        Clear Selection
                      </button>
                      <button
                        onClick={() => setShowTeamSelection(true)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                      >
                        Change Teams
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Available Teams Info */}
            {allTeams.length > 0 && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="font-semibold mb-2">Available Teams ({allTeams.length})</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  {allTeams.map((team) => (
                    <div key={team.id} className="flex justify-between items-center py-1">
                      <span className="flex items-center">
                        {team.name}
                        {team.gameCode && team.gameCode !== game?.code && (
                          <span className="ml-2 px-2 py-1 bg-blue-600 text-xs rounded">
                            {team.gameCode}
                          </span>
                        )}
                      </span>
                      <span className="text-gray-400">{team.players?.length || 0} players</span>
                    </div>
                  ))}
                </div>
                
                {/* Quick Stats */}
                <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-400">
                  <div className="grid grid-cols-2 gap-4">
                    <div>Total Teams: {allTeams.length}</div>
                    <div>Total Players: {allTeams.reduce((sum, team) => sum + (team.players?.length || 0), 0)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Game Control */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            {/* Simple Buzzer Message - Persistent */}
            {game.buzzerPressed && (
              <div className="bg-green-600 rounded-lg p-4 mb-6 text-center">
                <p className="text-2xl font-bold text-white">
                  🔥 Team "{game.buzzerPressed.teamName || game.buzzerPressed.teamId || 'Unknown'}" pressed the buzzer first! 🔥
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      resetBuzzer();
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg mr-3"
                  >
                    Reset Buzzer
                  </button>
                  <button
                    onClick={() => {
                      resetBuzzer();
                      setTimeout(() => {
                        enableBuzzer();
                      }, 1000);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg"
                  >
                    Reset & Enable Buzzer
                  </button>
                </div>
              </div>
            )}

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-700 p-2 mb-4 text-xs">
                <div>Game State: {game.gameState}</div>
                <div>Buzzer Pressed: {game.buzzerPressed ? `Yes - ${game.buzzerPressed.teamName}` : 'No'}</div>
                <div>Teams: {game.teams?.length || 0}</div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Game Control</h2>
              <div className="space-x-2">
                {/* Debug: Always show what state we're in */}
                <span className="text-xs text-gray-400 mr-4">
                  State: {game.gameState} | Buzzer: {game.buzzerPressed ? 'Yes' : 'No'}
                </span>
                
                {game.gameState === 'waiting' && (
                  <button
                    onClick={startGame}
                    disabled={!questionsSelected}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded"
                    title={!questionsSelected ? 'Please select questions first' : ''}
                  >
                    Start Game {!questionsSelected && '(Select Questions First)'}
                  </button>
                )}
                {game.gameState === 'playing' && (
                  <button
                    onClick={enableBuzzer}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Enable Buzzer
                  </button>
                )}
                {game.gameState === 'buzzer' && (
                  <button
                    onClick={resetBuzzer}
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
                  >
                    Reset Buzzer (Active)
                  </button>
                )}
                {game.gameState === 'answering' && (
                  <button
                    onClick={resetBuzzer}
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
                  >
                    Reset Buzzer (Answering)
                  </button>
                )}
                <button
                  onClick={nextQuestion}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Next Question
                </button>
                {game.gameState !== 'waiting' && (
                  <button
                    onClick={endGame}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
                  >
                    🏁 End Game
                  </button>
                )}
              </div>
            </div>

            {/* Team Scores and Controls */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {game.teams.map((team: Team) => (
                <div key={team.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <span className="text-2xl font-bold">{team.score}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Strikes:</span>
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < team.strikes ? 'bg-red-500' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-red-400">({team.strikes}/3)</span>
                    </div>
                    <button
                      onClick={() => {
                        console.log(`🔴 Adding strike to team: ${team.name} (${team.id})`);
                        console.log(`   Current strikes: ${team.strikes}`);
                        addStrike(team.id);
                      }}
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                      disabled={team.strikes >= 3}
                    >
                      Add Strike
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => addPointsToTeam(team.id, 10)}
                      className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => addPointsToTeam(team.id, 25)}
                      className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                    >
                      +25
                    </button>
                    <button
                      onClick={() => addPointsToTeam(team.id, 50)}
                      className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                    >
                      +50
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!questionsSelected && (
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-6 text-center">
                <p className="text-xl font-bold text-yellow-300 mb-2">⚠️ No Questions Selected</p>
                <p className="text-yellow-200 mb-4">Please select 9 questions (3 per round) before starting the game.</p>
                <button
                  onClick={() => {
                    requestAllQuestions();
                    setShowQuestionSelection(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded font-semibold"
                >
                  Select Questions Now
                </button>
              </div>
            )}

            {currentQuestion && questionsSelected && (
              <div>
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{currentQuestion.text}</h3>
                    <button
                      onClick={questionVisible ? hideQuestionOnDisplay : showQuestionOnDisplay}
                      className={`px-6 py-2 rounded font-semibold ${
                        questionVisible 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {questionVisible ? '👁️ Hide Question on Display' : '👁️ Show Question on Display'}
                    </button>
                  </div>
                  {questionVisible && (
                    <p className="text-sm text-green-400">✓ Question is visible on display</p>
                  )}
                  {!questionVisible && (
                    <p className="text-sm text-yellow-400">⚠️ Question is hidden from display</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {currentQuestion.answers.map((answer, index) => (
                    <div key={index} className="space-y-2">
                      <div
                        className={`p-3 rounded-lg flex justify-between items-center ${
                          answer.revealed 
                            ? 'bg-green-600' 
                            : 'bg-gray-700'
                        }`}
                      >
                        <span className="font-semibold flex-1">
                          {answer.text}
                        </span>
                        <span className="text-xl font-bold mr-4">
                          {answer.points}
                        </span>
                        {!answer.revealed && (
                          <button
                            onClick={() => revealAnswer(index)}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm font-semibold"
                          >
                            Reveal
                          </button>
                        )}
                        {answer.revealed && (
                          <span className="text-green-200 text-sm font-semibold">
                            ✓ Revealed
                          </span>
                        )}
                      </div>
                      
                      {/* Point Assignment Buttons - Only show when answer is revealed */}
                      {answer.revealed && (
                        <div className="flex justify-center space-x-2">
                          <span className="text-sm text-gray-300">Give {answer.points} points to:</span>
                          {game.teams.map((team) => (
                            <button
                              key={team.id}
                              onClick={() => addPointsToTeam(team.id, answer.points)}
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                            >
                              {team.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game State */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span>Game State: <span className="font-bold capitalize">{game.gameState}</span></span>
            <span>Current Turn: <span className="font-bold">{
              game.teams.find(t => t.id === game.currentTeamTurn)?.name || 'None'
            }</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}