import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, X, LineChart, GitFork, Layers, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { playAudio } from '../utils/audio';

interface FinanceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinanceCalculatorModal: React.FC<FinanceCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'control' | 'ishikawa' | '5s'>('control');

  // Control Chart state
  const [lowerLimit, setLowerLimit] = useState<number>(70);
  const [upperLimit, setUpperLimit] = useState<number>(90);
  const [readings, setReadings] = useState<number[]>([74, 78, 82, 85, 88, 96]);
  const [newReading, setNewReading] = useState<string>('');

  // Ishikawa 6M interactive test
  const [selected6M, setSelected6M] = useState<string>('Mão de Obra');

  // 5S Checklist state (5 items)
  const [checklist5S, setChecklist5S] = useState<Record<string, boolean>>({
    seiri: true,
    seiton: true,
    seisou: true,
    seiketsu: false,
    shitsuke: true
  });

  if (!isOpen) return null;

  // Analysis of the readings
  const mean = Math.round((lowerLimit + upperLimit) / 2);
  const outOfControlPoints = readings.filter(r => r > upperLimit || r < lowerLimit);
  const isOutOfControl = outOfControlPoints.length > 0;

  // Check trend (4 or more consecutively increasing points)
  let isTrendingUp = false;
  let consecutiveUp = 0;
  for (let i = 1; i < readings.length; i++) {
    if (readings[i] > readings[i - 1]) {
      consecutiveUp++;
      if (consecutiveUp >= 3) isTrendingUp = true;
    } else {
      consecutiveUp = 0;
    }
  }

  const handleLoadPreset = (preset: 'pump_96' | 'vibration_trend' | 'stable') => {
    playAudio('click');
    if (preset === 'pump_96') {
      setLowerLimit(70);
      setUpperLimit(90);
      setReadings([72, 75, 78, 81, 84, 96]);
    } else if (preset === 'vibration_trend') {
      setLowerLimit(10);
      setUpperLimit(50);
      setReadings([15, 19, 23, 28, 33, 39, 44]);
    } else {
      setLowerLimit(70);
      setUpperLimit(90);
      setReadings([74, 82, 79, 85, 76, 81]);
    }
  };

  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newReading);
    if (!isNaN(val)) {
      playAudio('step');
      setReadings(prev => [...prev, val]);
      setNewReading('');
    }
  };

  const sixMDetails: Record<string, { desc: string; questionLink: string; keyAction: string }> = {
    'Mão de Obra': {
      desc: 'Fatores humanos: capacitação, treinamento técnico, atenção e qualificação dos operadores.',
      questionLink: '⭐ Questão 8: A falta de treinamento dos operadores enquadra-se diretamente nesta categoria!',
      keyAction: 'Matriz de competências, reciclagem técnica e treinamentos operacionais práticos.'
    },
    'Máquina': {
      desc: 'Equipamentos industriais, maquinário, ferramentas instaladas e componentes mecânicos.',
      questionLink: 'Falhas de manutenção preventiva, folga em mancais ou desgaste prematuro de peças.',
      keyAction: 'Planos de manutenção preventiva, preditiva e inspeção autônoma do operador.'
    },
    'Método': {
      desc: 'Procedimentos, instruções de trabalho (IT), parâmetros de processo e padrões da engenharia.',
      questionLink: 'Sequência incorreta de montagem ou falta de procedimento operacional padrão (POP).',
      keyAction: 'Padronização visual e revisão das instruções de trabalho.'
    },
    'Material': {
      desc: 'Qualidade dos insumos, matéria-prima, peças e componentes recebidos de fornecedores.',
      questionLink: 'Lote de insumos fora da especificação técnica ou dureza do material abaixo da norma.',
      keyAction: 'Qualificação de fornecedores e controle rígido no recebimento.'
    },
    'Medição': {
      desc: 'Instrumentação, tolerâncias dimensionais, calibração de instrumentos e amostragem.',
      questionLink: 'Paquímetros ou termômetros descalibrados gerando leituras distorcidas.',
      keyAction: 'Calibração metrológica periódica com rastreabilidade RBC.'
    },
    'Meio Ambiente': {
      desc: 'Condições ambientais da fábrica: temperatura, umidade, ventilação, iluminação e ruído.',
      questionLink: 'Temperatura ambiente elevada afetando o comportamento térmico das bombas.',
      keyAction: 'Climatização e controle de temperatura da planta fabril.'
    }
  };

  // 5S Checklist score
  const checkCount5S = Object.values(checklist5S).filter(Boolean).length;
  const score5S = Math.round((checkCount5S / 5) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Calculadora & Simulador da Qualidade</h3>
              <p className="text-xs text-sky-200">Carta de Controle (CEP) • Ishikawa (6M) • Checklist 5S</p>
            </div>
          </div>
          <button 
            onClick={() => { playAudio('click'); onClose(); }}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2 shrink-0">
          <button
            onClick={() => { setActiveTab('control'); playAudio('click'); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'control'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Simulador de Carta de Controle</span>
          </button>
          <button
            onClick={() => { setActiveTab('ishikawa'); playAudio('click'); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ishikawa'
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Matriz dos 6M (Ishikawa)</span>
          </button>
          <button
            onClick={() => { setActiveTab('5s'); playAudio('click'); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === '5s'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Checklist 5S</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 text-sm">
          {activeTab === 'control' && (
            <div className="space-y-4">
              {/* Preset Scenarios */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Carregar Cenário dos Desafios:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleLoadPreset('pump_96')}
                    className="px-2.5 py-1 text-xs bg-sky-50 hover:bg-sky-100 text-sky-900 font-semibold rounded-lg border border-sky-300 transition cursor-pointer"
                  >
                    Bomba a 96°C (Questão 4)
                  </button>
                  <button
                    onClick={() => handleLoadPreset('vibration_trend')}
                    className="px-2.5 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-semibold rounded-lg border border-indigo-300 transition cursor-pointer"
                  >
                    Tendência de Vibração (Questão 6)
                  </button>
                  <button
                    onClick={() => handleLoadPreset('stable')}
                    className="px-2.5 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-lg border border-emerald-300 transition cursor-pointer"
                  >
                    Processo Sob Controle
                  </button>
                </div>
              </div>

              {/* Limits Configuration */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    Limite Inferior (LIC)
                  </label>
                  <input
                    type="number"
                    value={lowerLimit}
                    onChange={(e) => setLowerLimit(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    Limite Superior (LSC)
                  </label>
                  <input
                    type="number"
                    value={upperLimit}
                    onChange={(e) => setUpperLimit(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              {/* Visual Control Chart Simulation */}
              <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono text-emerald-400">LSC: {upperLimit}</span>
                  <span className="font-mono text-slate-400">Linha Média: {mean}</span>
                  <span className="font-mono text-sky-400">LIC: {lowerLimit}</span>
                </div>

                {/* SVG Mini Chart */}
                <div className="relative h-32 w-full bg-slate-950/60 rounded-lg p-2 border border-slate-800 flex items-center justify-between">
                  {/* Upper Limit Red Line */}
                  <div className="absolute left-2 right-2 top-4 border-b border-dashed border-rose-500/80">
                    <span className="text-[9px] text-rose-400 font-mono absolute -top-3.5 right-0">LSC ({upperLimit})</span>
                  </div>

                  {/* Mean Line */}
                  <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 border-b border-slate-600">
                    <span className="text-[9px] text-slate-400 font-mono absolute -top-3.5 right-0">LM ({mean})</span>
                  </div>

                  {/* Lower Limit Line */}
                  <div className="absolute left-2 right-2 bottom-4 border-b border-dashed border-sky-500/80">
                    <span className="text-[9px] text-sky-400 font-mono absolute -bottom-3.5 right-0">LIC ({lowerLimit})</span>
                  </div>

                  {/* Plotted Points */}
                  <div className="relative w-full h-full flex items-center justify-around z-10 px-4">
                    {readings.map((r, i) => {
                      const range = Math.max(1, (upperLimit - lowerLimit) * 1.4);
                      const minVal = lowerLimit - (upperLimit - lowerLimit) * 0.2;
                      const pct = Math.max(0, Math.min(100, ((r - minVal) / range) * 100));
                      const isOut = r > upperLimit || r < lowerLimit;

                      return (
                        <div key={i} className="flex flex-col items-center group relative">
                          <div 
                            style={{ bottom: `${pct}%` }} 
                            className={`absolute w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shadow-md transition-all ${
                              isOut 
                                ? 'bg-rose-500 text-white animate-bounce' 
                                : 'bg-emerald-400 text-slate-950'
                            }`}
                          >
                            •
                          </div>
                          <span className="absolute -bottom-1 text-[9px] font-mono text-slate-300">
                            {r}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Diagnosis */}
                <div className={`p-3 rounded-lg text-xs font-semibold ${
                  isOutOfControl 
                    ? 'bg-rose-950/80 text-rose-200 border border-rose-600/60' 
                    : isTrendingUp 
                    ? 'bg-amber-950/80 text-amber-200 border border-amber-600/60' 
                    : 'bg-emerald-950/80 text-emerald-200 border border-emerald-600/60'
                }`}>
                  {isOutOfControl ? (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <strong>Processo FORA DE CONTROLE!</strong> Ponto(s) ultrapassaram o limite ({outOfControlPoints.join(', ')}). Exige ação corretiva imediata!
                      </div>
                    </div>
                  ) : isTrendingUp ? (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <strong>Alerta de Tendência Contínua:</strong> Medições crescendo consecutivamente. A equipe deve investigar a causa e continuar monitorando!
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <strong>Processo Sob Controle:</strong> Todas as medições estão dentro dos limites operacionais normais.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Add custom measurement */}
              <form onSubmit={handleAddReading} className="flex gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={newReading}
                  onChange={(e) => setNewReading(e.target.value)}
                  placeholder="Inserir nova leitura (ex: 96)..."
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Adicionar
                </button>
              </form>
            </div>
          )}

          {activeTab === 'ishikawa' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Selecione uma categoria dos 6M para ver o enquadramento de causas e foco na busca pela causa raiz:
              </div>

              {/* 6M Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.keys(sixMDetails).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelected6M(m); playAudio('click'); }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      selected6M === m
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs">{m}</div>
                    <div className={`text-[10px] mt-0.5 line-clamp-1 ${selected6M === m ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {sixMDetails[m].desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected 6M Detail Card */}
              {sixMDetails[selected6M] && (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    <h4 className="font-bold text-sm text-indigo-950">Categoria: {selected6M}</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Definição:</strong> {sixMDetails[selected6M].desc}
                  </p>
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 font-medium">
                    {sixMDetails[selected6M].questionLink}
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-indigo-100 text-xs text-slate-700">
                    ⚡ <strong>Ação de Bloqueio Recomendada:</strong> {sixMDetails[selected6M].keyAction}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === '5s' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Checklist dos sensos na manutenção e fábrica:</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Maturidade 5S: {score5S}%
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'seiri', name: '1. Seiri (Utilização)', text: 'Descarte de ferramentas quebradas e sem uso nas bancadas (Questão 1).' },
                  { key: 'seiton', name: '2. Seiton (Organização)', text: 'Local identificado e demarcado para cada ferramenta após a manutenção (Questão 2).' },
                  { key: 'seisou', name: '3. Seisou (Limpeza)', text: 'Limpeza e inspeção preventiva diária das máquinas e bancadas.' },
                  { key: 'seiketsu', name: '4. Seiketsu (Padronização)', text: 'Padrões visuais e procedimentos de higiene e conservação estabelecidos.' },
                  { key: 'shitsuke', name: '5. Shitsuke (Disciplina)', text: 'Procedimentos seguidos diariamente sem necessidade de cobrança constante (Questão 3).' },
                ].map((s) => (
                  <label
                    key={s.key}
                    onClick={() => playAudio('click')}
                    className="flex items-start gap-3 p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={checklist5S[s.key] || false}
                      onChange={(e) => setChecklist5S(prev => ({ ...prev, [s.key]: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-slate-600 text-[11px]">{s.text}</div>
                    </div>
                  </label>
                ))}
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
            Voltar aos Desafios
          </button>
        </div>
      </motion.div>
    </div>
  );
};
