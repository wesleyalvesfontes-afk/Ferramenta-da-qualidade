import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Trophy, 
  Compass, 
  Send, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Maximize2, 
  Sparkles, 
  Award,
  AlertCircle,
  Radio
} from 'lucide-react';
import { RoomState, Participant } from '../types';
import { MOUNTAIN_CAMPS } from '../data/questions';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomState | null;
  onSendAnnouncement: (message: string) => void;
  onResetRace: () => void;
  onTogglePresentationMode?: () => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  room,
  onSendAnnouncement,
  onResetRace,
  onTogglePresentationMode,
}) => {
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  if (!isOpen || !room) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareableStudentLink = `${currentUrl}?sala=${room.code}`;

  const participantsList = (Object.values(room.participants) as Participant[]).filter(p => p.role === 'student');

  // Sorted by highest level first, then highest XP, then fewest attempts/fastest
  const sortedParticipants: Participant[] = [...participantsList].sort((a, b) => {
    if (b.currentLevel !== a.currentLevel) return b.currentLevel - a.currentLevel;
    if (b.xp !== a.xp) return b.xp - a.xp;
    return b.streak - a.streak;
  });

  const totalStudents = participantsList.length;
  const onlineStudents = participantsList.filter(p => p.isOnline).length;
  const summitStudents = participantsList.filter(p => p.currentLevel >= 12).length;
  const averageAltitude = totalStudents > 0
    ? Math.round(participantsList.reduce((acc: number, p: Participant) => acc + (p.altitude || 0), 0) / totalStudents)
    : 0;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableStudentLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(room.code);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    onSendAnnouncement(announcementText.trim());
    setAnnouncementText('');
  };

  // Export to CSV for SENAI Teacher gradebook
  const handleExportCSV = () => {
    const headers = ['Posição', 'Nome do Aluno', 'Avatar', 'Nível Conquistado', 'Altitude (m)', 'Pontos XP', 'Moedas', 'Combo Máximo', 'Acertos 1ª Tentativa', 'Chegou ao Cume?', 'Conclusão'];
    const rows = sortedParticipants.map((p, idx) => [
      idx + 1,
      `"${p.name.replace(/"/g, '""')}"`,
      p.avatarEmoji,
      p.currentLevel,
      p.altitude,
      p.xp,
      p.coins,
      p.maxStreak,
      p.firstTryCount,
      p.currentLevel >= 12 ? 'SIM' : 'NÃO',
      p.completedAt ? new Date(p.completedAt).toLocaleTimeString('pt-BR') : '-'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_escalada_${room.code}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Painel do Docente • Ao Vivo</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  Sincronização Ativa
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {room.title} • {room.teacherName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onTogglePresentationMode && (
              <button
                onClick={onTogglePresentationMode}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                title="Projetar montanha em tela cheia no Datashow"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modo Telão</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Banner: PIN Code & Sharing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-indigo-950 flex flex-col justify-between">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Código PIN da Sala</div>
              <div className="flex items-center justify-between my-2">
                <div className="text-3xl font-black font-mono tracking-widest text-indigo-700">{room.code}</div>
                <button
                  onClick={handleCopyPin}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1 transition shadow-2xs"
                >
                  {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPin ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="text-[11px] text-indigo-800">
                Os alunos digitam este código na tela inicial para entrar.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 md:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Link Direto para Alunos</div>
                <button
                  onClick={handleCopyLink}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link Completo'}</span>
                </button>
              </div>
              <div className="my-2">
                <input
                  type="text"
                  readOnly
                  value={shareableStudentLink}
                  className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-mono text-slate-700 select-all"
                />
              </div>
              <div className="text-[11px] text-slate-500">
                Envie este link no Google Classroom, Microsoft Teams ou WhatsApp da turma.
              </div>
            </div>
          </div>

          {/* Real-time Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Alunos Conectados</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {totalStudents} <span className="text-xs font-normal text-slate-500">({onlineStudents} online)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Altitude Média</span>
                <Compass className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {averageAltitude}m
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Conquistaram Cume</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {summitStudents} <span className="text-xs font-normal text-slate-500">/ {totalStudents}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Maior Combo da Turma</span>
                <Sparkles className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {Math.max(0, ...participantsList.map(p => p.maxStreak || 0))}x
              </div>
            </div>
          </div>

          {/* Broadcast Tip / Message to Students */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70">
            <div className="font-bold text-xs text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📢 Enviar Dica ou Instrução em Tempo Real para Todos os Alunos</span>
            </div>
            <form onSubmit={handleSendAnnouncement} className="flex gap-2">
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Ex: Atenção à questão de juros compostos: use a fórmula M = C × (1 + i)^t !"
                className="flex-1 px-3 py-2 text-xs bg-white rounded-lg border border-amber-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmitir</span>
              </button>
            </form>
            {room.announcement && (
              <div className="mt-2 text-[11px] text-amber-800">
                Última mensagem enviada: <span className="font-semibold italic">"{room.announcement.message}"</span>
              </div>
            )}
          </div>

          {/* Student Leaderboard Table */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Placar da Turma ao Vivo ({participantsList.length} Alunos)</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition"
                  title="Baixar planilha CSV com notas e desempenho"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Notas (CSV)</span>
                </button>

                {confirmReset ? (
                  <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                    <span className="text-[10px] text-rose-700 font-bold px-1">Zerar escalada?</span>
                    <button
                      onClick={() => {
                        onResetRace();
                        setConfirmReset(false);
                      }}
                      className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold"
                    >
                      Sim, Zerar
                    </button>
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-medium flex items-center gap-1 transition"
                    title="Reiniciar a escalada para todos os alunos"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar Corrida</span>
                  </button>
                )}
              </div>
            </div>

            {participantsList.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-xs">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <div className="font-bold text-slate-700">Nenhum aluno entrou na sala ainda</div>
                <div className="mt-1">Passe o código <span className="font-mono font-bold text-indigo-600">{room.code}</span> ou o link para seus alunos começarem a escalada!</div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Posição</th>
                      <th className="py-2.5 px-3">Aluno</th>
                      <th className="py-2.5 px-3">Nível & Altitude</th>
                      <th className="py-2.5 px-3">Pontos (XP)</th>
                      <th className="py-2.5 px-3">Moedas</th>
                      <th className="py-2.5 px-3">Combo Máx</th>
                      <th className="py-2.5 px-3">1ª Tentativa</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {sortedParticipants.map((p, index) => {
                      const isSummit = p.currentLevel >= 12;
                      const camp = MOUNTAIN_CAMPS[p.currentLevel] || MOUNTAIN_CAMPS[0];

                      return (
                        <tr key={p.id} className={isSummit ? 'bg-amber-50/40' : 'hover:bg-slate-50/70'}>
                          <td className="py-2.5 px-3 font-bold text-slate-700">
                            {index === 0 ? '🥇 1º' :
                             index === 1 ? '🥈 2º' :
                             index === 2 ? '🥉 3º' : `${index + 1}º`}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{p.avatarEmoji}</span>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{p.name}</span>
                                  {p.isOnline ? (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online agora"></span>
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-slate-300" title="Desconectado"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-800">
                              Nível {p.currentLevel}/12
                            </div>
                            <div className="text-[11px] text-sky-700 font-mono font-bold">
                              {p.altitude}m • {camp.name}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-600">
                            +{p.xp} XP
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">
                            🪙 {p.coins}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              🔥 {p.maxStreak}x
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono">
                            {p.firstTryCount || 0}
                          </td>
                          <td className="py-2.5 px-3">
                            {isSummit ? (
                              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                                <span>🏆 Cume (3000m)</span>
                              </span>
                            ) : (
                              <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-medium text-[10px]">
                                Escalando...
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Relatório gerado em tempo real • SENAI Docente</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition"
          >
            Fechar Painel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
