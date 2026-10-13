import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, Sparkles, X } from 'lucide-react';
import { AVATARS } from '../data/avatars';
import { AvatarOption } from '../types';
import { playAudio } from '../utils/audio';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose?: () => void;
  selectedAvatarId: string;
  onSelectAvatar: (avatar: AvatarOption) => void;
  canClose?: boolean;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedAvatarId,
  onSelectAvatar,
  canClose = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xs uppercase font-bold tracking-wider text-sky-200">Expedição Farmacêutica</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Escolha seu Especialista da Montanha</h2>
            <p className="text-xs sm:text-sm text-sky-100 mt-1">
              Selecione o profissional que guiará as tomadas de decisão financeiras rumo ao cume de 3000m:
            </p>
          </div>

          {canClose && onClose && (
            <button
              onClick={() => { playAudio('click'); onClose(); }}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Avatars Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AVATARS.map((avatar) => {
            const isSelected = avatar.id === selectedAvatarId;

            return (
              <div
                key={avatar.id}
                onClick={() => {
                  playAudio('powerup');
                  onSelectAvatar(avatar);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50/70 shadow-md ring-2 ring-sky-300'
                    : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {avatar.emoji}
                    </div>
                    {isSelected && (
                      <span className="px-2.5 py-1 bg-sky-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Selecionado
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-700 transition-colors">
                    {avatar.name}
                  </h3>
                  <p className="text-xs font-semibold text-sky-800 mb-2">
                    {avatar.role}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {avatar.bio}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] italic text-slate-500 flex items-center gap-1">
                  <span>&ldquo;{avatar.climbingQuote}&rdquo;</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {canClose && onClose && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
            <button
              onClick={() => { playAudio('click'); onClose(); }}
              className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition"
            >
              Confirmar Escolha
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
