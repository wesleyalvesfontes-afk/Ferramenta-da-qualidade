import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  X, 
  Users, 
  Flame, 
  Compass, 
  Sparkles, 
  MapPin, 
  Activity,
  Award
} from 'lucide-react';
import { RoomState, Participant } from '../types';
import { MOUNTAIN_CAMPS } from '../data/questions';

interface ClassroomLeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomState | null;
  currentParticipantId?: string;
}

export const ClassroomLeaderboardDrawer: React.FC<ClassroomLeaderboardDrawerProps> = ({
  isOpen,
  onClose,
  room,
  currentParticipantId,
}) => {
  if (!isOpen || !room) return null;

  const participants = (Object.values(room.participants) as Participant[]).filter(p => p.role === 'student');
  const sorted: Participant[] = [...participants].sort((a, b) => {
    if (b.currentLevel !== a.currentLevel) return b.currentLevel - a.currentLevel;
    if (b.xp !== a.xp) return b.xp - a.xp;
    return b.streak - a.streak;
  });

  const topThree = sorted.slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Placar da Turma ao Vivo</h2>
                  <div className="text-[11px] text-slate-300">
                    Sala: <span className="font-mono font-bold text-amber-300">{room.code}</span> • {participants.length} escaladores
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Podium (Top 3) */}
            {topThree.length > 0 && (
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
                  Líderes da Escalada (Top 3)
                </div>
                <div className="grid grid-cols-3 gap-2 items-end pt-2">
                  {/* 2nd Place */}
                  {topThree[1] ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="text-2xl mb-1">{topThree[1].avatarEmoji}</div>
                      <div className="text-xs font-bold text-slate-800 truncate max-w-[90px]">{topThree[1].name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{topThree[1].altitude}m</div>
                      <div className="w-full bg-slate-200 border-t-2 border-slate-300 py-1 rounded-t-lg mt-1 text-[10px] font-black text-slate-700">
                        🥈 2º
                      </div>
                    </div>
                  ) : <div />}

                  {/* 1st Place */}
                  {topThree[0] ? (
                    <div className="flex flex-col items-center text-center -mt-3">
                      <div className="text-3xl mb-1 relative">
                        {topThree[0].avatarEmoji}
                        <span className="absolute -top-2 -right-1 text-xs">👑</span>
                      </div>
                      <div className="text-xs font-black text-indigo-900 truncate max-w-[100px]">{topThree[0].name}</div>
                      <div className="text-[10px] font-mono font-bold text-amber-600">{topThree[0].altitude}m</div>
                      <div className="w-full bg-amber-100 border-t-2 border-amber-400 py-2 rounded-t-lg mt-1 text-xs font-black text-amber-800 shadow-xs">
                        🥇 1º
                      </div>
                    </div>
                  ) : <div />}

                  {/* 3rd Place */}
                  {topThree[2] ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="text-2xl mb-1">{topThree[2].avatarEmoji}</div>
                      <div className="text-xs font-bold text-slate-800 truncate max-w-[90px]">{topThree[2].name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{topThree[2].altitude}m</div>
                      <div className="w-full bg-orange-100 border-t-2 border-orange-300 py-0.5 rounded-t-lg mt-1 text-[10px] font-black text-orange-800">
                        🥉 3º
                      </div>
                    </div>
                  ) : <div />}
                </div>
              </div>
            )}

            {/* Full List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Posições Atuais</span>
                <span>Altitude / XP</span>
              </div>

              {sorted.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Aguardando alunos entrarem na sala...
                </div>
              ) : (
                sorted.map((p, idx) => {
                  const isCurrent = p.id === currentParticipantId;
                  const isSummit = p.currentLevel >= 12;

                  return (
                    <div
                      key={p.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 text-center font-bold text-xs text-slate-500">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}
                        </div>
                        <div className="text-2xl shrink-0">{p.avatarEmoji}</div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                            <span className="truncate">{p.name}</span>
                            {isCurrent && (
                              <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0">
                                Você
                              </span>
                            )}
                            {isSummit && (
                              <span className="text-[10px] shrink-0" title="Chegou ao Cume!">🏆</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Nível {p.currentLevel}/12</span>
                            <span>•</span>
                            <span className="text-orange-600 font-semibold">🔥 {p.streak}x combo</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-sky-700">
                          {p.altitude}m
                        </div>
                        <div className="text-[10px] font-mono text-amber-600 font-bold">
                          +{p.xp} XP
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Activity Feed Section */}
              {room.events && room.events.length > 0 && (
                <div className="pt-4 mt-4 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Transmissão da Montanha</span>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {room.events.slice(0, 15).map((evt) => (
                      <div key={evt.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700 flex items-center gap-2">
                        <span>{evt.emoji || '📢'}</span>
                        <span className="flex-1">{evt.text}</span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(evt.timestamp).toLocaleTimeString('pt-BR', { minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
              <button
                onClick={onClose}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Voltar para o Desafio
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
