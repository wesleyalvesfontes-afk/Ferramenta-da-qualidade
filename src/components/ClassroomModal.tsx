import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  X, 
  Share2, 
  QrCode, 
  ShieldCheck, 
  BookOpen, 
  Compass,
  Play
} from 'lucide-react';
import { AvatarOption, RoomState } from '../types';
import { AVATARS } from '../data/avatars';

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoom: RoomState | null;
  userRole: 'student' | 'teacher' | null;
  initialCode?: string;
  onJoinAsStudent: (roomCode: string, studentName: string, avatar: AvatarOption) => Promise<boolean>;
  onCreateRoomAsTeacher: (title: string, teacherName: string, customCode?: string) => Promise<RoomState | null>;
  onLeaveRoom: () => void;
  currentAvatar: AvatarOption;
}

export const ClassroomModal: React.FC<ClassroomModalProps> = ({
  isOpen,
  onClose,
  activeRoom,
  userRole,
  initialCode = '',
  onJoinAsStudent,
  onCreateRoomAsTeacher,
  onLeaveRoom,
  currentAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'info'>('student');
  
  // Student Form
  const [roomCodeInput, setRoomCodeInput] = useState<string>(initialCode);
  const [studentName, setStudentName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(currentAvatar);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string>('');

  // Teacher Form
  const [teacherName, setTeacherName] = useState<string>('Prof. Miquéias');
  const [roomTitle, setRoomTitle] = useState<string>('Turma Farmácia - Matemática Financeira');
  const [customPin, setCustomPin] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>('');

  // Copy feedback
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);

  useEffect(() => {
    if (initialCode) {
      setRoomCodeInput(initialCode.toUpperCase());
      setActiveTab('student');
    }
  }, [initialCode]);

  useEffect(() => {
    const savedName = localStorage.getItem('pfq_student_name');
    if (savedName) setStudentName(savedName);
  }, []);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareableStudentLink = activeRoom ? `${currentUrl}?sala=${activeRoom.code}` : '';

  const handleCopyLink = () => {
    if (!shareableStudentLink) return;
    navigator.clipboard.writeText(shareableStudentLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyPin = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2200);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');
    const code = roomCodeInput.trim().toUpperCase();
    const name = studentName.trim();

    if (!code) {
      setJoinError('Por favor, informe o código da sala fornecido pelo professor.');
      return;
    }
    if (!name) {
      setJoinError('Por favor, digite seu nome ou como gostaria de aparecer na montanha.');
      return;
    }

    setIsJoining(true);
    try {
      const ok = await onJoinAsStudent(code, name, selectedAvatar);
      if (ok) {
        localStorage.setItem('pfq_student_name', name);
        onClose();
      } else {
        setJoinError(`Sala "${code}" não encontrada ou indisponível. Verifique o código.`);
      }
    } catch (err) {
      setJoinError('Falha ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    const tName = teacherName.trim() || 'Professor';
    const title = roomTitle.trim() || 'Turma Farmácia';
    const pin = customPin.trim().toUpperCase() || undefined;

    setIsCreating(true);
    try {
      const room = await onCreateRoomAsTeacher(title, tName, pin);
      if (room) {
        setActiveTab('teacher');
      } else {
        setCreateError('Não foi possível criar a sala. Verifique a conexão.');
      }
    } catch (err) {
      setCreateError('Erro ao iniciar a sala do professor.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Sala de Aula em Tempo Real</h2>
              <p className="text-xs text-slate-300">
                Escalada síncrona com ranking ao vivo, avatares e feedback para alunos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('student')}
            className={`py-3 px-2 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'student'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Entrar como Aluno</span>
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`py-3 px-2 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'teacher'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Painel do Professor</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-2 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'info'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Como Funciona</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* If already in a room, show active room status header */}
          {activeRoom && (
            <div className="mb-6 p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-indigo-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Sala Ativa no Momento</span>
                </div>
                <div className="text-base font-bold mt-0.5">{activeRoom.title}</div>
                <div className="text-xs text-indigo-700">
                  Código: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-indigo-200 text-slate-900">{activeRoom.code}</span>
                  {' '}• {Object.keys(activeRoom.participants).length} participantes conectados
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-initial text-xs font-semibold px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
                </button>
                <button
                  onClick={onLeaveRoom}
                  className="text-xs font-semibold px-3 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 transition"
                >
                  Sair
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: ENTRAR COMO ALUNO */}
          {activeTab === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Código da Sala (PIN)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    placeholder="Ex: FAR742 ou SENAI26"
                    maxLength={10}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                    Fornecido pelo Prof.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Seu Nome de Aluno
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Ana Clara Silva ou Lucas Santos"
                  maxLength={30}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Escolha seu Avatar de Escalada
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVATARS.map((av) => {
                    const isSelected = selectedAvatar.id === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="text-2xl">{av.emoji}</span>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold truncate">{av.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{av.role}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {joinError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {joinError}
                </div>
              )}

              <button
                type="submit"
                disabled={isJoining}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isJoining ? (
                  <span>Conectando à montanha...</span>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Entrar na Sala & Iniciar Escalada</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CRIAR SALA COMO PROFESSOR */}
          {activeTab === 'teacher' && (
            <div className="space-y-4">
              {activeRoom && userRole === 'teacher' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-emerald-900 text-sm">Sua Sala está Aberta e Pronta!</div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">Ao Vivo</span>
                    </div>
                    <div className="mt-3 bg-white p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-500">Código PIN para os alunos:</div>
                        <div className="text-2xl font-black font-mono tracking-widest text-indigo-600">{activeRoom.code}</div>
                      </div>
                      <button
                        onClick={() => handleCopyPin(activeRoom.code)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition"
                      >
                        {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPin ? 'Copiado!' : 'Copiar PIN'}</span>
                      </button>
                    </div>

                    <div className="mt-3">
                      <div className="text-[11px] text-slate-600 font-semibold mb-1">Link Direto para Enviar no Chat/WhatsApp da Turma:</div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={shareableStudentLink}
                          className="w-full px-3 py-1.5 text-xs bg-white rounded border border-slate-300 font-mono text-slate-600 select-all"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap transition flex items-center gap-1"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copiar</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Projetar na Sala de Aula</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Abra o Painel do Professor para ver o telão da montanha com todos os alunos escalando.
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      Acessar Painel
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTeacherSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nome do Professor / Docente
                    </label>
                    <input
                      type="text"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="Ex: Prof. Miquéias"
                      maxLength={40}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Identificação da Turma / Disciplina
                    </label>
                    <input
                      type="text"
                      value={roomTitle}
                      onChange={(e) => setRoomTitle(e.target.value)}
                      placeholder="Ex: Turma Farmácia 2026 - SENAI"
                      maxLength={50}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Código Personalizado da Sala (Opcional)
                    </label>
                    <input
                      type="text"
                      value={customPin}
                      onChange={(e) => setCustomPin(e.target.value.toUpperCase())}
                      placeholder="Deixe em branco para gerar automático (Ex: FAR-742)"
                      maxLength={10}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                    <div className="text-[11px] text-slate-500 mt-1">
                      Você pode definir algo fácil como <span className="font-mono font-bold">SENAI26</span> para ditar aos alunos.
                    </div>
                  </div>

                  {createError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {createError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isCreating ? (
                      <span>Gerando sala...</span>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Criar Sala e Iniciar Sessão com a Turma</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: GUIA PASSO A PASSO */}
          {activeTab === 'info' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">1</span>
                  <span>O Professor Cria a Sala</span>
                </div>
                <p className="text-slate-600 pl-8">
                  Crie uma sala na aba "Painel do Professor". Um código PIN de 6 dígitos será gerado (ou escolha um personalizado como SENAI26).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">2</span>
                  <span>Os Alunos Conectam Simultaneamente</span>
                </div>
                <p className="text-slate-600 pl-8">
                  Compartilhe o link direto ou passe o código para os alunos. Cada aluno digita seu nome, escolhe seu avatar farmacêutico e entra na escalada.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">3</span>
                  <span>Acompanhamento em Tempo Real & Cume</span>
                </div>
                <p className="text-slate-600 pl-8">
                  Todos veem os colegas subindo a montanha conforme acertam as contas de juros simples e compostos! O professor pode projetar o "Telão da Montanha" no datashow, enviar dicas e exportar o relatório de notas em CSV ao final.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>🏔️ PharmaFinance Quest • Modo Colaborativo e Competitivo</span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 rounded"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
