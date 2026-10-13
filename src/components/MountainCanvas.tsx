import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MountainCamp, AvatarOption, Participant } from '../types';
import { MOUNTAIN_CAMPS } from '../data/questions';
import { 
  Flag, 
  Compass, 
  Sparkles, 
  Cloud, 
  Sun, 
  Snowflake, 
  MapPin, 
  CheckCircle2, 
  Lock,
  Volume2,
  Maximize2,
  Users,
  Trophy
} from 'lucide-react';

interface MountainCanvasProps {
  currentLevel: number; // 0 to 12
  avatar: AvatarOption;
  isClimbing: boolean;
  avatarState: 'idle' | 'climbing' | 'celebrating' | 'thinking';
  onCampClick?: (camp: MountainCamp) => void;
  classroomParticipants?: Participant[];
  currentParticipantId?: string;
  isTeacherView?: boolean;
  classroomCode?: string;
  onOpenLeaderboard?: () => void;
  studentName?: string;
}

export const MountainCanvas: React.FC<MountainCanvasProps> = ({
  currentLevel,
  avatar,
  isClimbing,
  avatarState,
  onCampClick,
  classroomParticipants = [],
  currentParticipantId,
  isTeacherView = false,
  classroomCode,
  onOpenLeaderboard,
  studentName,
}) => {
  const [weather, setWeather] = useState<'sunny' | 'snowy' | 'sunset'>('sunny');
  const [selectedCamp, setSelectedCamp] = useState<MountainCamp | null>(null);
  const [selectedPeer, setSelectedPeer] = useState<Participant | null>(null);
  const [displayedAltitude, setDisplayedAltitude] = useState<number>(0);

  const currentCamp = MOUNTAIN_CAMPS[currentLevel] || MOUNTAIN_CAMPS[0];

  // Smoothly animate the altitude counter
  useEffect(() => {
    const targetAlt = currentCamp.altitude;
    const duration = 1200; // ms
    const startTime = performance.now();
    const startAlt = displayedAltitude;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startAlt + (targetAlt - startAlt) * eased);
      setDisplayedAltitude(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [currentLevel, currentCamp.altitude]);

  // Weather style gradients
  const skyGradients = {
    sunny: 'from-sky-400 via-blue-300 to-indigo-100',
    sunset: 'from-orange-400 via-rose-400 to-indigo-900',
    snowy: 'from-slate-400 via-sky-300 to-slate-200'
  };

  // Generate SVG path for the winding trail
  const pathD = MOUNTAIN_CAMPS.reduce((acc, camp, index) => {
    const x = camp.xPercent * 8; // SVG viewBox width is 800
    const y = camp.yPercent * 5; // SVG viewBox height is 500
    if (index === 0) return `M ${x} ${y}`;
    // Curve between camps
    const prev = MOUNTAIN_CAMPS[index - 1];
    const prevX = prev.xPercent * 8;
    const prevY = prev.yPercent * 5;
    const midX = (prevX + x) / 2 + (index % 2 === 0 ? 15 : -15);
    const midY = (prevY + y) / 2;
    return `${acc} Q ${midX} ${midY}, ${x} ${y}`;
  }, '');

  // Gear unlocked according to level
  const getGear = (lvl: number) => {
    if (lvl >= 9) return { name: 'Troféu & Cume da Qualidade', icon: '🏆' };
    if (lvl >= 7) return { name: 'Espinha de Peixe & Prancheta', icon: '🐟' };
    if (lvl >= 4) return { name: 'Carta de Controle & Termômetro', icon: '📈' };
    if (lvl >= 1) return { name: 'Checklist 5S & Lupa', icon: '📋' };
    return { name: 'Manual da Qualidade', icon: '📓' };
  };

  const gear = getGear(currentLevel);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white select-none">
      {/* Mountain Top Bar: Altitude, Zone & Weather Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-slate-900/60 backdrop-blur-md text-white flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Nível {currentLevel} de {MOUNTAIN_CAMPS.length - 1}: {currentCamp.name}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-sky-500/30 text-sky-200 border border-sky-400/40 px-3 py-1 rounded-full text-xs font-bold font-mono">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{displayedAltitude}m de altitude</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {classroomCode && (
            <button
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 bg-indigo-500/40 hover:bg-indigo-500/60 text-indigo-100 border border-indigo-400/50 px-2.5 py-1 rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
              title="Abrir Placar da Turma"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Sala {classroomCode} ({classroomParticipants.filter(p => p.role === 'student').length})</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-full text-xs">
            <span>{gear.icon}</span>
            <span>{gear.name}</span>
          </div>

          <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={() => setWeather('sunny')}
              title="Clima Ensolarado"
              className={`p-1.5 rounded-md transition ${weather === 'sunny' ? 'bg-sky-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setWeather('snowy')}
              title="Clima Nevado"
              className={`p-1.5 rounded-md transition ${weather === 'snowy' ? 'bg-sky-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              <Snowflake className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setWeather('sunset')}
              title="Crepúsculo Alpino"
              className={`p-1.5 rounded-md transition ${weather === 'sunset' ? 'bg-orange-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              <Cloud className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Mountain Visual Landscape SVG Container */}
      <div className={`relative w-full h-[280px] sm:h-[340px] md:h-[400px] bg-gradient-to-b ${skyGradients[weather]} transition-colors duration-700 overflow-hidden`}>
        {/* Animated Background Clouds */}
        <motion.div
          animate={{ x: [-20, 800] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 opacity-30 pointer-events-none"
        >
          <div className="w-44 h-12 bg-white rounded-full blur-sm"></div>
        </motion.div>
        <motion.div
          animate={{ x: [800, -100] }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 opacity-20 pointer-events-none"
        >
          <div className="w-60 h-14 bg-white rounded-full blur-md"></div>
        </motion.div>

        {/* Falling Snowflakes in Snowy Weather */}
        {weather === 'snowy' && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: `${(i * 4.2) % 100}%`, opacity: 0.8 }}
                animate={{ 
                  y: 450, 
                  x: `${((i * 4.2) % 100) + (i % 2 === 0 ? 5 : -5)}%` 
                }}
                transition={{ 
                  duration: 4 + (i % 4), 
                  repeat: Infinity, 
                  ease: 'linear',
                  delay: (i * 0.2) % 3 
                }}
                className="absolute w-2 h-2 bg-white rounded-full shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Mountain Scenery Vector Layer */}
        <svg 
          viewBox="0 0 800 500" 
          className="absolute inset-0 w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Mountain Gradient: Rock & Snow */}
            <linearGradient id="snowPeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="rockSlopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="40%" stopColor="#475569" />
              <stop offset="70%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="valleyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            <filter id="trailGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Distant Mountain Peaks */}
          <polygon points="120,500 280,120 440,500" fill="#94a3b8" opacity="0.35" />
          <polygon points="400,500 580,90 740,500" fill="#64748b" opacity="0.4" />

          {/* Main Giant Mountain Silhouette */}
          <polygon 
            points="0,500 80,420 220,300 400,30 580,260 720,410 800,500" 
            fill="url(#rockSlopeGrad)" 
          />

          {/* Snow Cap at the Summit */}
          <polygon 
            points="400,30 360,95 385,85 400,105 415,85 440,95" 
            fill="url(#snowPeakGrad)" 
          />
          <polygon 
            points="380,85 390,130 400,105 410,130 420,85" 
            fill="#ffffff" 
            opacity="0.9"
          />

          {/* Mid Rocky Terrain Details */}
          <polygon points="150,500 300,310 420,500" fill="#334155" opacity="0.7" />
          <polygon points="420,500 550,290 680,500" fill="#1e293b" opacity="0.6" />

          {/* Base Forest & Foothills */}
          <path 
            d="M 0,500 L 0,440 Q 120,410 260,450 Q 420,490 600,430 Q 720,410 800,450 L 800,500 Z" 
            fill="url(#valleyGrad)" 
          />

          {/* Pine Trees Silhouettes at the Base */}
          <polygon points="40,460 50,430 60,460" fill="#064e3b" />
          <polygon points="65,470 75,440 85,470" fill="#065f46" />
          <polygon points="90,465 100,435 110,465" fill="#064e3b" />
          <polygon points="130,475 140,445 150,475" fill="#065f46" />
          <polygon points="200,480 210,450 220,480" fill="#064e3b" />

          {/* Winding Mountain Climbing Trail (Backdrop dashed line) */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="5" 
            strokeDasharray="6 6"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Highlighted Climbed Trail Section */}
          {currentLevel > 0 && (
            <path 
              d={MOUNTAIN_CAMPS.slice(0, currentLevel + 1).reduce((acc, camp, index) => {
                const x = camp.xPercent * 8;
                const y = camp.yPercent * 5;
                if (index === 0) return `M ${x} ${y}`;
                const prev = MOUNTAIN_CAMPS[index - 1];
                const prevX = prev.xPercent * 8;
                const prevY = prev.yPercent * 5;
                const midX = (prevX + x) / 2 + (index % 2 === 0 ? 15 : -15);
                const midY = (prevY + y) / 2;
                return `${acc} Q ${midX} ${midY}, ${x} ${y}`;
              }, '')} 
              fill="none" 
              stroke="#fbbf24" 
              strokeWidth="5" 
              strokeLinecap="round"
              filter="url(#trailGlow)"
            />
          )}

          {/* Summit Flag at Top */}
          <g transform="translate(398, 12)">
            <line x1="0" y1="0" x2="0" y2="22" stroke="#e2e8f0" strokeWidth="2.5" />
            <polygon points="0,0 20,6 0,12" fill={currentLevel >= MOUNTAIN_CAMPS.length - 1 ? '#10b981' : '#ef4444'} />
            <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
          </g>

          {/* Interactive Checkpoint Markers (Camps) */}
          {MOUNTAIN_CAMPS.map((camp) => {
            const isCompleted = camp.level < currentLevel;
            const isCurrent = camp.level === currentLevel;
            const isLocked = camp.level > currentLevel;

            const cx = camp.xPercent * 8;
            const cy = camp.yPercent * 5;

            return (
              <g 
                key={camp.level} 
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedCamp(camp);
                  if (onCampClick) onCampClick(camp);
                }}
              >
                {/* Active Camp Pulsing Ring */}
                {isCurrent && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="16"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Camp Base Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isCurrent ? "12" : "9"}
                  fill={isCompleted ? "#10b981" : isCurrent ? "#f59e0b" : "#475569"}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Inner Icon / Text */}
                <text
                  x={cx}
                  y={cy + 3.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={isCurrent ? "9" : "7.5"}
                  fontWeight="bold"
                  className="pointer-events-none font-sans"
                >
                  {camp.level === MOUNTAIN_CAMPS.length - 1 ? '★' : isCompleted ? '✓' : camp.level}
                </text>

                {/* Hover / Small Label on important camps */}
                {(camp.level === 0 || camp.level === 3 || camp.level === 6 || camp.level === MOUNTAIN_CAMPS.length - 1 || isCurrent) && (
                  <text
                    x={cx}
                    y={cy + 22}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow-md font-sans bg-black/50"
                  >
                    {camp.altitude}m
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* ANIMATED CLIMBING AVATAR TOKEN */}
        <motion.div
          key={currentLevel}
          initial={isClimbing ? {
            left: `${MOUNTAIN_CAMPS[Math.max(0, currentLevel - 1)].xPercent}%`,
            top: `${MOUNTAIN_CAMPS[Math.max(0, currentLevel - 1)].yPercent}%`,
            scale: 0.9
          } : false}
          animate={{
            left: `${currentCamp.xPercent}%`,
            top: `${currentCamp.yPercent}%`,
            scale: 1
          }}
          transition={{
            duration: isClimbing ? 1.4 : 0.4,
            ease: [0.34, 1.56, 0.64, 1]
          }}
          className="absolute z-30 -translate-x-1/2 -translate-y-full pointer-events-auto cursor-pointer"
          onClick={() => setSelectedCamp(currentCamp)}
        >
          {/* Avatar Sprite Wrapper with Contextual Animations */}
          <motion.div
            animate={
              avatarState === 'climbing' 
                ? { 
                    y: [0, -14, 0, -12, 0], 
                    rotate: [-8, 8, -6, 6, 0],
                    transition: { repeat: Infinity, duration: 0.5 } 
                  }
                : avatarState === 'celebrating'
                ? { 
                    y: [0, -20, 0, -15, 0], 
                    scale: [1, 1.25, 1, 1.2, 1],
                    transition: { duration: 0.8 } 
                  }
                : avatarState === 'thinking'
                ? { 
                    rotate: [-3, 3, -3], 
                    y: [0, 2, 0],
                    transition: { repeat: Infinity, duration: 1.5 } 
                  }
                : { 
                    y: [0, -5, 0], 
                    transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' } 
                  }
            }
            className="relative flex flex-col items-center"
          >
            {/* Thought / Dialogue Bubble */}
            <AnimatePresence>
              {avatarState === 'thinking' && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-12 bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-semibold px-2.5 py-1 rounded-xl shadow-lg whitespace-nowrap z-40 flex items-center gap-1"
                >
                  <span>💭</span>
                  <span>{avatar.thinkingQuote}</span>
                </motion.div>
              )}

              {avatarState === 'celebrating' && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-12 bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-lg whitespace-nowrap z-40 flex items-center gap-1"
                >
                  <span>🎉</span>
                  <span>{avatar.celebrationQuote}</span>
                </motion.div>
              )}

              {avatarState === 'climbing' && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-10 bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap z-40"
                >
                  ▲ Escalando para {currentCamp.altitude}m...
                </motion.div>
              )}
            </AnimatePresence>

            {/* Avatar Circle Badge */}
            <div className="relative group">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-white to-slate-100 border-3 border-amber-400 shadow-xl flex items-center justify-center text-3xl transition-transform hover:scale-110">
                {avatar.emoji}
              </div>

              {/* Status Indicator Dot */}
              <div className={`absolute -bottom-0.5 right-0 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow ${
                avatarState === 'celebrating' ? 'bg-emerald-500' :
                avatarState === 'thinking' ? 'bg-amber-500' :
                avatarState === 'climbing' ? 'bg-sky-500' : 'bg-indigo-600'
              }`}>
                {avatarState === 'celebrating' ? '✓' :
                 avatarState === 'thinking' ? '?' :
                 avatarState === 'climbing' ? '▲' : '●'}
              </div>
            </div>

            {/* Avatar Name Tag */}
            <div className="mt-1 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md border border-amber-400/40 whitespace-nowrap flex items-center gap-1.5">
              <span className="text-amber-300 font-semibold">{studentName || avatar.name}</span>
              <span className="text-sky-300 font-mono text-[9px]">({currentCamp.altitude}m)</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Companion Students Climbing Tokens */}
        {classroomParticipants
          .filter(p => p.role === 'student' && p.id !== currentParticipantId)
          .map((peer, idx) => {
            const peerCamp = MOUNTAIN_CAMPS[peer.currentLevel] || MOUNTAIN_CAMPS[0];
            // Fan out students around same camp
            const offsetAngle = (idx * 55) * (Math.PI / 180);
            const offsetX = Math.cos(offsetAngle) * 3.2;
            const offsetY = Math.sin(offsetAngle) * 2.2;
            const xPercent = Math.min(94, Math.max(5, peerCamp.xPercent + offsetX));
            const yPercent = Math.min(92, Math.max(10, peerCamp.yPercent + offsetY));

            return (
              <motion.div
                key={peer.id}
                initial={false}
                animate={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute z-25 -translate-x-1/2 -translate-y-full cursor-pointer pointer-events-auto group select-none"
                onClick={() => setSelectedPeer(peer)}
              >
                <div className="flex flex-col items-center">
                  {/* Name tag on hover */}
                  <div className="bg-slate-900/90 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow border border-white/20 whitespace-nowrap mb-0.5 flex items-center gap-1 transition-all group-hover:scale-110">
                    <span className="max-w-[70px] truncate">{peer.name}</span>
                    {peer.currentLevel >= 12 && <span>🏆</span>}
                  </div>

                  {/* Mini Avatar Circle */}
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full bg-white border-2 shadow flex items-center justify-center text-sm transition-transform group-hover:scale-125 ${
                      peer.currentLevel >= 12 
                        ? 'border-amber-400 ring-2 ring-amber-300 bg-amber-50' 
                        : 'border-indigo-400'
                    }`}>
                      {peer.avatarEmoji}
                    </div>

                    {/* Online status or summit star */}
                    {peer.currentLevel >= 12 ? (
                      <span className="absolute -top-1 -right-1 text-[10px]">✨</span>
                    ) : peer.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"></div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Interactive Peer Detail Modal / Popup */}
      <AnimatePresence>
        {selectedPeer && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="p-3 bg-indigo-50 border-t border-indigo-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 shadow-sm flex items-center justify-center text-2xl">
                {selectedPeer.avatarEmoji}
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>{selectedPeer.name}</span>
                  {selectedPeer.currentLevel >= 12 ? (
                    <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">🏆 Conquistou o Cume!</span>
                  ) : (
                    <span className="px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">Escalando</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-indigo-700">Nível {selectedPeer.currentLevel} ({selectedPeer.altitude}m)</span>
                  <span>•</span>
                  <span>XP: +{selectedPeer.xp}</span>
                  <span>•</span>
                  <span>🔥 {selectedPeer.streak}x combo</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPeer(null)}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-100/70"
            >
              Fechar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Camp Detail Drawer / Popup (if user clicked on a checkpoint) */}
      <AnimatePresence>
        {selectedCamp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700"
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                selectedCamp.level < currentLevel ? 'bg-emerald-600' :
                selectedCamp.level === currentLevel ? 'bg-amber-500' : 'bg-slate-400'
              }`}>
                {selectedCamp.level === 12 ? '⛰️' : selectedCamp.level}
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{selectedCamp.name}</span>
                  <span className="text-slate-500 font-mono">({selectedCamp.altitude}m)</span>
                  {selectedCamp.level < currentLevel && (
                    <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold text-[10px]">Conquistado</span>
                  )}
                  {selectedCamp.level === currentLevel && (
                    <span className="text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold text-[10px]">Posição Atual</span>
                  )}
                </div>
                <div className="text-slate-600 text-[11px] mt-0.5">{selectedCamp.description}</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCamp(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded bg-slate-200/70"
            >
              Fechar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
