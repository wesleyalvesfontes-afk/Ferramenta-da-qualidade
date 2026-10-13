import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AVATARS } from './data/avatars';
import { QUESTIONS, MOUNTAIN_CAMPS } from './data/questions';
import { AvatarOption, Achievement, MountainCamp, RoomState, Participant } from './types';
import { HeaderStats } from './components/HeaderStats';
import { MountainCanvas } from './components/MountainCanvas';
import { QuestionCard } from './components/QuestionCard';
import { FinanceCalculatorModal } from './components/FinanceCalculatorModal';
import { FormulaModal } from './components/FormulaModal';
import { AchievementsDrawer } from './components/AchievementsDrawer';
import { AvatarSelectorModal } from './components/AvatarSelectorModal';
import { CompletionScreen } from './components/CompletionScreen';
import { ClassroomModal } from './components/ClassroomModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { ClassroomLeaderboardDrawer } from './components/ClassroomLeaderboardDrawer';
import { StudentRegistrationModal } from './components/StudentRegistrationModal';
import { TeacherScreen } from './components/TeacherScreen';
import { realtimeManager } from './utils/realtime';
import { isSoundEnabled, toggleSound, playAudio } from './utils/audio';
import { Megaphone, X, Trophy, Users, Monitor, Maximize, GraduationCap } from 'lucide-react';

