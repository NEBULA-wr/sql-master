export interface Option {
  id: string;
  text: string;
}

export type Category = 'backups' | 'usuarios' | 'practica' | 'errores' | 'torneo';
export type QuestionType = 'multiple-choice' | 'text-input';

export interface Question {
  id: number;
  category: Category | 'mixed'; // mixed for tournament
  type: QuestionType;
  question: string;
  options?: Option[]; // Optional for text-input
  correctOptionId?: string; // Optional for text-input
  acceptedAnswers?: string[]; // Required for text-input
  explanation: string;
}

// --- TOURNAMENT TYPES ---

export type RoundName = 'Octavos de Final' | 'Cuartos de Final' | 'Semifinal' | 'Gran Final';

export interface Opponent {
  id: string;
  name: string;
  title: string; // e.g. "Jr DBA", "Senior Architect"
  avatarColor: string;
  difficulty: number; // 0.1 to 1.0 (probabilidad de acierto)
}

export interface MatchResult {
  playerScore: number;
  opponentScore: number;
  winner: 'player' | 'opponent' | 'tie';
}

export interface TournamentState {
  isActive: boolean;
  currentRoundIndex: number; // 0 to 3
  opponents: Opponent[]; // The 15 bots
  bracket: string[][]; // Array of rounds, containing names of winners
  currentMatch: {
    opponent: Opponent;
    playerScore: number;
    opponentScore: number;
    questions: Question[];
    currentQuestionIndex: number;
  } | null;
  history: MatchResult[];
}

export interface QuizState {
  status: 'menu' | 'playing' | 'finished' | 'tournament-hub'; // Added tournament-hub
  selectedCategory: Category | null;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  timeElapsed: number;
  answers: { [key: number]: string };
  tournament: TournamentState; // Added tournament state
}