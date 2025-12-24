import { Opponent } from '../types';

export const tournamentOpponents: Opponent[] = [
  // OCTAVOS (Easy)
  { id: 'bot1', name: 'Intern_Ian', title: 'Becario SQL', avatarColor: 'bg-gray-400', difficulty: 0.3 },
  { id: 'bot2', name: 'DropTableDave', title: 'Desarrollador Junior', avatarColor: 'bg-red-400', difficulty: 0.35 },
  { id: 'bot3', name: 'SelectSarah', title: 'Analista de Datos', avatarColor: 'bg-blue-300', difficulty: 0.4 },
  { id: 'bot4', name: 'NoBackupBob', title: 'SysAdmin Despistado', avatarColor: 'bg-orange-300', difficulty: 0.3 },
  { id: 'bot5', name: 'QueryQuinn', title: 'Estudiante IT', avatarColor: 'bg-teal-300', difficulty: 0.45 },
  { id: 'bot6', name: 'IndexIvan', title: 'DBA Junior', avatarColor: 'bg-indigo-300', difficulty: 0.5 },
  { id: 'bot7', name: 'ViewVictor', title: 'Frontend Dev', avatarColor: 'bg-pink-300', difficulty: 0.35 },
  
  // CUARTOS (Medium)
  { id: 'bot8', name: 'JoinJennifer', title: 'Backend Developer', avatarColor: 'bg-purple-500', difficulty: 0.6 },
  { id: 'bot9', name: 'TriggerTom', title: 'Full Stack Dev', avatarColor: 'bg-yellow-500', difficulty: 0.65 },
  { id: 'bot10', name: 'ProcedurePam', title: 'DB Engineer', avatarColor: 'bg-cyan-500', difficulty: 0.7 },
  { id: 'bot11', name: 'LockLarry', title: 'DevOps Engineer', avatarColor: 'bg-green-500', difficulty: 0.6 },
  
  // SEMIFINAL (Hard)
  { id: 'bot12', name: 'OptimizeOlivia', title: 'Senior DBA', avatarColor: 'bg-rose-600', difficulty: 0.85 },
  { id: 'bot13', name: 'ReplicationRick', title: 'Cloud Architect', avatarColor: 'bg-blue-600', difficulty: 0.8 },
  
  // FINAL BOSS (Expert)
  { id: 'bot14', name: 'RootMaster', title: 'Principal Engineer', avatarColor: 'bg-emerald-600', difficulty: 0.95 },
  
  // Filler for bracket simulation
  { id: 'bot15', name: 'TheSyntax', title: 'AI Overlord', avatarColor: 'bg-slate-800', difficulty: 0.9 }
];