export default function App() {
  // Student Name State
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('pfq_student_name') || '';
  });
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(() => {
    return !localStorage.getItem('pfq_student_name');
  });
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');

  // Avatar state
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(AVATARS[0]);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  // Progression & Mountain Climb state
  // currentLevel represents the camp level (0 = base camp, 1 = after Q1, ..., 12 = summit)
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [isClimbing, setIsClimbing] = useState<boolean>(false);
  const [avatarState, setAvatarState] = useState<'idle' | 'climbing' | 'celebrating' | 'thinking'>('idle');

  // Stats
  const [xp, setXp] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [firstTryCount, setFirstTryCount] = useState<number>(0);
  const [hasFailedCurrentQuestion, setHasFailedCurrentQuestion] = useState<boolean>(false);

  // Powerups & Modals
  const [availableFiftyFifty, setAvailableFiftyFifty] = useState<number>(2);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isFormulasOpen, setIsFormulasOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(true);

  // Real-time Classroom & Multi-user State
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [participantId, setParticipantId] = useState<string>('');
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState<boolean>(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [initialRoomCode, setInitialRoomCode] = useState<string>('');
  const [announcementToast, setAnnouncementToast] = useState<{ message: string; timestamp: number } | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // Check URL query parameters for ?sala=CODE or ?room=CODE
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const codeFromUrl = searchParams.get('sala') || searchParams.get('room');
      if (codeFromUrl) {
        const cleaned = codeFromUrl.trim().toUpperCase();
        setInitialRoomCode(cleaned);
        setIsClassroomModalOpen(true);
      }
    } catch {
      // Ignore if URL parsing is restricted in iframe
    }
  }, []);

  // Subscribe to real-time events
  useEffect(() => {
    const unsubRoom = realtimeManager.onRoomUpdate((updatedRoom) => {
      setRoomState(updatedRoom);
    });

    const unsubAnnouncement = realtimeManager.onAnnouncement((msg) => {
      playAudio('powerup');
      setAnnouncementToast({ message: msg, timestamp: Date.now() });
      setTimeout(() => {
        setAnnouncementToast((prev) => (prev?.message === msg ? null : prev));
      }, 9000);
    });

    return () => {
      unsubRoom();
      unsubAnnouncement();
    };
  }, []);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-step',
      title: 'Primeira Ascensão',
      description: 'Acertou o primeiro desafio e começou a subir a montanha.',
      icon: '🥾',
      unlocked: false
    },
    {
      id: 'streak-3',
      title: 'Em Chamas! (Combo 3x)',
      description: 'Acertou 3 desafios seguidos sem errar na escalada.',
      icon: '🔥',
      unlocked: false
    },
    {
      id: 'fifty-fifty',
      title: 'Visão Estratégica',
      description: 'Usou o recurso 50/50 para eliminar alternativas.',
      icon: '💡',
      unlocked: false
    },
    {
      id: '5s-master',
      title: 'Mestre dos 5S',
      description: 'Dominou os sensos de utilização, ordenação, limpeza, padronização e autodisciplina.',
      icon: '📋',
      unlocked: false
    },
    {
      id: 'control-chart-master',
      title: 'Especialista em Cartas de Controle',
      description: 'Dominou os limites estatísticos (LSC/LIC), estabilidade e identificação de tendências.',
      icon: '📈',
      unlocked: false
    },
    {
      id: 'ishikawa-master',
      title: 'Detetive de Ishikawa',
      description: 'Superou as espinhas dos 6M e dominou a busca pela causa raiz com os 5 Porquês.',
      icon: '🐟',
      unlocked: false
    },
    {
      id: 'summit-conqueror',
      title: 'Cume da Qualidade Total (3000m)',
      description: 'Alcançou o topo absoluto dominando todas as Ferramentas da Qualidade.',
      icon: '🏆',
      unlocked: false
    }
  ]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(ach => {
        if (ach.id === id && !ach.unlocked) {
          playAudio('powerup');
          return { ...ach, unlocked: true };
        }
        return ach;
      })
    );
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundActive(newState);
  };

  // Current active question
  const currentQuestion = QUESTIONS[currentLevel];
  const isExpeditionComplete = currentLevel >= QUESTIONS.length;
  const currentAltitude = MOUNTAIN_CAMPS[currentLevel]?.altitude || 0;

  // Called when user selects the correct answer on QuestionCard
  const handleAnswerCorrect = (gainedXp: number, gainedCoins: number) => {
    setAvatarState('celebrating');

    // Confetti burst for correct answer
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > maxStreak) {
      setMaxStreak(newStreak);
    }

    const updatedFirstTry = !hasFailedCurrentQuestion ? firstTryCount + 1 : firstTryCount;
    if (!hasFailedCurrentQuestion) {
      setFirstTryCount(updatedFirstTry);
    }

    const updatedXp = xp + gainedXp;
    const updatedCoins = coins + gainedCoins;
    setXp(updatedXp);
    setCoins(updatedCoins);

    // Sync live progress to the teacher and peers in the room
    if (roomState && userRole === 'student') {
      realtimeManager.updateProgress({
        currentLevel,
        altitude: currentAltitude,
        xp: updatedXp,
        coins: updatedCoins,
        streak: newStreak,
        maxStreak: Math.max(maxStreak, newStreak),
        firstTryCount: updatedFirstTry,
        avatarState: 'celebrating',
        isClimbing: false
      });
    }

    // Achievements checks
    if (currentLevel === 0) unlockAchievement('first-step');
    if (newStreak >= 3) unlockAchievement('streak-3');
    if (currentLevel >= 2) unlockAchievement('5s-master');
    if (currentLevel >= 5) unlockAchievement('control-chart-master');
    if (currentLevel >= 8) unlockAchievement('ishikawa-master');
  };

  // Called when user selects an incorrect option
  // Strict rule: MUST NOT ASCEND LEVEL!
  const handleAnswerIncorrect = () => {
    setAvatarState('thinking');
    setStreak(0);
    setHasFailedCurrentQuestion(true);

    if (roomState && userRole === 'student') {
      realtimeManager.updateProgress({
        streak: 0,
        avatarState: 'thinking'
      });
    }
  };

  // Called ONLY when the user clicks "Subir de Nível" after answering correctly!
  const handleClimbToNextLevel = () => {
    setIsClimbing(true);
    setAvatarState('climbing');
    playAudio('climb');

    // Reset failure flag for the next challenge
    setHasFailedCurrentQuestion(false);

    const nextLvl = currentLevel + 1;
    const nextAlt = MOUNTAIN_CAMPS[nextLvl]?.altitude || 3000;

    // Notify peers that climb is happening
    if (roomState && userRole === 'student') {
      realtimeManager.updateProgress({
        avatarState: 'climbing',
        isClimbing: true
      });
    }

    // Climb animation duration
    setTimeout(() => {
      setCurrentLevel(nextLvl);
      setIsClimbing(false);
      setAvatarState('idle');

      if (nextLvl >= QUESTIONS.length) {
        unlockAchievement('summit-conqueror');
      }

      // Sync reached camp level
      if (roomState && userRole === 'student') {
        realtimeManager.updateProgress({
          currentLevel: nextLvl,
          altitude: nextAlt,
          avatarState: 'idle',
          isClimbing: false
        });
      }
    }, 1300);
  };

  const handleUseFiftyFifty = () => {
    setAvailableFiftyFifty(prev => Math.max(0, prev - 1));
    unlockAchievement('fifty-fifty');
  };

  const handleRestart = () => {
    playAudio('step');
    setCurrentLevel(0);
    setXp(0);
    setCoins(0);
    setStreak(0);
    setMaxStreak(0);
    setFirstTryCount(0);
    setAvailableFiftyFifty(2);
    setAvatarState('idle');
    setHasFailedCurrentQuestion(false);

    if (roomState && userRole === 'student') {
      realtimeManager.updateProgress({
        currentLevel: 0,
        altitude: 0,
        xp: 0,
        coins: 0,
        streak: 0,
        maxStreak: 0,
        avatarState: 'idle',
        isClimbing: false
      });
    }
  };

  // When room is created or joined from ClassroomModal
  const handleRoomJoined = (room: RoomState, role: 'student' | 'teacher', participant: any) => {
    setRoomState(room);
    setUserRole(role);
    setParticipantId(participant?.id || '');

    if (role === 'student' && participant) {
      // Sync initial stats
      realtimeManager.updateProgress({
        name: studentName,
        currentLevel,
        altitude: currentAltitude,
        xp,
        coins,
        streak,
        maxStreak,
        firstTryCount,
        avatarId: selectedAvatar.id,
        avatarEmoji: selectedAvatar.emoji,
      });
    }
  };

  const handleJoinAsStudent = async (roomCode: string, name: string, avatar: AvatarOption): Promise<boolean> => {
    const code = roomCode.trim().toUpperCase();
    setStudentName(name);
    localStorage.setItem('pfq_student_name', name);
    setSelectedAvatar(avatar);

    const participant: Participant = {
      id: realtimeManager.getOrCreateStudentId(),
      name: name,
      role: 'student',
      avatarId: avatar.id,
      avatarEmoji: avatar.emoji,
      currentLevel,
      altitude: currentAltitude,
      xp,
      coins,
      streak,
      maxStreak,
      firstTryCount,
      isClimbing: false,
      avatarState: 'idle',
      completedAt: null,
      lastActive: Date.now(),
      isOnline: true,
    };

    realtimeManager.connect(code, participant);
    setUserRole('student');
    setParticipantId(participant.id);

    const fetched = await realtimeManager.fetchRoom(code);
    if (fetched) {
      setRoomState(fetched);
    }
    return true;
  };

  const handleCreateRoomAsTeacher = async (title: string, tName: string, customCode?: string): Promise<RoomState | null> => {
    const created = await realtimeManager.createRoom(title, tName, customCode);
    if (created) {
      const teacherParticipant: Participant = {
        id: 'prof_' + Math.random().toString(36).substring(2, 9),
        name: tName,
        role: 'teacher',
        avatarId: selectedAvatar.id,
        avatarEmoji: '👨‍🏫',
        currentLevel: 12,
        altitude: 3000,
        xp: 0,
        coins: 0,
        streak: 0,
        maxStreak: 0,
        firstTryCount: 0,
        isClimbing: false,
        avatarState: 'idle',
        completedAt: null,
        lastActive: Date.now(),
        isOnline: true,
      };
      realtimeManager.connect(created.code, teacherParticipant);
      setRoomState(created);
      setUserRole('teacher');
      setParticipantId(teacherParticipant.id);
      return created;
    }
    return null;
  };

  const handleSaveStudentRegistration = (name: string, avatar: AvatarOption, roomCode?: string) => {
    setStudentName(name);
    localStorage.setItem('pfq_student_name', name);
    setSelectedAvatar(avatar);
    setIsRegistrationOpen(false);

    if (roomCode) {
      handleJoinAsStudent(roomCode, name, avatar);
    } else if (roomState && userRole === 'student') {
      realtimeManager.updateProgress({
        name,
        avatarId: avatar.id,
        avatarEmoji: avatar.emoji,
      });
    }
  };

  const handleOpenTeacherScreen = async () => {
    if (!roomState || userRole !== 'teacher') {
      await handleCreateRoomAsTeacher('Turma Farmácia - Matemática Financeira SENAI', 'Prof. Miquéias', 'FAR35');
    }
    setViewMode('teacher');
  };

  const handleLeaveRoom = () => {
    realtimeManager.leaveRoom();
    setRoomState(null);
    setUserRole(null);
    setParticipantId('');
    setIsTeacherDashboardOpen(false);
    setIsLeaderboardOpen(false);
  };

  const activeParticipants: Participant[] = roomState 
    ? (Object.values(roomState.participants) as Participant[]) 
    : [];

  // Dedicated Teacher Screen View (for monitoring 35 students)
  if (viewMode === 'teacher') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <TeacherScreen
          room={roomState}
          onSendAnnouncement={(msg) => realtimeManager.sendAnnouncement(msg)}
          onResetRace={() => {
            realtimeManager.resetRace();
            handleRestart();
          }}
          onOpenPresentationMode={() => setIsPresentationMode(true)}
          onSwitchToStudentView={() => setViewMode('student')}
        />

        {/* Presentation mode overlay if active */}
        {isPresentationMode && (
          <div className="fixed inset-0 z-50 bg-slate-950 p-4 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="p-4 bg-indigo-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-amber-300" />
                    <span>Modo Telão Datashow - SENAI Farmácia</span>
                  </h2>
                  <p className="text-xs text-indigo-200">
                    Código PIN da Sala: <strong className="text-amber-300 font-mono text-base">{roomState?.code || 'FAR35'}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setIsPresentationMode(false)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Fechar Modo Telão
                </button>
              </div>

              <MountainCanvas
                currentLevel={currentLevel}
                avatar={selectedAvatar}
                isClimbing={isClimbing}
                avatarState={avatarState}
                classroomParticipants={activeParticipants}
                currentParticipantId={participantId}
                isTeacherView={true}
                classroomCode={roomState?.code}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                studentName={studentName}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 antialiased py-4 px-3 sm:px-6 md:px-8">
      {/* Teacher Announcement Toast */}
      {announcementToast && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-amber-300/40 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-100">
                  Aviso do Professor (Transmissão ao Vivo)
                </div>
                <div className="text-sm font-black">{announcementToast.message}</div>
              </div>
            </div>
            <button
              onClick={() => setAnnouncementToast(null)}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Top View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-700">Aluno:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 font-bold">
              {studentName || 'Nome não cadastrado'}
            </span>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              className="text-sky-700 hover:text-sky-900 underline font-semibold ml-1 cursor-pointer"
            >
              {studentName ? 'Alterar' : 'Cadastrar Nome'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenTeacherScreen}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>👨‍🏫 Painel do Professor (35 Alunos)</span>
            </button>
          </div>
        </div>

        {/* Header with Stats, Classroom Status & Fast Actions */}
        <HeaderStats
          avatar={selectedAvatar}
          altitude={currentAltitude}
          streak={streak}
          xp={xp}
          coins={coins}
          soundEnabled={soundActive}
          onToggleSound={handleToggleSound}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenFormulas={() => setIsFormulasOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onChangeAvatar={() => setIsAvatarModalOpen(true)}
          studentName={studentName}
          onEditStudentName={() => setIsRegistrationOpen(true)}
          activeRoomCode={roomState?.code}
          userRole={userRole}
          participantsCount={activeParticipants.filter(p => p.role === 'student').length}
          onOpenClassroom={() => setIsClassroomModalOpen(true)}
          onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
          onOpenTeacherScreen={handleOpenTeacherScreen}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        />

        {/* Presentation mode toolbar if active */}
        {isPresentationMode && (
          <div className="p-3 bg-indigo-950 text-white rounded-2xl border border-indigo-700/50 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <Monitor className="w-5 h-5 text-amber-300" />
              <div>
                <div className="text-xs font-bold text-indigo-200">Modo Telão / Datashow Ativo</div>
                <div className="text-[11px] text-slate-300">
                  Código da Sala: <span className="font-mono font-bold text-amber-300 text-sm">{roomState?.code}</span> • Ideal para projetar na frente da sala de aula
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Placar</span>
              </button>
              <button
                onClick={() => setIsPresentationMode(false)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Sair do Telão
              </button>
            </div>
          </div>
        )}

        {/* Interactive Mountain Canvas: SVG Landscape with Path & Real-time Companion Mountaineers */}
        <MountainCanvas
          currentLevel={currentLevel}
          avatar={selectedAvatar}
          isClimbing={isClimbing}
          avatarState={avatarState}
          classroomParticipants={activeParticipants}
          currentParticipantId={participantId}
          isTeacherView={userRole === 'teacher'}
          classroomCode={roomState?.code}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          studentName={studentName}
        />

        {/* Main Progression Area: Question Card OR Completion Screen */}
        {!isExpeditionComplete && currentQuestion ? (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentLevel + 1}
            totalQuestions={QUESTIONS.length}
            onAnswerCorrect={handleAnswerCorrect}
            onAnswerIncorrect={handleAnswerIncorrect}
            onClimbToNextLevel={handleClimbToNextLevel}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenFormulas={() => setIsFormulasOpen(true)}
            availableFiftyFifty={availableFiftyFifty}
            onUseFiftyFifty={handleUseFiftyFifty}
            streak={streak}
            studentName={studentName}
          />
        ) : (
          <CompletionScreen
            avatar={selectedAvatar}
            studentName={studentName}
            xp={xp}
            coins={coins}
            maxStreak={maxStreak}
            firstTryCount={firstTryCount}
            onRestart={handleRestart}
          />
        )}

        {/* Expedition Footer Info */}
        <footer className="text-center py-4 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>🏔️ Ferramentas da Qualidade Quest: Escalada da Montanha</span>
          <span>•</span>
          <span>5S • Carta de Controle (CEP) • Diagrama de Ishikawa</span>
          <span>•</span>
          {roomState ? (
            <span className="font-semibold text-indigo-700">
              Conectado à Turma {roomState.code} ({activeParticipants.filter(p => p.role === 'student').length} alunos ao vivo)
            </span>
          ) : (
            <span>Regra: Apenas acertos autorizam o avanço de nível</span>
          )}
        </footer>
      </div>

      {/* Student Registration Modal */}
      <StudentRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => {
          if (studentName) setIsRegistrationOpen(false);
        }}
        currentName={studentName}
        currentAvatar={selectedAvatar}
        initialRoomCode={initialRoomCode}
        onSave={handleSaveStudentRegistration}
        isMandatory={!studentName}
      />

      {/* Classroom Modals & Multi-user Tools */}
      <ClassroomModal
        isOpen={isClassroomModalOpen}
        onClose={() => setIsClassroomModalOpen(false)}
        activeRoom={roomState}
        userRole={userRole}
        initialCode={initialRoomCode}
        onJoinAsStudent={handleJoinAsStudent}
        onCreateRoomAsTeacher={handleCreateRoomAsTeacher}
        onLeaveRoom={handleLeaveRoom}
        currentAvatar={selectedAvatar}
      />

      <TeacherDashboardModal
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
        room={roomState}
        onLeaveRoom={handleLeaveRoom}
        onOpenPresentationMode={() => {
          setIsTeacherDashboardOpen(false);
          setIsPresentationMode(true);
        }}
      />

      <ClassroomLeaderboardDrawer
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        room={roomState}
        currentParticipantId={participantId}
      />

      {/* Standard Study Modals & Drawers */}
      <FinanceCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <FormulaModal
        isOpen={isFormulasOpen}
        onClose={() => setIsFormulasOpen(false)}
      />

      <AchievementsDrawer
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
      />

      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        selectedAvatarId={selectedAvatar.id}
        onSelectAvatar={(avatar) => {
          setSelectedAvatar(avatar);
          setIsAvatarModalOpen(false);
          if (roomState && userRole === 'student') {
            realtimeManager.updateProgress({
              avatarId: avatar.id,
              avatarEmoji: avatar.emoji
            });
          }
        }}
      />
    </div>
  );
}

