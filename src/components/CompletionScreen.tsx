import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Mountain, 
  Flame, 
  Coins, 
  BookOpen, 
  Share2, 
  Check 
} from 'lucide-react';
import { AvatarOption, Question } from '../types';
import { QUESTIONS } from '../data/questions';
import { playAudio } from '../utils/audio';

interface CompletionScreenProps {
  avatar: AvatarOption;
  studentName?: string;
  xp: number;
  coins: number;
  maxStreak: number;
  firstTryCount: number;
  onRestart: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  avatar,
  studentName,
  xp,
  coins,
  maxStreak,
  firstTryCount,
  onRestart,
}) => {
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    playAudio('summit');

    // Grand celebratory confetti cannon burst
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#0284c7', '#10b981', '#fbbf24', '#f43f5e', '#8b5cf6'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  let titleRank = 'Especialista em Ferramentas da Qualidade';
  let badgeRank = '⭐⭐⭐ Alta Mestria';
  let quote = 'Uma expedição exemplar! Você provou total domínio de 5S, Cartas de Controle (CEP) e Diagrama de Ishikawa.';

  if (xp >= 140) {
    titleRank = 'Mestre Black Belt em Qualidade Total (TQM)';
    badgeRank = '🏆 Mestria Soberana';
    quote = 'Desempenho genial! Precisão cirúrgica na estabilidade de processos, limites operacionais, 5S e investigação da causa raiz!';
  } else if (xp >= 100) {
    titleRank = 'Coordenador Sênior de Melhoria Contínua';
    badgeRank = '🌟 Mestria Avançada';
    quote = 'Excelente discernimento! Forte domínio do monitoramento por cartas de controle, método dos 6M e disciplina 5S.';
  }

  const handleShare = () => {
    const text = `🏆 Conquistei o Cume da Qualidade Total (3000m) no Ferramentas da Qualidade Quest!\n⭐ XP: ${xp} | 💰 Pontos: ${coins.toLocaleString('pt-BR')} | 🔥 Maior Combo: ${maxStreak}x\nEspecialista: ${avatar.name} (${avatar.role})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
    >
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-sky-800 via-blue-900 to-indigo-950 text-white relative overflow-hidden">
        {/* Background Aura */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent pointer-events-none"></div>

        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center text-5xl sm:text-6xl shadow-2xl border-4 border-white/20"
        >
          🏔️
        </motion.div>

        <span className="inline-block px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-full shadow mb-2">
          {badgeRank}
        </span>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
          Cume da Montanha Conquistado! (3000m)
        </h2>

        <p className="text-amber-300 font-bold text-lg sm:text-xl mb-3">
          {titleRank}
        </p>

        <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {quote}
        </p>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-sky-200 font-medium">
          {studentName && (
            <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20 text-white font-bold">
              🎓 Aluno: <span className="text-amber-300">{studentName}</span>
            </div>
          )}
          <span className="flex items-center gap-1">
            <span>Especialista:</span>
            <span className="font-bold text-white flex items-center gap-1">
              <span>{avatar.emoji}</span>
              <span>{avatar.name}</span>
            </span>
          </span>
        </div>
      </div>

      {/* Score and Stats Grid */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <Sparkles className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <div className="text-xs font-semibold text-slate-500 uppercase">XP Final</div>
            <div className="text-2xl font-black font-mono text-emerald-700">{xp}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <Coins className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
            <div className="text-xs font-semibold text-slate-500 uppercase">Capital Final</div>
            <div className="text-lg sm:text-xl font-black font-mono text-amber-700">
              R$ {coins.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <Flame className="w-5 h-5 text-rose-500 mx-auto mb-1.5" />
            <div className="text-xs font-semibold text-slate-500 uppercase">Maior Combo</div>
            <div className="text-2xl font-black font-mono text-rose-700">{maxStreak}x</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <CheckCircle2 className="w-5 h-5 text-sky-600 mx-auto mb-1.5" />
            <div className="text-xs font-semibold text-slate-500 uppercase">Acertos de 1ª</div>
            <div className="text-2xl font-black font-mono text-sky-700">{firstTryCount} / 12</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={onRestart}
            className="px-6 py-3.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-700/20 transition flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Recomeçar Nova Expedição</span>
          </button>

          <button
            onClick={() => setShowReview(!showReview)}
            className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base transition border border-slate-300 flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-slate-600" />
            <span>{showReview ? 'Ocultar Resoluções' : 'Revisar Todas as 12 Questões'}</span>
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base transition shadow-md flex items-center gap-2"
          >
            {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            <span>{copied ? 'Copiado para o Clipboard!' : 'Compartilhar Resultado'}</span>
          </button>
        </div>

        {/* Question Review Section (Collapsible) */}
        {showReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-6 border-t border-slate-200 space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-700" />
              <span>Gabarito Pedagógico Completo dos 12 Desafios:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>{q.title}</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                      {q.altitude}m
                    </span>
                  </div>
                  <div className="text-sky-800 font-semibold mb-1">{q.concept}</div>
                  <div className="font-mono bg-white p-2 rounded border border-slate-200 text-slate-700 mb-2">
                    Resposta: <strong>{q.options[q.answer]}</strong>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{q.explanation}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
