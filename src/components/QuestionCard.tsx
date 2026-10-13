import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Flame,
  Calculator,
  BookOpen
} from 'lucide-react';
import { playAudio } from '../utils/audio';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerCorrect: (gainedXp: number, gainedCoins: number) => void;
  onAnswerIncorrect: () => void;
  onClimbToNextLevel: () => void;
  onOpenCalculator: () => void;
  onOpenFormulas: () => void;
  availableFiftyFifty: number;
  onUseFiftyFifty: () => void;
  streak: number;
  studentName?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerCorrect,
  onAnswerIncorrect,
  onClimbToNextLevel,
  onOpenCalculator,
  onOpenFormulas,
  availableFiftyFifty,
  onUseFiftyFifty,
  streak,
  studentName,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [wrongAttempts, setWrongAttempts] = useState<number[]>([]);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setEliminatedOptions([]);
    setShowHint(false);
    setAttempts(0);
    setWrongAttempts([]);
  }, [question.id]);

  const handleSelectOption = (index: number) => {
    if (isAnswered && isCorrect) return; // already solved correctly
    if (eliminatedOptions.includes(index)) return;

    setSelectedOption(index);
    setIsAnswered(true);

    if (index === question.answer) {
      setIsCorrect(true);
      playAudio('correct');

      // Calculate rewards
      const baseXP = 15;
      const streakBonus = streak > 0 ? streak * 3 : 0;
      const attemptPenalty = attempts > 0 ? -3 : 0;
      const totalXP = Math.max(10, baseXP + streakBonus + attemptPenalty);

      const baseCoins = 5000;
      const bonusCoins = streak > 0 ? streak * 1500 : 0;
      const totalCoins = baseCoins + bonusCoins;

      onAnswerCorrect(totalXP, totalCoins);
    } else {
      setIsCorrect(false);
      playAudio('error');
      setAttempts(prev => prev + 1);
      setWrongAttempts(prev => (prev.includes(index) ? prev : [...prev, index]));
      onAnswerIncorrect();
    }
  };

  const handleRetry = () => {
    playAudio('click');
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleApplyFiftyFifty = () => {
    if (availableFiftyFifty <= 0 || isAnswered) return;
    playAudio('powerup');
    onUseFiftyFifty();

    // Find wrong indices to eliminate
    const wrongIndices = question.options
      .map((_, i) => i)
      .filter(i => i !== question.answer && !eliminatedOptions.includes(i));

    // With 3 options, eliminate 1 (leaving 1 wrong + 1 correct = 50/50); with 4 options, eliminate 2
    const countToEliminate = question.options.length <= 3 ? 1 : 2;
    const toEliminate = wrongIndices.sort(() => Math.random() - 0.5).slice(0, countToEliminate);
    setEliminatedOptions(prev => [...prev, ...toEliminate]);
  };

  const difficultyColors = {
    Iniciante: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Intermediário: 'bg-sky-100 text-sky-800 border-sky-300',
    Avançado: 'bg-amber-100 text-amber-800 border-amber-300',
    Estratégico: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
      {/* Question Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-blue-50/40 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {studentName && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1">
              <span>🧗</span>
              <span>{studentName}</span>
            </span>
          )}
          <span className="px-3 py-1 bg-sky-700 text-white font-bold text-xs rounded-lg shadow-sm">
            Questão {questionNumber} / {totalQuestions}
          </span>
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md">
            {question.concept}
          </span>
        </div>

        {/* Quick Tools: 50/50, Calculator, Formulas */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleApplyFiftyFifty}
            disabled={availableFiftyFifty <= 0 || isAnswered || eliminatedOptions.length > 0}
            title="Elimina 2 alternativas incorretas"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>50/50 ({availableFiftyFifty})</span>
          </button>

          <button
            onClick={() => { playAudio('click'); onOpenCalculator(); }}
            title="Abrir Calculadora e Simulador de Pareto / Qualidade"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Simulador</span>
          </button>

          <button
            onClick={() => { playAudio('click'); onOpenFormulas(); }}
            title="Ver Guia das Ferramentas da Qualidade"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Guia da Qualidade</span>
          </button>
        </div>
      </div>

      {/* Question Body */}
      <div className="p-5 sm:p-7">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 leading-snug">
          {question.title}
        </h3>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-normal">
          {question.text}
        </p>

        {/* Formula Hint Button / Toggle */}
        <div className="mb-6">
          <button
            onClick={() => {
              playAudio('click');
              setShowHint(!showHint);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHint ? 'Ocultar Dica Técnica' : '💡 Precisa de Dica? Ver Foco / Regra do Desafio'}</span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 overflow-hidden space-y-1"
              >
                <div className="font-bold flex items-center gap-1">
                  <span>📐 Regra / Conceito:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200">{question.formula}</span>
                </div>
                <div className="text-slate-700 text-[11px]">{question.formulaHint}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isEliminated = eliminatedOptions.includes(index);
            // CRITICAL: Only mark as correct if the student answered CORRECTLY! Never reveal correct answer when wrong!
            const isCorrectOption = isAnswered && isCorrect && index === question.answer;
            const isWrongSelected = isAnswered && isSelected && !isCorrect;
            const wasPreviouslyWrong = wrongAttempts.includes(index) && !isAnswered;

            let buttonStyle = "bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-sky-50 hover:border-sky-300";

            if (isAnswered) {
              if (isCorrect) {
                if (isCorrectOption) {
                  buttonStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-400";
                } else {
                  buttonStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                }
              } else {
                // Answered wrong: ONLY highlight the wrong selected answer in red. Do NOT reveal the correct answer!
                if (isWrongSelected) {
                  buttonStyle = "bg-rose-50 border-rose-400 text-rose-950 font-medium animate-shake";
                } else {
                  buttonStyle = "bg-slate-50 border-slate-200 text-slate-700";
                }
              }
            } else if (wasPreviouslyWrong) {
              buttonStyle = "bg-rose-50/40 border-rose-200 text-slate-600 hover:bg-rose-50";
            }

            if (isEliminated) {
              buttonStyle = "bg-slate-100 border-slate-200 text-slate-400 opacity-30 line-through cursor-not-allowed";
            }

            return (
              <button
                key={index}
                disabled={(isAnswered && isCorrect) || isEliminated}
                onClick={() => handleSelectOption(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 text-sm sm:text-base ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                    isCorrectOption 
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isWrongSelected 
                      ? 'bg-rose-600 text-white border-rose-600'
                      : wasPreviouslyWrong
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {wasPreviouslyWrong && !isAnswered && (
                    <span className="text-[11px] text-rose-700 font-semibold bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 shrink-0">
                      Tentativa anterior incorreta
                    </span>
                  )}
                </div>

                {isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isWrongSelected && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Pedagogical Feedback Section */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`p-4 sm:p-5 rounded-xl border mb-6 ${
                isCorrect
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="font-bold text-base">
                    {isCorrect ? (
                      <span className="text-emerald-900 flex items-center gap-2">
                        <span>🎉 Resposta Correta! Raciocínio Impecável!</span>
                        {streak > 1 && (
                          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                            <Flame className="w-3 h-3 fill-white" />
                            Combo {streak}x!
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-rose-900">
                        ⚠️ Resposta Incorreta. Não foi desta vez!
                      </span>
                    )}
                  </div>

                  {isCorrect ? (
                    <p className="leading-relaxed whitespace-pre-line text-slate-800">
                      {question.explanation}
                    </p>
                  ) : (
                    <div className="space-y-2 text-slate-800">
                      <p className="leading-relaxed">
                        Essa alternativa não é a correta. <strong>A resposta exata não foi revelada</strong> para que você possa analisar novamente os dados, refazer os cálculos e fixar o aprendizado!
                      </p>
                      <div className="p-2.5 bg-white/90 rounded-lg border border-rose-200 text-xs text-rose-950 flex items-start sm:items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                        <span>
                          <strong>Dica:</strong> Revise a fórmula (<code className="font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-900">{question.formula}</code>), utilize a <strong>Calculadora</strong> ou ative o auxílio <strong>50/50</strong>.
                        </span>
                      </div>
                    </div>
                  )}

                  {!isCorrect && (
                    <p className="font-semibold text-rose-800 pt-1 text-[11px]">
                      🏔️ Regra da Montanha: Você só avança de acampamento após encontrar e marcar a alternativa correta!
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions: SUBIR DE NÍVEL APENAS QUANDO ACERTAR! */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            <span>Local atual: <strong>{question.levelName}</strong></span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* If user made a mistake: ONLY allow RETRY, DO NOT ASCEND! */}
            {isAnswered && !isCorrect && (
              <button
                onClick={handleRetry}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 animate-bounce-subtle"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Revisar e Tentar Novamente</span>
              </button>
            )}

            {/* If user answered correctly: CLIMB TO NEXT LEVEL UNLOCKED! */}
            {isAnswered && isCorrect && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playAudio('climb');
                  onClimbToNextLevel();
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition flex items-center gap-2.5"
              >
                <span>🏔️ Acertou! Escalar a Montanha</span>
                <ArrowUpRight className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
