import React, { useState, useEffect, useCallback } from 'react';
import { questions as sourceQuestions } from './data/questions';
import { tournamentOpponents } from './data/opponents';
import { Question, Option, Category, QuizState, TournamentState, Opponent } from './types';
import Timer from './components/Timer';
import ProgressBar from './components/ProgressBar';
import TournamentBracket from './components/TournamentBracket';

// Shuffle generic array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Initial Tournament State
const initialTournamentState: TournamentState = {
  isActive: false,
  currentRoundIndex: 0,
  opponents: [],
  bracket: [],
  currentMatch: null,
  history: []
};

// Initial State
const initialState: QuizState = {
  status: 'menu',
  selectedCategory: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  timeElapsed: 0,
  answers: {},
  tournament: initialTournamentState
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<QuizState>(initialState);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  
  // State specific for Text Input Mode
  const [textInput, setTextInput] = useState("");
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCorrectInput, setIsCorrectInput] = useState<boolean | null>(null);

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && gameState.status === 'playing') {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameState.status]);

  // --- LOGICA DE TORNEO ---

  const initTournament = () => {
    // 1. Select opponents (Simulated bracket seed)
    // We pick specific indices from our list to be the "opponents" the player faces
    // Round 1: index 0. Round 2: index 7. Round 3: index 11. Final: index 13.
    const opponents = tournamentOpponents;

    // 2. Prepare Match 1 (Octavos)
    const firstOpponent = opponents[0];
    const questionsForMatch = getMixedQuestions(5); // 5 questions per match

    const newTournamentState: TournamentState = {
      isActive: true,
      currentRoundIndex: 0,
      opponents: opponents,
      bracket: [],
      history: [],
      currentMatch: {
        opponent: firstOpponent,
        playerScore: 0,
        opponentScore: 0,
        questions: questionsForMatch,
        currentQuestionIndex: 0
      }
    };

    setGameState({
      ...initialState,
      status: 'tournament-hub', // Go to bracket view first
      selectedCategory: 'torneo',
      tournament: newTournamentState
    });
  };

  const getMixedQuestions = (count: number): Question[] => {
    const mixed = shuffleArray(sourceQuestions);
    // Deep shuffle options
    return mixed.slice(0, count).map(q => {
      if (q.type === 'multiple-choice' && q.options) {
        return { ...q, options: shuffleArray(q.options) };
      }
      return q;
    });
  };

  const startTournamentMatch = () => {
    if (!gameState.tournament.currentMatch) return;

    setGameState(prev => ({
      ...prev,
      status: 'playing',
      questions: prev.tournament.currentMatch!.questions,
      currentQuestionIndex: 0,
      score: 0, // Reset visual score for the match
      questionsTotal: prev.tournament.currentMatch!.questions.length
    } as any));
    
    setIsTimerRunning(true);
    resetQuestionState();
  };

  // --- GAME LOGIC ---

  const startQuiz = (category: Category) => {
    if (category === 'torneo') {
      initTournament();
      return;
    }

    const categoryQuestions = sourceQuestions.filter(q => q.category === category);
    const shuffledQuestions = shuffleArray(categoryQuestions);
    const deepShuffledQuestions = shuffledQuestions.map(q => {
      if (q.type === 'multiple-choice' && q.options) {
        return { ...q, options: shuffleArray(q.options) };
      }
      return q;
    });

    setGameState({
      ...initialState,
      status: 'playing',
      selectedCategory: category,
      questions: deepShuffledQuestions,
      questionsTotal: deepShuffledQuestions.length,
    } as any);
    
    setIsTimerRunning(true);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedOptionId(null);
    setTextInput("");
    setIsAnswered(false);
    setIsCorrectInput(null);
    setHintMessage(null);
  };

  // Logic to simulate Bot answer
  const processBotTurn = (currentMatch: NonNullable<TournamentState['currentMatch']>) => {
    const difficulty = currentMatch.opponent.difficulty; // 0.0 to 1.0
    const roll = Math.random();
    const botScored = roll < difficulty;
    return botScored ? currentMatch.opponentScore + 1 : currentMatch.opponentScore;
  };

  // Handler for Multiple Choice
  const handleOptionClick = (optionId: string) => {
    if (isAnswered) return;

    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = optionId === currentQuestion.correctOptionId;

    setGameState(prev => {
      // Tournament Logic: Update Bot Score too
      let newTournamentState = prev.tournament;
      if (prev.selectedCategory === 'torneo' && prev.tournament.currentMatch) {
        const newBotScore = processBotTurn(prev.tournament.currentMatch);
        newTournamentState = {
          ...prev.tournament,
          currentMatch: {
            ...prev.tournament.currentMatch,
            playerScore: isCorrect ? prev.tournament.currentMatch.playerScore + 1 : prev.tournament.currentMatch.playerScore,
            opponentScore: newBotScore
          }
        };
      }

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        answers: { ...prev.answers, [currentQuestion.id]: optionId },
        tournament: newTournamentState
      };
    });
  };

  // Helper to normalize strings for comparison
  const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');

  // Handler for Text Input
  const handleSubmitText = () => {
    if (isAnswered || !textInput.trim()) return;

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const userNorm = normalize(textInput);
    const answersNorm = currentQuestion.acceptedAnswers?.map(normalize) || [];
    
    let isCorrect = answersNorm.includes(userNorm);

    // Hints Logic
    if (!isCorrect) {
      const userNoSemi = userNorm.replace(/;/g, '');
      const answersNoSemi = answersNorm.map(a => a.replace(/;/g, ''));
      if (answersNoSemi.includes(userNoSemi) && currentQuestion.acceptedAnswers?.some(a => a.includes(';'))) {
        setHintMessage("¡Casi! Te faltó el punto y coma (;) al final.");
        return;
      }
    }

    setIsCorrectInput(isCorrect);
    setIsAnswered(true);
    setHintMessage(null);

    setGameState(prev => {
      // Tournament Logic: Update Bot Score
      let newTournamentState = prev.tournament;
      if (prev.selectedCategory === 'torneo' && prev.tournament.currentMatch) {
        const newBotScore = processBotTurn(prev.tournament.currentMatch);
        newTournamentState = {
          ...prev.tournament,
          currentMatch: {
            ...prev.tournament.currentMatch,
            playerScore: isCorrect ? prev.tournament.currentMatch.playerScore + 1 : prev.tournament.currentMatch.playerScore,
            opponentScore: newBotScore
          }
        };
      }

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        answers: { ...prev.answers, [currentQuestion.id]: userNorm },
        tournament: newTournamentState
      };
    });
  };

  const handleNextQuestion = () => {
    if (gameState.currentQuestionIndex < gameState.questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      resetQuestionState();
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsTimerRunning(false);
    
    // Tournament Logic: Check Win Condition
    if (gameState.selectedCategory === 'torneo' && gameState.tournament.currentMatch) {
      const { playerScore, opponentScore } = gameState.tournament.currentMatch;
      // Win condition: Player > Opponent OR (Player == Opponent AND Player >= 3 (Pass)) 
      // Let's make it simple: Player >= Opponent to advance
      const playerWon = playerScore >= opponentScore;

      if (playerWon) {
        // Prepare Next Round
        const nextRoundIndex = gameState.tournament.currentRoundIndex + 1;
        
        if (nextRoundIndex > 3) {
          // WON THE WHOLE TOURNAMENT
           setGameState(prev => ({ ...prev, status: 'finished' })); // Will show generic win screen, but customized
        } else {
          // Advance Round
          const nextOpponentIndex = nextRoundIndex === 1 ? 7 : (nextRoundIndex === 2 ? 11 : 13);
          const nextOpponent = gameState.tournament.opponents[nextOpponentIndex];
          const nextQuestions = getMixedQuestions(5);

          setGameState(prev => ({
            ...prev,
            status: 'tournament-hub', // Go back to bracket
            score: 0, // Reset global score for safety
            tournament: {
              ...prev.tournament,
              currentRoundIndex: nextRoundIndex,
              currentMatch: {
                opponent: nextOpponent,
                playerScore: 0,
                opponentScore: 0,
                questions: nextQuestions,
                currentQuestionIndex: 0
              }
            }
          }));
        }
      } else {
        // LOST
        setGameState(prev => ({ ...prev, status: 'finished' })); // Generic finish, but tournament state implies loss
      }
    } else {
      setGameState(prev => ({ ...prev, status: 'finished' }));
    }
  };

  const returnToMenu = () => {
    setGameState(initialState);
    resetQuestionState();
    setIsTimerRunning(false);
  };

  const renderQuestionText = (text: string, category: Category | null) => {
    if (category === 'errores' && text.includes("CASO:")) {
      const parts = text.split("CASO:");
      return (
        <div>
          {parts[0] && <p className="mb-2">{parts[0]}</p>}
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm md:text-base border-l-4 border-green-500 shadow-inner whitespace-pre-wrap leading-relaxed">
            <span className="opacity-50 select-none mr-2">$</span>
            {parts[1].trim()}
          </div>
        </div>
      );
    }
    return text;
  };

  // --- RENDERERS ---

  // 1. TOURNAMENT HUB
  if (gameState.status === 'tournament-hub') {
    return <TournamentBracket tournament={gameState.tournament} onStartNextMatch={startTournamentMatch} />;
  }

  // 2. MENU SCREEN
  if (gameState.status === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-6xl w-full text-center space-y-12">
          <div className="space-y-4 animate-fade-in-down">
            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
              SQL Master
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Plataforma de entrenamiento profesional para administración de bases de datos MySQL.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto">
            {/* CARDS EXISTING */}
            <button onClick={() => startQuiz('backups')} className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1 text-left flex flex-col h-full overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Backups</h3>
              <p className="text-slate-400 text-sm flex-grow">Aprende la teoría detrás de mysqldump, logs binarios y restauración.</p>
            </button>

            <button onClick={() => startQuiz('usuarios')} className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-emerald-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 text-left flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Usuarios</h3>
              <p className="text-slate-400 text-sm flex-grow">Domina GRANT, REVOKE y la seguridad de cuentas.</p>
            </button>

            <button onClick={() => startQuiz('practica')} className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-purple-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:-translate-y-1 text-left flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Práctica SQL</h3>
              <p className="text-slate-400 text-sm flex-grow">Escribe código real. Sintaxis flexible con ayudas inteligentes.</p>
            </button>

            <button onClick={() => startQuiz('errores')} className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-orange-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1 text-left flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Adivina el Error</h3>
              <p className="text-slate-400 text-sm flex-grow">Diagnostica problemas reales en consola y scripts.</p>
            </button>
          </div>

          {/* TORNEO BANNER */}
          <div className="w-full max-w-4xl mx-auto mt-8">
            <button onClick={() => startQuiz('torneo')} className="w-full group relative bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/50 hover:border-yellow-400 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:-translate-y-1 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-wider mb-2">🏆 Torneo MySQL</h3>
                  <p className="text-yellow-100/80">Compite contra bots inteligentes en 4 rondas de eliminación. ¿Podrás vencer al RootMaster?</p>
                </div>
                <div className="bg-yellow-500 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                  ENTRAR AL TORNEO
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. RESULT SCREEN (Handle Tournament End specifically)
  if (gameState.status === 'finished') {
    const isTournament = gameState.selectedCategory === 'torneo';
    let percentage = 0;
    let message = "";
    let colorClass = "";
    let bgGradient = "";

    // Specific Tournament Logic
    if (isTournament) {
      const round = gameState.tournament.currentRoundIndex;
      const lastMatch = gameState.tournament.currentMatch;
      const wonMatch = lastMatch ? lastMatch.playerScore >= lastMatch.opponentScore : false;
      
      if (wonMatch && round === 3) {
        // Grand Champion
        message = "¡CAMPEÓN DEL TORNEO! 🏆 Has derrotado al sistema.";
        colorClass = "text-yellow-400";
        bgGradient = "from-yellow-600/30 to-orange-900/30";
        percentage = 100;
      } else {
        // Eliminated
        message = `Eliminado en ${round === 0 ? 'Octavos' : round === 1 ? 'Cuartos' : round === 2 ? 'Semifinal' : 'la Final'}.`;
        colorClass = "text-red-400";
        bgGradient = "from-red-600/30 to-red-900/30";
        percentage = lastMatch ? Math.round((lastMatch.playerScore / lastMatch.questions.length) * 100) : 0;
      }
    } else {
      // Standard Logic
      percentage = Math.round((gameState.score / gameState.questions.length) * 100);
      if (percentage >= 90) {
        message = "¡Excelente! Nivel Experto.";
        colorClass = "text-emerald-400";
        bgGradient = "from-emerald-500/20 to-emerald-900/20";
      } else if (percentage >= 70) {
        message = "¡Buen trabajo! Sigue practicando.";
        colorClass = "text-blue-400";
        bgGradient = "from-blue-500/20 to-blue-900/20";
      } else {
        message = "Repasa los conceptos y vuelve a intentar.";
        colorClass = "text-orange-400";
        bgGradient = "from-orange-500/20 to-orange-900/20";
      }
    }

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} pointer-events-none`} />
          
          <h2 className="text-3xl font-bold text-white mb-2 relative">{isTournament ? 'Fin del Torneo' : 'Resultados'}</h2>
          {!isTournament && <p className="text-slate-400 mb-8 relative uppercase tracking-wider text-sm font-bold">{gameState.selectedCategory}</p>}
          
          <div className="mb-8 relative">
            <div className={`text-6xl font-black ${colorClass} mb-4 leading-tight`}>{isTournament && percentage === 100 ? 'VICTORIA' : (isTournament ? 'DERROTA' : `${percentage}%`)}</div>
            {isTournament && gameState.tournament.currentMatch && (
              <div className="flex justify-center gap-8 text-xl font-bold mb-4 bg-black/20 p-4 rounded-xl">
                 <div className="text-blue-400 flex flex-col"><span>TÚ</span><span className="text-3xl">{gameState.tournament.currentMatch.playerScore}</span></div>
                 <div className="text-slate-500 pt-2">vs</div>
                 <div className="text-red-400 flex flex-col"><span>BOT</span><span className="text-3xl">{gameState.tournament.currentMatch.opponentScore}</span></div>
              </div>
            )}
            {!isTournament && <div className="text-slate-300 text-lg">
              <span className="font-bold text-white">{gameState.score}</span> de {gameState.questions.length} aciertos
            </div>}
          </div>

          <p className={`text-lg font-medium mb-8 ${colorClass} relative`}>
            {message}
          </p>

          <button
            onClick={returnToMenu}
            className="relative w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg shadow-blue-900/30"
          >
            Volver al Menú Principal
          </button>
        </div>
      </div>
    );
  }

  // 4. GAMEPLAY SCREEN
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  
  const getFeedbackColor = () => {
    if (currentQuestion.type === 'multiple-choice') {
      return selectedOptionId === currentQuestion.correctOptionId ? "emerald" : "red";
    } else {
      return isCorrectInput ? "emerald" : "red";
    }
  };

  const feedbackColor = getFeedbackColor();
  const isTournamentMode = gameState.selectedCategory === 'torneo';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-6 md:py-10 px-4">
      {/* Header */}
      <header className="w-full max-w-3xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={returnToMenu}
            className="bg-white p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
            title="Volver al inicio"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </button>
          
          {isTournamentMode ? (
            <div className="flex items-center gap-6 bg-slate-900 text-white px-6 py-2 rounded-full shadow-lg border border-slate-700">
               <div className="text-blue-400 font-bold flex items-center gap-2">
                 <span>👤</span> {gameState.tournament.currentMatch?.playerScore}
               </div>
               <div className="text-slate-500 text-xs font-mono">VS</div>
               <div className="text-red-400 font-bold flex items-center gap-2">
                 {gameState.tournament.currentMatch?.opponentScore} <span>🤖</span>
               </div>
            </div>
          ) : (
             <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 capitalize">
                {gameState.selectedCategory?.replace('-', ' ')}
              </h1>
            </div>
          )}
         
        </div>
        <Timer seconds={gameState.timeElapsed} />
      </header>

      <main className="w-full max-w-3xl flex-grow flex flex-col">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col flex-grow relative">
          
          <div className="px-8 pt-8 pb-4">
             <ProgressBar current={gameState.currentQuestionIndex} total={gameState.questions.length} />
          </div>

          <div className="px-8 py-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
              {renderQuestionText(currentQuestion.question, gameState.selectedCategory)}
            </h2>
          </div>

          {/* RENDER OPTIONS OR TEXT INPUT */}
          <div className="px-8 pb-8 flex-grow">
            
            {/* Case 1: Multiple Choice */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  let btnClass = "group w-full text-left p-5 rounded-xl border-2 transition-all duration-200 font-medium relative overflow-hidden ";
                  let circleClass = "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-colors border ";
                  
                  if (isAnswered) {
                    if (option.id === currentQuestion.correctOptionId) {
                      btnClass += "bg-emerald-50 border-emerald-500 text-emerald-900";
                      circleClass += "bg-emerald-500 border-emerald-500 text-white";
                    } else if (option.id === selectedOptionId) {
                      btnClass += "bg-red-50 border-red-500 text-red-900";
                      circleClass += "bg-red-500 border-red-500 text-white";
                    } else {
                      btnClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-50";
                      circleClass += "bg-slate-200 border-slate-200 text-slate-500";
                    }
                  } else {
                    btnClass += "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md cursor-pointer hover:-translate-y-0.5";
                    circleClass += "bg-slate-100 border-slate-300 text-slate-500 group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option.id)}
                      disabled={isAnswered}
                      className={btnClass}
                    >
                      <div className="flex items-center relative z-10">
                        <span className={circleClass}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-lg">{option.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Case 2: Text Input */}
            {currentQuestion.type === 'text-input' && (
              <div className="space-y-4">
                <div className="relative">
                  <textarea 
                    value={textInput}
                    onChange={(e) => {
                      setTextInput(e.target.value);
                      if (hintMessage) setHintMessage(null); // Clear hint on edit
                    }}
                    disabled={isAnswered}
                    placeholder="Escribe tu sentencia SQL aquí..."
                    className={`w-full p-4 rounded-xl border-2 font-mono text-lg outline-none transition-all resize-none h-32
                      ${isAnswered 
                        ? (isCorrectInput ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "bg-red-50 border-red-500 text-red-900")
                        : "bg-slate-900 text-green-400 border-slate-700 focus:border-blue-500 focus:shadow-lg placeholder:text-slate-600"
                      }`}
                    autoFocus
                    spellCheck={false}
                  />
                  {hintMessage && !isAnswered && (
                    <div className="absolute bottom-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm font-bold shadow-sm border border-yellow-200 animate-bounce">
                      💡 {hintMessage}
                    </div>
                  )}
                </div>

                {!isAnswered && (
                  <button 
                    onClick={handleSubmitText}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md border-b-4 border-blue-800 hover:border-blue-700 active:border-b-0 active:translate-y-1"
                  >
                    Verificar Código
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Feedback Section */}
          {isAnswered && (
            <div className="bg-slate-50 border-t border-slate-200 p-8 animate-fade-in-up">
              <div className={`p-5 rounded-2xl mb-6 flex gap-4 border ${
                  feedbackColor === 'emerald' 
                  ? "bg-emerald-100/50 text-emerald-900 border-emerald-200" 
                  : "bg-red-100/50 text-red-900 border-red-200"
              }`}>
                <div className="flex-shrink-0 mt-1">
                  {feedbackColor === 'emerald'
                    ? <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    : <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  }
                </div>
                <div className="w-full">
                  <p className="font-bold text-lg mb-1">
                    {feedbackColor === 'emerald' ? "¡Correcto!" : "Incorrecto"}
                  </p>
                  <p className="leading-relaxed opacity-90">{currentQuestion.explanation}</p>
                  
                  {currentQuestion.type === 'text-input' && !isCorrectInput && (
                    <div className="mt-3 p-3 bg-white/50 rounded-lg border border-red-200/50">
                      <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">Solución Esperada:</p>
                      <div className="font-mono text-sm bg-slate-900 text-green-400 p-2 rounded">
                        {currentQuestion.acceptedAnswers?.[0]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-slate-300 transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  {gameState.currentQuestionIndex === gameState.questions.length - 1 ? "Ver Resultados" : "Siguiente"}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;