import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Trophy, 
  Mountain, 
  Send, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Maximize2, 
  AlertTriangle, 
  Sparkles, 
  Radio, 
  Flame, 
  Coins, 
  CheckCircle2, 
  X, 
  Eye, 
  GraduationCap, 
  TrendingUp, 
  HelpCircle,
  Clock,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { RoomState, Participant } from '../types';
import { MOUNTAIN_CAMPS, QUESTIONS } from '../data/questions';
import { playAudio } from '../utils/audio';

// 35 Realistic Sample Students for SENAI Classroom Demonstration / Testing
const MOCK_35_STUDENTS: Participant[] = [
  { id: 'mock_1', name: 'Ana Beatriz Lima', role: 'student', avatarId: 'eng-qualidade', avatarEmoji: '👩‍🔬', currentLevel: 9, altitude: 3000, xp: 180, coins: 1800, streak: 8, maxStreak: 9, firstTryCount: 9, isClimbing: false, avatarState: 'celebrating', completedAt: Date.now() - 120000, lastActive: Date.now(), isOnline: true },
  { id: 'mock_2', name: 'Bruno Costa e Silva', role: 'student', avatarId: 'gestor-pareto', avatarEmoji: '💼', currentLevel: 9, altitude: 3000, xp: 170, coins: 1750, streak: 6, maxStreak: 8, firstTryCount: 8, isClimbing: false, avatarState: 'celebrating', completedAt: Date.now() - 60000, lastActive: Date.now(), isOnline: true },
  { id: 'mock_3', name: 'Camila Rodrigues Rocha', role: 'student', avatarId: 'analista-ishikawa', avatarEmoji: '👩‍🏫', currentLevel: 8, altitude: 2660, xp: 155, coins: 1600, streak: 5, maxStreak: 7, firstTryCount: 7, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_4', name: 'Daniel Alves Pereira', role: 'student', avatarId: 'auditor-5s', avatarEmoji: '👨‍🏭', currentLevel: 8, altitude: 2660, xp: 140, coins: 1450, streak: 4, maxStreak: 6, firstTryCount: 6, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_5', name: 'Eduarda Martins Souza', role: 'student', avatarId: 'eng-qualidade', avatarEmoji: '👩‍🔬', currentLevel: 7, altitude: 2330, xp: 135, coins: 1400, streak: 3, maxStreak: 6, firstTryCount: 6, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_6', name: 'Felipe Augusto Santos', role: 'student', avatarId: 'gestor-pareto', avatarEmoji: '💼', currentLevel: 7, altitude: 2330, xp: 125, coins: 1300, streak: 2, maxStreak: 5, firstTryCount: 5, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_7', name: 'Gabriela Vasconcelos', role: 'student', avatarId: 'analista-ishikawa', avatarEmoji: '👩‍🏫', currentLevel: 6, altitude: 2000, xp: 120, coins: 1250, streak: 4, maxStreak: 6, firstTryCount: 5, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_8', name: 'Henrique Cardoso Dias', role: 'student', avatarId: 'auditor-5s', avatarEmoji: '👨‍🏭', currentLevel: 6, altitude: 2000, xp: 110, coins: 1150, streak: 1, maxStreak: 4, firstTryCount: 4, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_9', name: 'Isabela Fontes Prado', role: 'student', avatarId: 'eng-qualidade', avatarEmoji: '👩‍🔬', currentLevel: 6, altitude: 2000, xp: 105, coins: 1100, streak: 3, maxStreak: 5, firstTryCount: 4, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_10', name: 'João Pedro de Oliveira', role: 'student', avatarId: 'gestor-pareto', avatarEmoji: '💼', currentLevel: 5, altitude: 1660, xp: 100, coins: 1050, streak: 2, maxStreak: 4, firstTryCount: 4, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_11', name: 'Kauã Ribeiro Moura', role: 'student', avatarId: 'auditor-5s', avatarEmoji: '👨‍🏭', currentLevel: 5, altitude: 1660, xp: 95, coins: 950, streak: 0, maxStreak: 3, firstTryCount: 3, isClimbing: false, avatarState: 'thinking', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_12', name: 'Larissa Carvalho Ramos', role: 'student', avatarId: 'analista-ishikawa', avatarEmoji: '👩‍🏫', currentLevel: 5, altitude: 1660, xp: 90, coins: 900, streak: 3, maxStreak: 4, firstTryCount: 3, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_13', name: 'Matheus Henrique Silva', role: 'student', avatarId: 'auditor-5s', avatarEmoji: '👨‍🏭', currentLevel: 4, altitude: 1330, xp: 85, coins: 850, streak: 1, maxStreak: 3, firstTryCount: 3, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_14', name: 'Natália Pinheiro Gomes', role: 'student', avatarId: 'eng-qualidade', avatarEmoji: '👩‍🔬', currentLevel: 4, altitude: 1330, xp: 80, coins: 800, streak: 2, maxStreak: 3, firstTryCount: 3, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_15', name: 'Otávio Mendonça Filho', role: 'student', avatarId: 'gestor-pareto', avatarEmoji: '💼', currentLevel: 4, altitude: 1330, xp: 75, coins: 750, streak: 0, maxStreak: 2, firstTryCount: 2, isClimbing: false, avatarState: 'thinking', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_16', name: 'Paula Esteves Barreto', role: 'student', avatarId: 'analista-ishikawa', avatarEmoji: '👩‍🏫', currentLevel: 4, altitude: 1330, xp: 70, coins: 700, streak: 1, maxStreak: 2, firstTryCount: 2, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_17', name: 'Rafael Guimarães Nery', role: 'student', avatarId: 'auditor-5s', avatarEmoji: '👨‍🏭', currentLevel: 3, altitude: 1000, xp: 65, coins: 650, streak: 2, maxStreak: 3, firstTryCount: 2, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_18', name: 'Sabrina Correia Teles', role: 'student', avatarId: 'eng-qualidade', avatarEmoji: '👩‍🔬', currentLevel: 3, altitude: 1000, xp: 60, coins: 600, streak: 0, maxStreak: 2, firstTryCount: 2, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_19', name: 'Thiago Farias Toledo', role: 'student', avatarId: 'gestor-pareto', avatarEmoji: '💼', currentLevel: 3, altitude: 1000, xp: 55, coins: 550, streak: 1, maxStreak: 2, firstTryCount: 2, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_20', name: 'Vanessa Pires Moreira', role: 'student', avatarId: 'analista-ishikawa', avatarEmoji: '👩‍🏫', currentLevel: 3, altitude: 1000, xp: 50, coins: 500, streak: 0, maxStreak: 2, firstTryCount: 1, isClimbing: false, avatarState: 'thinking', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_21', name: 'Victor Hugo Santana', role: 'student', avatarId: 'auditor-5s', avatarEmoji: '👨‍🏭', currentLevel: 2, altitude: 660, xp: 45, coins: 450, streak: 2, maxStreak: 2, firstTryCount: 2, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_22', name: 'Yasmin Duarte Campos', role: 'student', avatarId: 'eng-qualidade', avatarEmoji: '👩‍🔬', currentLevel: 2, altitude: 660, xp: 40, coins: 400, streak: 1, maxStreak: 2, firstTryCount: 1, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_23', name: 'Alexandre Magno Leite', role: 'student', avatarId: 'gestor-pareto', avatarEmoji: '💼', currentLevel: 2, altitude: 660, xp: 35, coins: 350, streak: 0, maxStreak: 1, firstTryCount: 1, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_24', name: 'Bárbara Cristina Viana', role: 'student', avatarId: 'analista-ishikawa', avatarEmoji: '👩‍🏫', currentLevel: 2, altitude: 660, xp: 30, coins: 300, streak: 1, maxStreak: 1, firstTryCount: 1, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_25', name: 'Caio Vinícius Barbosa', role: 'student', avatarId: 'auditor-5s', avatarEmoji: '👨‍🏭', currentLevel: 2, altitude: 660, xp: 25, coins: 250, streak: 0, maxStreak: 1, firstTryCount: 1, isClimbing: false, avatarState: 'thinking', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_26', name: 'Débora Regina Frota', role: 'student', avatarId: 'eng-qualidade', avatarEmoji: '👩‍🔬', currentLevel: 1, altitude: 330, xp: 20, coins: 200, streak: 1, maxStreak: 1, firstTryCount: 1, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_27', name: 'Erick Leonardo Siqueira', role: 'student', avatarId: 'gestor-pareto', avatarEmoji: '💼', currentLevel: 1, altitude: 330, xp: 15, coins: 150, streak: 0, maxStreak: 1, firstTryCount: 1, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_28', name: 'Fernanda Albuquerque', role: 'student', avatarId: 'analista-ishikawa', avatarEmoji: '👩‍🏫', currentLevel: 1, altitude: 330, xp: 15, coins: 150, streak: 1, maxStreak: 1, firstTryCount: 1, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_29', name: 'Guilherme Augusto Paz', role: 'student', avatarId: 'auditor-5s', avatarEmoji: '👨‍🏭', currentLevel: 1, altitude: 330, xp: 10, coins: 100, streak: 0, maxStreak: 1, firstTryCount: 1, isClimbing: false, avatarState: 'thinking', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_30', name: 'Helena Beatriz Xavier', role: 'student', avatarId: 'eng-qualidade', avatarEmoji: '👩‍🔬', currentLevel: 1, altitude: 330, xp: 10, coins: 100, streak: 1, maxStreak: 1, firstTryCount: 1, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_31', name: 'Igor Ferreira Brandão', role: 'student', avatarId: 'gestor-pareto', avatarEmoji: '💼', currentLevel: 0, altitude: 0, xp: 5, coins: 50, streak: 0, maxStreak: 0, firstTryCount: 0, isClimbing: false, avatarState: 'thinking', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_32', name: 'Jéssica Lemos Tavares', role: 'student', avatarId: 'analista-ishikawa', avatarEmoji: '👩‍🏫', currentLevel: 0, altitude: 0, xp: 0, coins: 0, streak: 0, maxStreak: 0, firstTryCount: 0, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_33', name: 'Lucas Gabriel Silveira', role: 'student', avatarId: 'auditor-5s', avatarEmoji: '👨‍🏭', currentLevel: 0, altitude: 0, xp: 0, coins: 0, streak: 0, maxStreak: 0, firstTryCount: 0, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
  { id: 'mock_34', name: 'Mariana Duarte Souza', role: 'student', avatarId: 'eng-qualidade', avatarEmoji: '👩‍🔬', currentLevel: 0, altitude: 0, xp: 0, coins: 0, streak: 0, maxStreak: 0, firstTryCount: 0, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: false },
  { id: 'mock_35', name: 'Nicolas Yuri Machado', role: 'student', avatarId: 'gestor-pareto', avatarEmoji: '💼', currentLevel: 0, altitude: 0, xp: 0, coins: 0, streak: 0, maxStreak: 0, firstTryCount: 0, isClimbing: false, avatarState: 'idle', completedAt: null, lastActive: Date.now(), isOnline: true },
];

interface TeacherScreenProps {
  room: RoomState | null;
  onSendAnnouncement: (message: string) => void;
  onResetRace: () => void;
  onOpenPresentationMode: () => void;
  onSwitchToStudentView: () => void;
}

export const TeacherScreen: React.FC<TeacherScreenProps> = ({
  room,
  onSendAnnouncement,
  onResetRace,
  onOpenPresentationMode,
  onSwitchToStudentView,
}) => {
  const [viewFormat, setViewFormat] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'summit' | 'climbing' | 'struggling' | 'online'>('all');
  const [sortBy, setSortBy] = useState<'level_desc' | 'level_asc' | 'name_asc' | 'xp_desc'>('level_desc');
  const [useSimulatedClass, setUseSimulatedClass] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Participant | null>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const roomCode = room?.code || 'QUALIDADE-SENAI';
  const shareableStudentLink = `${currentUrl}?sala=${roomCode}`;

  // Base list of participants
  const rawParticipants: Participant[] = useMemo(() => {
    if (useSimulatedClass) {
      return MOCK_35_STUDENTS;
    }
    if (!room) {
      return MOCK_35_STUDENTS; // Default to demo if no room yet so teacher sees interface immediately
    }
    const realStudents = (Object.values(room.participants) as Participant[]).filter(p => p.role === 'student');
    return realStudents.length > 0 ? realStudents : MOCK_35_STUDENTS;
  }, [useSimulatedClass, room]);

  // Derived statistics
  const totalCount = rawParticipants.length;
  const onlineCount = rawParticipants.filter(p => p.isOnline).length;
  const summitCount = rawParticipants.filter(p => p.currentLevel >= QUESTIONS.length).length;
  const averageAltitude = totalCount > 0 
    ? Math.round(rawParticipants.reduce((acc, p) => acc + (p.altitude || 0), 0) / totalCount)
    : 0;

  // Identify struggling students (level < 3 or avatarState === 'thinking')
  const strugglingCount = rawParticipants.filter(p => p.currentLevel < 3 || p.avatarState === 'thinking').length;

  // Filtered & Sorted participants
  const processedParticipants = useMemo(() => {
    let list = [...rawParticipants];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    // Category filter
    if (filterType === 'summit') {
      list = list.filter(p => p.currentLevel >= QUESTIONS.length);
    } else if (filterType === 'climbing') {
      list = list.filter(p => p.currentLevel > 0 && p.currentLevel < QUESTIONS.length);
    } else if (filterType === 'struggling') {
      list = list.filter(p => p.currentLevel < 3 || p.avatarState === 'thinking');
    } else if (filterType === 'online') {
      list = list.filter(p => p.isOnline);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'level_desc') {
        if (b.currentLevel !== a.currentLevel) return b.currentLevel - a.currentLevel;
        if (b.xp !== a.xp) return b.xp - a.xp;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'level_asc') {
        if (a.currentLevel !== b.currentLevel) return a.currentLevel - b.currentLevel;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'xp_desc') {
        return b.xp - a.xp;
      }
      return 0;
    });

    return list;
  }, [rawParticipants, searchQuery, filterType, sortBy]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableStudentLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    playAudio('powerup');
    onSendAnnouncement(announcementText.trim());
    setAnnouncementText('');
  };

  // Export full gradebook to CSV
  const handleExportCSV = () => {
    const headers = ['Posição', 'Nome do Aluno', 'Avatar', `Nível Conquistado (0-${QUESTIONS.length})`, 'Altitude (m)', 'Pontos XP', 'Pontuação Acumulada', 'Maior Combo', 'Acertos 1ª Tentativa', 'Chegou ao Cume?', 'Conclusão'];
    const rows = rawParticipants
      .sort((a, b) => b.currentLevel - a.currentLevel || b.xp - a.xp)
      .map((p, idx) => [
        idx + 1,
        `"${p.name.replace(/"/g, '""')}"`,
        p.avatarEmoji,
        p.currentLevel,
        p.altitude,
        p.xp,
        p.coins,
        p.maxStreak,
        p.firstTryCount,
        p.currentLevel >= QUESTIONS.length ? 'SIM' : 'NÃO',
        p.completedAt ? new Date(p.completedAt).toLocaleTimeString('pt-BR') : '-'
      ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SENAI_Qualidade_Escalada_Turma_${roomCode}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Top Banner Navigation & Connection Controls */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Master Control Bar */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 p-4 sm:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>MONITORAMENTO EM TEMPO REAL</span>
              </span>
              <span className="text-xs text-slate-400">
                {room?.title || 'Turma SENAI - Ferramentas da Qualidade'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>👨‍🏫 Painel da Turma: 35 Alunos</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Professor: <strong>{room?.teacherName || 'Prof. Miquéias'}</strong> • Acompanhamento síncrono da escalada dos 10 acampamentos (5S, Carta de Controle e Ishikawa)
            </p>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* View Mode Switcher to Student */}
            <button
              onClick={onSwitchToStudentView}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-600 cursor-pointer"
              title="Alternar para a visão de resolução de questões do Aluno"
            >
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <span>Visão do Aluno</span>
            </button>

            {/* Datashow Projector */}
            <button
              onClick={onOpenPresentationMode}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 border border-indigo-400/40 shadow-sm cursor-pointer"
              title="Abrir Projeção em Telão / Datashow com a montanha e os 35 alunos"
            >
              <Maximize2 className="w-4 h-4 text-amber-300" />
              <span>Modo Telão Datashow</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 border border-emerald-400/40 shadow-sm cursor-pointer"
              title="Baixar planilha formatada com a evolução dos 35 alunos"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel/CSV</span>
            </button>

            {/* Reset Race */}
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja reiniciar o desafio da montanha para todos os alunos da turma?')) {
                  onResetRace();
                }
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Reiniciar escalada da turma"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Rodada</span>
            </button>
          </div>
        </div>

        {/* Room PIN, Direct Link & Simulation Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PIN Card */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                PIN de Entrada da Turma
              </span>
              <span className="text-2xl font-black font-mono tracking-widest text-amber-400">
                {roomCode}
              </span>
            </div>
            <button
              onClick={handleCopyPin}
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-600 cursor-pointer"
            >
              {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPin ? 'Copiado!' : 'Copiar PIN'}</span>
            </button>
          </div>

          {/* Shareable Link Card */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Link Direto para os Alunos
              </span>
              <span className="text-xs font-mono text-sky-300 truncate block">
                {shareableStudentLink}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>

          {/* Test / Simulation Switcher */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Simulação de Teste
              </span>
              <span className="text-xs text-slate-300">
                {useSimulatedClass ? 'Demonstração com 35 alunos ativa' : 'Aguardando alunos reais entrarem'}
              </span>
            </div>
            <button
              onClick={() => {
                setUseSimulatedClass(!useSimulatedClass);
                playAudio('click');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                useSimulatedClass 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30' 
                  : 'bg-indigo-600/30 text-indigo-200 border-indigo-500/40 hover:bg-indigo-600/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{useSimulatedClass ? 'Alunos Reais' : 'Simular 35 Alunos'}</span>
            </button>
          </div>
        </div>

        {/* Global Class Stats KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Students */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-4 shadow-lg flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Turma Cadastrada</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{totalCount}</span>
                <span className="text-xs text-emerald-400 font-bold">({onlineCount} online)</span>
              </div>
            </div>
          </div>

          {/* Average Altitude */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-4 shadow-lg flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Média da Turma</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-amber-300 font-mono">{averageAltitude}m</span>
                <span className="text-xs text-slate-400">/ 3.000m</span>
              </div>
            </div>
          </div>

          {/* Summit Conquerors */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-4 shadow-lg flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Chegaram ao Cume</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-300">{summitCount}</span>
                <span className="text-xs text-slate-400">alunos (100%)</span>
              </div>
            </div>
          </div>

          {/* Struggling / Needs Attention */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-4 shadow-lg flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Requerem Atenção</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-300">{strugglingCount}</span>
                <span className="text-xs text-rose-400 font-semibold">auxílio na base</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Broadcast Announcement Box */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-800 to-indigo-950 rounded-2xl border border-indigo-700/50 p-4 sm:p-5 shadow-xl">
          <form onSubmit={handleSendAnnouncement} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold shrink-0">
              <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Transmissão Imediata para os 35 Alunos:</span>
            </div>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Ex: Atenção turma! Avaliem se a medição ultrapassa os limites de controle LSC/LIC ou indica tendência!"
              className="flex-1 w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-hidden focus:border-indigo-400"
            />
            <button
              type="submit"
              disabled={!announcementText.trim()}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmitir Aviso</span>
            </button>
          </form>
        </div>

        {/* Mountain Distribution Map Progress (Zones Summary) */}
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-5 h-5 text-sky-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Distribuição dos 35 Alunos nos {MOUNTAIN_CAMPS.length} Acampamentos da Montanha
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              5S (0-1000m) • Carta de Controle (1330-2000m) • Ishikawa (2330-3000m)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5 pt-2">
            {MOUNTAIN_CAMPS.map((camp) => {
              const studentsInCamp = rawParticipants.filter(p => p.currentLevel === camp.level);
              const count = studentsInCamp.length;
              return (
                <div 
                  key={camp.level}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-between min-h-[72px] ${
                    camp.level === MOUNTAIN_CAMPS.length - 1
                      ? 'bg-amber-950/40 border-amber-500/50'
                      : count > 0
                      ? 'bg-slate-700/80 border-sky-500/40'
                      : 'bg-slate-800/50 border-slate-700 opacity-60'
                  }`}
                  title={`${camp.name} (${camp.altitude}m): ${count} alunos`}
                >
                  <span className="text-[10px] font-bold text-slate-400">
                    {camp.level === MOUNTAIN_CAMPS.length - 1 ? '🏆 CUME' : `Nív ${camp.level}`}
                  </span>
                  <span className={`text-base font-black ${
                    count > 0 ? (camp.level === MOUNTAIN_CAMPS.length - 1 ? 'text-amber-400' : 'text-sky-300') : 'text-slate-500'
                  }`}>
                    {count}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {camp.altitude}m
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Monitor Controls (Search, Filters, Sort, View Toggle) */}
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar aluno por nome (ex: Ana, Bruno, Lucas...)"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-hidden focus:border-sky-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                filterType === 'all' ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Todos ({rawParticipants.length})
            </button>
            <button
              onClick={() => setFilterType('summit')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                filterType === 'summit' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              🏆 No Cume ({summitCount})
            </button>
            <button
              onClick={() => setFilterType('climbing')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                filterType === 'climbing' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              🧗 Escalando ({rawParticipants.filter(p => p.currentLevel > 0 && p.currentLevel < QUESTIONS.length).length})
            </button>
            <button
              onClick={() => setFilterType('struggling')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                filterType === 'struggling' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ⚠️ Atenção ({strugglingCount})
            </button>
          </div>

          {/* View Format Toggle (Grid vs Table) */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 shrink-0">
            <button
              onClick={() => setViewFormat('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewFormat === 'grid' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grade (35)
            </button>
            <button
              onClick={() => setViewFormat('table')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewFormat === 'table' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tabela
            </button>
          </div>
        </div>

        {/* 35 Students Display: Grid Mode */}
        {viewFormat === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {processedParticipants.map((student, idx) => {
              const camp = MOUNTAIN_CAMPS[student.currentLevel] || MOUNTAIN_CAMPS[0];
              const isFinished = student.currentLevel >= QUESTIONS.length;
              const isStruggling = student.currentLevel < 3 || student.avatarState === 'thinking';

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`bg-slate-800/90 rounded-2xl border p-4 shadow-lg transition-all duration-200 hover:border-sky-500 hover:shadow-sky-500/10 cursor-pointer flex flex-col justify-between ${
                    isFinished 
                      ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/20 to-slate-800' 
                      : isStruggling 
                      ? 'border-rose-500/30' 
                      : 'border-slate-700'
                  }`}
                >
                  {/* Top row: Avatar + Name + Online Dot */}
                  <div>
                    <div className="flex items-start justify-between gap-2.5 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative">
                          <span className="w-10 h-10 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-xl shrink-0">
                            {student.avatarEmoji}
                          </span>
                          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${
                            student.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                            <h3 className="text-sm font-bold text-white truncate" title={student.name}>
                              {student.name}
                            </h3>
                          </div>
                          <span className="text-[11px] text-sky-300 font-mono font-semibold block">
                            {student.altitude}m de altitude
                          </span>
                        </div>
                      </div>

                      {isFinished ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black shrink-0">
                          🏆 CUME
                        </span>
                      ) : isStruggling ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[9px] font-bold shrink-0">
                          ⚠️ Atenção
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold shrink-0 font-mono">
                          Nív {student.currentLevel}/{QUESTIONS.length}
                        </span>
                      )}
                    </div>

                    {/* Camp Title */}
                    <p className="text-xs text-slate-300 font-medium mb-3 line-clamp-1">
                      📍 {camp.name}
                    </p>

                    {/* Micro Progress Bar */}
                    <div className="mb-3.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Progresso na Montanha</span>
                        <span className="font-bold text-white">{Math.round((student.currentLevel / QUESTIONS.length) * 100)}%</span>
                      </div>
                      <div className="grid grid-cols-9 gap-0.5 h-2 bg-slate-900 rounded-full p-0.5 border border-slate-700 overflow-hidden">
                        {Array.from({ length: QUESTIONS.length }).map((_, stepIdx) => {
                          const isDone = stepIdx < student.currentLevel;
                          const isCurrent = stepIdx === student.currentLevel;
                          return (
                            <div
                              key={stepIdx}
                              className={`h-full rounded-xs transition-all ${
                                isDone 
                                  ? 'bg-emerald-500' 
                                  : isCurrent 
                                  ? 'bg-amber-400 animate-pulse' 
                                  : 'bg-slate-800'
                              }`}
                              title={`Acampamento ${stepIdx + 1}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats Footer */}
                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-mono text-emerald-400 font-bold">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        {student.xp} XP
                      </span>
                      <span className="flex items-center gap-1 font-mono text-amber-400 font-semibold">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {student.maxStreak}x
                      </span>
                    </div>

                    <button 
                      className="text-sky-400 hover:text-sky-300 font-bold text-[11px] flex items-center gap-0.5"
                    >
                      <span>Detalhes</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 35 Students Display: Table Mode (Diário de Classe) */
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 text-slate-400 font-bold text-[11px] uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Posição</th>
                    <th className="py-3.5 px-4">Nome do Aluno</th>
                    <th className="py-3.5 px-4">Acampamento Atual</th>
                    <th className="py-3.5 px-4">Altitude</th>
                    <th className="py-3.5 px-4">Progresso ({QUESTIONS.length} Níveis)</th>
                    <th className="py-3.5 px-4">Pontuação</th>
                    <th className="py-3.5 px-4">Combo</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-200">
                  {processedParticipants.map((student, idx) => {
                    const camp = MOUNTAIN_CAMPS[student.currentLevel] || MOUNTAIN_CAMPS[0];
                    const isFinished = student.currentLevel >= QUESTIONS.length;

                    return (
                      <tr 
                        key={student.id} 
                        className="hover:bg-slate-700/40 transition cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl shrink-0">{student.avatarEmoji}</span>
                            <span className="font-bold text-white">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {camp.name}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-300">
                          {student.altitude}m
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                              <div 
                                className="h-full bg-emerald-500 rounded-full" 
                                style={{ width: `${(student.currentLevel / QUESTIONS.length) * 100}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-300">
                              {student.currentLevel}/{QUESTIONS.length}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                          {student.xp} XP
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-400 font-bold">
                          {student.maxStreak}x
                        </td>
                        <td className="py-3 px-4">
                          {isFinished ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-black">
                              🏆 Cume
                            </span>
                          ) : student.isOnline ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-[11px] font-bold">
                              🟢 Online
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-[11px]">
                              Offline
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-sky-400 font-bold text-xs"
                          >
                            Ver Ficha
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected Student Details Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-800 w-full max-w-md rounded-2xl border border-slate-700 overflow-hidden shadow-2xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 rounded-xl bg-slate-700 border border-slate-600">
                      {selectedStudent.avatarEmoji}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedStudent.name}
                      </h3>
                      <p className="text-xs text-sky-300 font-medium">
                        Alpinista Farmacêutico SENAI
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/80 space-y-1.5">
                    <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">
                      Desafio Atual
                    </span>
                    <p className="text-sm font-bold text-white">
                      {selectedStudent.currentLevel < QUESTIONS.length 
                        ? QUESTIONS[selectedStudent.currentLevel]?.title || 'Concluído' 
                        : '🎉 Escalada Concluída! Cume alcançado!'}
                    </p>
                    <p className="text-slate-300 font-mono">
                      Regra / Foco: {QUESTIONS[selectedStudent.currentLevel]?.formula || 'Cume 3.000m'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700/80">
                      <span className="text-slate-400 block">Altitude</span>
                      <span className="text-base font-bold text-amber-300 font-mono">
                        {selectedStudent.altitude}m
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700/80">
                      <span className="text-slate-400 block">Nível</span>
                      <span className="text-base font-bold text-sky-300 font-mono">
                        {selectedStudent.currentLevel} / {QUESTIONS.length}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700/80">
                      <span className="text-slate-400 block">Pontos XP</span>
                      <span className="text-base font-bold text-emerald-400 font-mono">
                        {selectedStudent.xp} XP
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700/80">
                      <span className="text-slate-400 block">Maior Combo</span>
                      <span className="text-base font-bold text-amber-400 font-mono">
                        {selectedStudent.maxStreak}x
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const incentive = prompt(`Enviar mensagem de incentivo para ${selectedStudent.name}:`, `Muito bem, ${selectedStudent.name}! Continue com foco na aplicação das Ferramentas da Qualidade!`);
                    if (incentive) {
                      onSendAnnouncement(`Para ${selectedStudent.name}: ${incentive}`);
                    }
                    setSelectedStudent(null);
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Incentivo ao Aluno</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
