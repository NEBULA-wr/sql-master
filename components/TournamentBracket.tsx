import React from 'react';
import { TournamentState } from '../types';

interface Props {
  tournament: TournamentState;
  onStartNextMatch: () => void;
}

const TournamentBracket: React.FC<Props> = ({ tournament, onStartNextMatch }) => {
  const rounds = ["Octavos", "Cuartos", "Semifinal", "FINAL"];
  const currentRoundName = rounds[tournament.currentRoundIndex];
  
  // Determine who the player is facing next based on current round
  // Logic assumes player is always in the top slot of the current bracket subtree
  let nextOpponentName = "???";
  if (tournament.currentRoundIndex === 0) nextOpponentName = tournament.opponents[0].name; // Octavos
  else if (tournament.currentRoundIndex === 1) nextOpponentName = tournament.opponents[7].name; // Cuartos (index logic simplified)
  else if (tournament.currentRoundIndex === 2) nextOpponentName = tournament.opponents[11].name;
  else if (tournament.currentRoundIndex === 3) nextOpponentName = tournament.opponents[13].name;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-down">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 uppercase tracking-tighter">
            Torneo MySQL
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Ronda Actual: <span className="text-yellow-400 font-bold">{currentRoundName}</span>
          </p>
        </div>

        {/* The Bracket Visualization (Simplified for mobile/desktop responsiveness) */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-12 overflow-x-auto pb-4">
          {/* Round 1 Column */}
          <div className="space-y-4 min-w-[100px]">
            <div className="text-center text-xs text-slate-500 uppercase font-bold mb-2">Octavos</div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-12 border border-slate-700 rounded flex items-center px-2 text-xs ${i===0 ? 'bg-blue-600 border-blue-400 font-bold' : 'bg-slate-800 text-slate-500'}`}>
                {i === 0 ? 'TÚ' : (tournament.currentRoundIndex > 0 ? '---' : 'Bot')}
              </div>
            ))}
          </div>
          
          {/* Round 2 Column */}
          <div className="space-y-8 mt-6 min-w-[100px]">
             <div className="text-center text-xs text-slate-500 uppercase font-bold mb-2">Cuartos</div>
             {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-12 border border-slate-700 rounded flex items-center px-2 text-xs ${i===0 && tournament.currentRoundIndex >= 1 ? 'bg-blue-600 border-blue-400 font-bold' : 'bg-slate-800 text-slate-500 opacity-50'}`}>
                {i === 0 && tournament.currentRoundIndex >= 1 ? 'TÚ' : '?'}
              </div>
            ))}
          </div>

          {/* Round 3 Column */}
          <div className="space-y-16 mt-14 min-w-[100px]">
             <div className="text-center text-xs text-slate-500 uppercase font-bold mb-2">Semifinal</div>
             {[...Array(2)].map((_, i) => (
              <div key={i} className={`h-12 border border-slate-700 rounded flex items-center px-2 text-xs ${i===0 && tournament.currentRoundIndex >= 2 ? 'bg-blue-600 border-blue-400 font-bold' : 'bg-slate-800 text-slate-500 opacity-50'}`}>
                {i === 0 && tournament.currentRoundIndex >= 2 ? 'TÚ' : '?'}
              </div>
            ))}
          </div>

           {/* Final Column */}
           <div className="space-y-32 mt-32 min-w-[100px]">
             <div className="text-center text-xs text-slate-500 uppercase font-bold mb-2">FINAL</div>
             <div className={`h-16 border-2 border-yellow-500/50 rounded flex items-center justify-center px-2 font-bold text-sm ${tournament.currentRoundIndex === 3 ? 'bg-yellow-600 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-500'}`}>
                {tournament.currentRoundIndex === 3 ? 'TU vs BOSS' : '🏆'}
             </div>
          </div>
        </div>

        {/* Next Match Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl mx-auto text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          
          <h3 className="text-2xl font-bold text-white mb-6">Próximo Enfrentamiento</h3>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* Player */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl mb-3 shadow-lg shadow-blue-900/50 border-4 border-blue-500">
                👤
              </div>
              <div className="font-bold text-lg">Tú</div>
              <div className="text-xs text-blue-400 font-mono">Nivel: Hero</div>
            </div>

            <div className="text-3xl font-black text-slate-600 italic">VS</div>

            {/* Opponent */}
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 ${tournament.currentMatch?.opponent.avatarColor || 'bg-red-500'} rounded-full flex items-center justify-center text-2xl mb-3 shadow-lg shadow-red-900/50 border-4 border-white/10`}>
                🤖
              </div>
              <div className="font-bold text-lg">{tournament.currentMatch?.opponent.name}</div>
              <div className="text-xs text-slate-400 font-mono">{tournament.currentMatch?.opponent.title}</div>
            </div>
          </div>

          <button 
            onClick={onStartNextMatch}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-xl py-4 rounded-xl shadow-lg shadow-yellow-900/20 transform transition hover:scale-[1.02] active:scale-95 uppercase tracking-wide"
          >
            Jugar Partido
          </button>
        </div>

      </div>
    </div>
  );
};

export default TournamentBracket;