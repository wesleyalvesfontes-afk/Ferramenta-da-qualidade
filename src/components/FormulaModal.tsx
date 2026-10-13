import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, X, Check, Layers, LineChart, GitFork, Lightbulb, AlertTriangle } from 'lucide-react';
import { playAudio } from '../utils/audio';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | '5s' | 'control' | 'ishikawa'>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-700 to-sky-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Guia das Ferramentas da Qualidade</h3>
              <p className="text-xs text-emerald-100">5S • Cartas de Controle (CEP) • Diagrama de Ishikawa</p>
            </div>
          </div>
          <button 
            onClick={() => { playAudio('click'); onClose(); }}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => { setActiveTab('all'); playAudio('click'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            <span>Todas as Ferramentas</span>
          </button>
          <button
            onClick={() => { setActiveTab('5s'); playAudio('click'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === '5s' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Programa 5S</span>
          </button>
          <button
            onClick={() => { setActiveTab('control'); playAudio('click'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'control' ? 'bg-sky-700 text-white shadow-xs' : 'bg-white text-sky-800 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>2. Carta de Controle (CEP)</span>
          </button>
          <button
            onClick={() => { setActiveTab('ishikawa'); playAudio('click'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ishikawa' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-white text-indigo-800 hover:bg-indigo-50 border border-indigo-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>3. Diagrama de Ishikawa</span>
          </button>
        </div>

        {/* Content Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Card 1: 5S */}
          {(activeTab === 'all' || activeTab === '5s') && (
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">1</span>
                  <h4 className="font-bold text-emerald-950 text-base">Metodologia 5S (Housekeeping & Organização)</h4>
                </div>
                <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">Base Operacional</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <div className="font-bold text-xs text-emerald-900 mb-1 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">1º</span>
                    <span>Seiri (Utilização)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Triagem e descarte: ferramentas quebradas, sem uso e itens desnecessários devem ser retirados das bancadas para liberar espaço de trabalho.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <div className="font-bold text-xs text-emerald-900 mb-1 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">2º</span>
                    <span>Seiton (Organização)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Após manutenção ou uso, cada ferramenta recebe um <strong>local identificado</strong> para armazenamento (&ldquo;um lugar para cada coisa e cada coisa em seu lugar&rdquo;).
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <div className="font-bold text-xs text-emerald-900 mb-1 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">5º</span>
                    <span>Shitsuke (Disciplina)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Prática espontânea: os colaboradores seguem diariamente os procedimentos de organização e limpeza sem necessidade de cobrança constante da chefia.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-100/70 rounded-xl border border-emerald-300 text-xs text-emerald-950">
                💡 <strong>Complementos do 5S:</strong> <em>Seisou (Limpeza)</em> consiste em limpar inspecionando e eliminando fontes de sujeira; <em>Seiketsu (Padronização)</em> estabelece normas e checklists visuais de conservação.
              </div>
            </div>
          )}

          {/* Card 2: Carta de Controle */}
          {(activeTab === 'all' || activeTab === 'control') && (
            <div className="p-5 rounded-2xl border border-sky-200 bg-sky-50/50 space-y-3">
              <div className="flex items-center justify-between border-b border-sky-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold">2</span>
                  <h4 className="font-bold text-sky-950 text-base">Carta de Controle (Controle Estatístico de Processo - CEP)</h4>
                </div>
                <span className="text-xs bg-sky-200 text-sky-900 font-bold px-2.5 py-0.5 rounded-full">Monitoramento</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Desenvolvida por Walter Shewhart para <strong>identificar desvios e monitorar a estabilidade estatística do processo</strong> ao longo do tempo através de dados cronológicos.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-white rounded-xl border border-sky-200 shadow-2xs space-y-1.5">
                  <div className="font-bold text-xs text-sky-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Processo Fora de Controle</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Quando um ponto ultrapassa os limites operacionais normais. Exemplo: uma bomba que opera normalmente entre <strong>70°C e 90°C</strong> registrar <strong>96°C</strong> indica que o processo está <strong>fora de controle</strong>!
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-200 shadow-2xs space-y-1.5">
                  <div className="font-bold text-xs text-sky-900 flex items-center gap-1.5">
                    <LineChart className="w-4 h-4 text-sky-600" />
                    <span>Padrões de Tendência</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Uma sequência contínua de aumento (ex: aumento contínuo de vibração), mesmo antes de ultrapassar o limite de controle, é uma tendência não aleatória: <strong>a equipe deve investigar a causa e continuar monitorando</strong>.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-sky-100/70 rounded-xl border border-sky-300 text-xs text-sky-950">
                📊 <strong>Estrutura da Carta:</strong> Linha Média (LM), Limite Superior de Controle (LSC) e Limite Inferior de Controle (LIC). Distingue variações de causa comum (aleatórias) de causas especiais (desvios que exigem intervenção).
              </div>
            </div>
          )}

          {/* Card 3: Diagrama de Ishikawa */}
          {(activeTab === 'all' || activeTab === 'ishikawa') && (
            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">3</span>
                  <h4 className="font-bold text-indigo-950 text-base">Diagrama de Ishikawa (Causa e Efeito / Espinha de Peixe)</h4>
                </div>
                <span className="text-xs bg-indigo-200 text-indigo-900 font-bold px-2.5 py-0.5 rounded-full">Causa Raiz</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                O principal objetivo do Diagrama de Ishikawa é <strong>identificar e organizar visualmente possíveis causas de um problema</strong> (efeito) em uma estrutura ramificada.
              </p>

              <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-2">
                <div className="font-bold text-xs text-indigo-950">As 6 Categorias de Análise (Os 6M):</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                    <strong className="text-indigo-900 block">Máquina</strong>
                    <span className="text-[11px] text-slate-600">Equipamentos, desgaste, peças.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                    <strong className="text-indigo-900 block">Método</strong>
                    <span className="text-[11px] text-slate-600">Procedimentos, instruções de trabalho.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                    <strong className="text-indigo-900 block">Material</strong>
                    <span className="text-[11px] text-slate-600">Insumos e matéria-prima fornecida.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <strong className="text-amber-900 block">Mão de Obra ⭐</strong>
                    <span className="text-[11px] text-slate-700"><strong>Falta de treinamento</strong>, habilidades e operadores.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                    <strong className="text-indigo-900 block">Medição</strong>
                    <span className="text-[11px] text-slate-600">Instrumentos, calibração, tolerâncias.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                    <strong className="text-indigo-900 block">Meio Ambiente</strong>
                    <span className="text-[11px] text-slate-600">Temperatura, iluminação, poeira.</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-950">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Busca da Causa Raiz:</strong> Ao analisar problemas complexos como atrasos frequentes na produção, a avaliação estruturada desses fatores permite à equipe <strong>encontrar a verdadeira causa raiz</strong> e implementar soluções definitivas!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={() => { playAudio('click'); onClose(); }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition cursor-pointer"
          >
            Fechar Guia
          </button>
        </div>
      </motion.div>
    </div>
  );
};
