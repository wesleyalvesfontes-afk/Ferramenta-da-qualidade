import React from 'react';
import { motion } from 'motion/react';
import { Trophy, X, CheckCircle2, Lock } from 'lucide-react';
import { Achievement } from '../types';
import { playAudio } from '../utils/audio';

interface AchievementsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsDrawer: React.FC<AchievementsDrawerProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-lg">Mural de Conquistas Expedicionárias</h3>
              <p className="text-xs text-amber-100">{unlockedCount} de {achievements.length} desbloqueadas</p>
            </div>
          </div>
          <button 
            onClick={() => { playAudio('click'); onClose(); }}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-xl border flex items-center gap-3.5 transition ${
                ach.unlocked
                  ? 'bg-amber-50/70 border-amber-300 text-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                ach.unlocked ? 'bg-white border border-amber-200' : 'bg-slate-200 text-slate-400'
              }`}>
                {ach.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`font-bold text-sm ${ach.unlocked ? 'text-amber-950' : 'text-slate-500'}`}>
                    {ach.title}
                  </h4>
                  {ach.unlocked && (
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                      Desbloqueada!
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{ach.description}</p>
              </div>

              <div className="shrink-0">
                {ach.unlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={() => { playAudio('click'); onClose(); }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition"
          >
            Fechar Mural
          </button>
        </div>
      </motion.div>
    </div>
  );
};
