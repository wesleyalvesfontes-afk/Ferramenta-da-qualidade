import React from 'react';
import { AvatarOption } from '../types';
import { 
  Flame, 
  Sparkles, 
  Coins, 
  Mountain, 
  Volume2, 
  VolumeX, 
  Calculator, 
  BookOpen, 
  Trophy,
  Users,
  Share2,
  Radio
} from 'lucide-react';
import { playAudio } from '../utils/audio';

interface HeaderStatsProps {
  avatar: AvatarOption;
  altitude: number;
  streak: number;
  xp: number;
  coins: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCalculator: () => void;
  onOpenFormulas: () => void;
  onOpenAchievements: () => void;
  onChangeAvatar: () => void;
  // Student Name
  studentName?: string;
  onEditStudentName?: () => void;
  // Classroom & Realtime Props
  activeRoomCode?: string;
  userRole?: 'student' | 'teacher' | null;
  participantsCount?: number;
  onOpenClassroom: () => void;
  onOpenTeacherDashboard?: () => void;
  onOpenTeacherScreen?: () => void;
  onOpenLeaderboard?: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  avatar,
  altitude,
  streak,
  xp,
  coins,
  soundEnabled,
  onToggleSound,
  onOpenCalculator,
  onOpenFormulas,
  onOpenAchievements,
  onChangeAvatar,
  studentName,
  onEditStudentName,
  activeRoomCode,
  userRole,
  participantsCount = 0,
  onOpenClassroom,
  onOpenTeacherDashboard,
  onOpenTeacherScreen,
  onOpenLeaderboard,
}) => {
  return (
    <header className="bg-gradient-to-r from-sky-800 via-blue-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-sky-700/40 mb-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Specialist Avatar */}
        <div className="flex items-start gap-3.5">
          <button
            onClick={onChangeAvatar}
            title="Clique para trocar de especialista"
            className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-amber-400/80 flex items-center justify-center text-3xl shadow-inner transition shrink-0 cursor-pointer"
          >
            <span>{avatar.emoji}</span>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[9px] font-bold px-1 rounded uppercase tracking-wider">
              Trocar
            </span>
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Ferramentas da Qualidade Quest</span>
              </h1>

              {activeRoomCode ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 animate-pulse">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>Sala: {activeRoomCode} ({participantsCount} alunos)</span>
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  Escalada da Montanha
                </span>
              )}
            </div>

            {/* Student Name & Specialist Information */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20 text-xs text-white">
                <span className="text-sky-300">Aluno:</span>
                <strong className="text-amber-300">{studentName || 'Aluno Não Cadastrado'}</strong>
                {onEditStudentName && (
                  <button
                    onClick={onEditStudentName}
                    title="Alterar nome do aluno"
                    className="ml-1 text-[10px] text-sky-200 hover:text-white underline cursor-pointer"
                  >
                    (Alterar)
                  </button>
                )}
              </div>
              <span className="text-xs text-sky-200/90 font-medium">
                • Especialista: <strong>{avatar.name}</strong> ({avatar.role})
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Stats Badges & Classroom Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Altitude */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold">
            <Mountain className="w-4 h-4 text-sky-300" />
            <span className="text-slate-300">Altitude:</span>
            <span className="font-mono text-amber-300 font-bold">{altitude}m</span>
          </div>

          {/* Streak */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition ${
            streak > 0 
              ? 'bg-amber-500/20 border-amber-400/40 text-amber-200 shadow-sm' 
              : 'bg-white/10 border-white/15 text-slate-300'
          }`}>
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span>Streak:</span>
            <span className="font-mono font-bold text-white">{streak}</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">XP:</span>
            <span className="font-mono text-emerald-300 font-bold">{xp}</span>
          </div>

          {/* Capital */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Capital:</span>
            <span className="font-mono text-amber-300 font-bold">R$ {coins.toLocaleString('pt-BR')}</span>
          </div>

          {/* Classroom Room Buttons & Dedicated Teacher Screen Switch */}
          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            {onOpenTeacherScreen && (
              <button
                onClick={onOpenTeacherScreen}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border border-indigo-300/40 text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer animate-pulse"
                title="Abrir Tela do Professor para acompanhar os 35 alunos"
              >
                <Users className="w-3.5 h-3.5 text-amber-300" />
                <span>👨‍🏫 Tela do Professor</span>
              </button>
            )}

            {activeRoomCode && onOpenLeaderboard && (
              <button
                onClick={onOpenLeaderboard}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 border border-amber-400/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Ver Placar da Turma"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Placar</span>
              </button>
            )}

            <button
              onClick={onOpenClassroom}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeRoomCode 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-emerald-400/40'
              }`}
              title="Criar sala ou conectar com alunos"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{activeRoomCode ? 'Config Sala' : '🏫 Conectar Sala'}</span>
            </button>

            {/* Sound & Achievements */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition text-white cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={() => { playAudio('click'); onOpenAchievements(); }}
              title="Conquistas Desbloqueadas"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition text-amber-300 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

