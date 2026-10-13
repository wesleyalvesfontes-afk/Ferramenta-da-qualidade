import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mountain, 
  Sparkles, 
  Check, 
  X, 
  GraduationCap, 
  Radio, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AvatarOption } from '../types';
import { AVATARS } from '../data/avatars';
import { playAudio } from '../utils/audio';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentName: string;
  currentAvatar: AvatarOption;
  initialRoomCode?: string;
  onSave: (name: string, avatar: AvatarOption, roomCode?: string) => void;
  isMandatory?: boolean;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentAvatar,
  initialRoomCode = '',
  onSave,
  isMandatory = false,
}) => {
  const [nameInput, setNameInput] = useState<string>(currentName);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(currentAvatar);
  const [roomCodeInput, setRoomCodeInput] = useState<string>(initialRoomCode);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    setNameInput(currentName);
  }, [currentName]);

  useEffect(() => {
    setSelectedAvatar(currentAvatar);
  }, [currentAvatar]);

  useEffect(() => {
    if (initialRoomCode) {
      setRoomCodeInput(initialRoomCode.toUpperCase().trim());
    }
  }, [initialRoomCode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Por favor, informe seu nome e sobrenome para o registro.');
      return;
    }

    playAudio('correct');
    onSave(cleanName, selectedAvatar, roomCodeInput.trim().toUpperCase() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-800 via-blue-900 to-indigo-950 p-6 text-white border-b border-white/10 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              🧗
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-200 text-[11px] font-semibold mb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Cadastro do Aluno - SENAI Farmácia</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white">
                Identifique seu Alpinista
              </h2>
              <p className="text-xs text-sky-200/90 mt-0.5">
                O seu avatar na montanha receberá seu nome para o professor acompanhar sua evolução ao vivo!
              </p>
            </div>
          </div>

          {!isMandatory && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Nome do Aluno Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-600" />
              <span>Seu Nome Completo (Aluno) *</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Ex: Lucas Ferreira de Souza"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 outline-hidden font-medium text-slate-900 transition text-sm bg-slate-50 focus:bg-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Este nome aparecerá acima do seu avatar na montanha e no diário de classe do professor.
            </p>
          </div>

          {/* Avatar Specialist Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Escolha seu Especialista Farmacêutico</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500">
                {selectedAvatar.name}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar.id === av.id;
                return (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => {
                      playAudio('click');
                      setSelectedAvatar(av);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50 shadow-sm ring-2 ring-sky-200'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                      {av.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-500 line-clamp-1">
                      {av.role.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Room Code (PIN) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-600" />
                <span>Código da Sala do Professor (Opcional / PIN)</span>
              </label>
              {roomCodeInput && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Conectando à sala
                </span>
              )}
            </div>
            <input
              type="text"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="Ex: FARM35 (ou deixe em branco para jogar individual)"
              maxLength={10}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs uppercase font-bold text-indigo-950 focus:border-indigo-500 focus:bg-white outline-hidden tracking-wider"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Se o professor Miquéias projetou um código no quadro ou telão, insira aqui para sincronizar com a turma.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Confirmar e Iniciar Escalada</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
