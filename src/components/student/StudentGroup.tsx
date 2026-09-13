'use client';

import React, { useState } from 'react';
import {
  Users,
  Lock,
  Camera,
  FileText,
  Link as LinkIcon,
  User,
  RefreshCw,
  Smartphone,
  UserPlus,
  UserMinus,
  ArrowRightLeft,
  X,
  Check,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

interface StudentGroupProps {
  sharedGroup: any;
  notebooks: any[];
  onDataChange: () => void;
}

export function StudentGroup({ sharedGroup, notebooks, onDataChange }: StudentGroupProps) {
  const { isDarkMode, theme: t } = useTheme();
  const { user } = useAuth();

  const [hubTab, setHubTab] = useState<'turma' | 'escola'>('turma');
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentRole, setNewStudentRole] = useState<'Curador' | 'Revisor' | 'Comunicador'>('Curador');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const groupName = sharedGroup?.name || 'Equipe Exploradores da Geografia';
  const groupObjective = sharedGroup?.objective || 'Geografia • Profª. Cláudia • EM13CHS101';
  const members: any[] = sharedGroup?.members || [
    { name: 'Alex Silva', role: 'Curador', points: 480, isCurrentDeviceHolder: true },
    { name: 'Bia Santos', role: 'Revisora', points: 520, isCurrentDeviceHolder: false },
    { name: 'Carla Dias', role: 'Comunicadora', points: 430, isCurrentDeviceHolder: false },
    { name: 'Diego Alves', role: 'Curador', points: 460, isCurrentDeviceHolder: false }
  ];

  const availableStudents: any[] = sharedGroup?.availableStudents || [];
  const isCurrentUserInGroup = members.some((m) => m.userId === user?.id);
  const isTableFull = members.length >= 4;
  const currentHolder = members.find((m) => m.isCurrentDeviceHolder) || members[0];

  const handleRotateDevice = async (targetUserId?: number) => {
    if (!sharedGroup || isRotating) return;
    setIsRotating(true);
    setActionError(null);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      await fetch('/api/groups/rotate-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupId: sharedGroup.id,
          targetUserId
        })
      });
      onDataChange();
    } catch {
      setActionError('Falha ao alternar posse do celular.');
    } finally {
      setIsRotating(false);
    }
  };

  const handleAddMember = async (userId?: number, name?: string, role?: string) => {
    if (isSubmittingAdd || !sharedGroup) return;
    if (isTableFull) {
      setActionError('A mesa já atingiu a capacidade máxima de 4 alunos. Um colega precisa sair para outro entrar.');
      setIsAddModalOpen(false);
      return;
    }
    setIsSubmittingAdd(true);
    setActionError(null);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/groups/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupId: sharedGroup.id,
          userId,
          name: name || newStudentName,
          role: role || newStudentRole
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Erro ao adicionar estudante.');
        return;
      }

      setNewStudentName('');
      setIsAddModalOpen(false);
      onDataChange();
    } catch {
      setActionError('Não foi possível adicionar o estudante à mesa.');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleRemoveMember = async (userId: number, memberName: string) => {
    if (!sharedGroup) return;
    if (members.length <= 1) {
      setActionError('A mesa precisa manter pelo menos 1 estudante ativo no aparelho.');
      return;
    }

    setActionError(null);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch(`/api/groups/members?groupId=${sharedGroup.id}&userId=${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Erro ao remover estudante da mesa.');
        return;
      }

      onDataChange();
    } catch {
      setActionError('Não foi possível remover o estudante.');
    }
  };

  const handleUploadNotebook = async () => {
    setIsUploading(true);
    try {
      const sampleTitles = [
        'Resolução Manuscrita: Análise de Bacias Hidrográficas',
        'Mapa Mental: Matrizes Energéticas e Sustentabilidade',
        'Caderno: Exercícios de Geopolítica Pós-1950'
      ];
      const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];

      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      await fetch('/api/content/notebooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: randomTitle,
          type: 'HANDWRITTEN_NOTEBOOK',
          badge: 'Foto de Caderno'
        })
      });

      onDataChange();
    } catch {
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-5 space-y-5 animate-in fade-in pb-24">
      <div className={`flex p-1 rounded-2xl ${t.cardSub}`}>
        <button
          onClick={() => setHubTab('turma')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            hubTab === 'turma' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          Mesa de Estudos
        </button>
        <button
          onClick={() => setHubTab('escola')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
            hubTab === 'escola' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          <Lock className="w-3 h-3" /> Hub da Escola
        </button>
      </div>

      {hubTab === 'turma' ? (
        <>
          <div className={`${t.card} rounded-3xl p-5 relative transition-colors`}>
            <span className={`absolute -top-3 left-5 text-[9px] font-bold px-3 py-1 rounded-full ${t.primaryGrad} text-white shadow-md uppercase`}>
              {sharedGroup?.groupType || 'Oficial da Disciplina'}
            </span>
            <div className="mt-2">
              <h2 className={`${t.textMain} font-bold text-xl`}>{groupName}</h2>
              <p className={`${t.textMuted} text-xs mt-1 leading-relaxed`}>{groupObjective}</p>
            </div>
          </div>

          {!isCurrentUserInGroup && user?.role === 'student' && (
            <div className="p-4 rounded-3xl bg-violet-500/10 border-2 border-violet-500/30 flex items-center justify-between gap-3">
              <div>
                <p className={`${t.textMain} text-xs font-bold`}>Você não está nesta mesa</p>
                <p className={`${t.textMuted} text-[10px]`}>
                  Entre para pontuar colaborativamente neste aparelho.
                </p>
              </div>
              <button
                onClick={() => handleAddMember(user?.id, user?.name, user?.intelligence_role)}
                disabled={isSubmittingAdd}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-white ${t.primaryGrad} shadow hover:brightness-110 transition-all flex items-center gap-1 flex-shrink-0`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Entrar na Mesa</span>
              </button>
            </div>
          )}

          {actionError && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-500 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{actionError}</span>
              <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className={`${t.card} rounded-3xl p-5 border-2 border-fuchsia-500/50 transition-colors`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className={`${t.textMain} font-bold flex items-center gap-2 text-sm`}>
                  <Users className="w-5 h-5 text-fuchsia-500" />
                  Aparelho Compartilhado
                </h3>
                <p className={`${t.textMuted} text-[10px] mt-0.5 flex items-center gap-1`}>
                  <Smartphone className="w-3 h-3 text-fuchsia-500" />
                  1 Celular • {members.length} {members.length === 1 ? 'Estudante' : 'Estudantes'} na Mesa
                </p>
              </div>
              <span className="bg-emerald-500/20 text-emerald-500 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Sincronizado
              </span>
            </div>

            <div className={`p-4 rounded-2xl ${t.cardSub} mb-4 flex justify-between items-center border border-violet-500/10`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full ${t.primaryGrad} p-0.5 flex-shrink-0 shadow`}>
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {currentHolder?.avatar ? (
                      <img src={currentHolder.avatar} alt={currentHolder.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className={`${t.textMuted} text-[10px] uppercase font-bold tracking-wider mb-0.5`}>
                    Posse Atual do Aparelho
                  </p>
                  <p className={`${t.textMain} text-sm font-bold truncate`}>
                    {currentHolder?.name || 'Vez de Aluno'}
                    {currentHolder?.userId === user?.id && (
                      <span className="ml-1.5 text-[9px] bg-fuchsia-500 text-white px-1.5 py-0.5 rounded-full">
                        Você
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-fuchsia-500 font-semibold">+10 bônus individual por segurar</p>
                </div>
              </div>
              <button
                onClick={() => handleRotateDevice()}
                disabled={isRotating || members.length <= 1}
                className="bg-fuchsia-500/15 hover:bg-fuchsia-500/25 text-fuchsia-600 dark:text-fuchsia-400 text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                <span>Girar Posse</span>
              </button>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className={`${t.textMuted} text-[11px] font-bold uppercase tracking-wider`}>
                Integrantes da Mesa ({members.length})
              </span>
              <div className="flex items-center gap-1.5">
                {isCurrentUserInGroup && user?.id && (
                  <button
                    onClick={() => handleRemoveMember(user.id, user.name || 'Você')}
                    className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 rounded-lg transition-all"
                    title="Sair desta mesa"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da Mesa</span>
                  </button>
                )}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-[11px] font-bold text-violet-500 hover:text-violet-600 dark:text-violet-400 flex items-center gap-1 bg-violet-500/10 px-2.5 py-1 rounded-lg transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Adicionar Aluno</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {members.map((m: any, i: number) => {
                const isHolder = Boolean(m.isCurrentDeviceHolder);
                const isMe = m.userId === user?.id;

                return (
                  <div
                    key={m.userId || i}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center text-center relative ${
                      isHolder
                        ? 'border-fuchsia-500 bg-fuchsia-500/10 shadow-sm ring-1 ring-fuchsia-500/30'
                        : isDarkMode
                        ? 'border-violet-800/60 bg-white/5'
                        : 'border-violet-100 bg-slate-50'
                    }`}
                  >
                    {isHolder ? (
                      <div className="absolute -top-2 bg-fuchsia-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                        <Smartphone className="w-2.5 h-2.5" /> SEGURANDO
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRotateDevice(m.userId)}
                        title="Passar celular para este aluno"
                        className="absolute -top-2 bg-violet-600 hover:bg-violet-700 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow transition-all flex items-center gap-1"
                      >
                        <ArrowRightLeft className="w-2.5 h-2.5" /> Passar Celular
                      </button>
                    )}

                    <div
                      className={`w-10 h-10 rounded-full ${
                        isHolder ? t.primaryGrad : 'bg-slate-300 dark:bg-slate-700'
                      } mb-1.5 flex items-center justify-center overflow-hidden shadow-sm mt-1`}
                    >
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>

                    <p className={`${t.textMain} text-xs font-bold truncate max-w-full flex items-center gap-1`}>
                      {m.name}
                      {isMe && <span className="text-[8px] text-fuchsia-500 font-black">(Você)</span>}
                    </p>

                    <span className="mt-0.5 px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 text-[9px] font-semibold">
                      {m.role || 'Curador'}
                    </span>

                    <div className="flex items-center justify-center gap-1 mt-1.5 flex-wrap">
                      <p className="text-[11px] font-black text-emerald-500">{m.points || 0} pts</p>
                      {isHolder && (
                        <span className="text-[8px] font-bold text-fuchsia-500 bg-fuchsia-500/15 px-1.5 py-0.5 rounded-full">
                          +10
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveMember(m.userId, m.name)}
                      title={`Remover ${m.name} da mesa`}
                      className="mt-2.5 w-full py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 border border-rose-500/25"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>{isMe ? 'Sair da mesa' : 'Remover'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className={`p-3 rounded-2xl ${t.cardSub} border border-violet-500/15 flex items-center justify-between mt-3 text-[10px]`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={t.textMuted}>Regra Fair Sync:</span>
              </div>
              <div className="font-bold text-violet-500 text-[10px]">
                +50 coletivo / +10 ao segurar
              </div>
            </div>
          </div>

          <div className={`${t.card} rounded-3xl p-5 transition-colors`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${t.textMain} font-bold text-sm`}>Resolução Híbrida (Caderno Físico)</h3>
              <button
                onClick={handleUploadNotebook}
                disabled={isUploading}
                className={`px-4 py-2 rounded-xl ${t.primaryGrad} flex items-center gap-2 text-white text-xs font-bold shadow-md hover:brightness-110 transition-all`}
              >
                <Camera className="w-4 h-4" />
                <span>{isUploading ? 'Enviando...' : 'Fotografar Caderno'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {notebooks && notebooks.length > 0 ? (
                notebooks.map((nb: any, idx: number) => (
                  <div key={nb.id || idx} className={`p-3 rounded-xl ${t.cardSub} flex gap-3 items-center border border-violet-500/10`}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-violet-500/20 text-violet-600 dark:text-violet-300 rounded uppercase">
                        {nb.badge || 'Foto de Caderno'}
                      </span>
                      <p className={`${t.textMain} text-xs font-semibold mt-1 truncate`}>{nb.title}</p>
                      <p className={`${t.textMuted} text-[9px] truncate`}>
                        Enviado por {nb.author_name || nb.student_name || 'Alex'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className={`p-3 rounded-xl ${t.cardSub} flex gap-3 items-center border border-violet-500/10`}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-violet-500/20 text-violet-600 dark:text-violet-300 rounded uppercase">
                        Foto de Caderno
                      </span>
                      <p className={`${t.textMain} text-xs font-semibold mt-1`}>Mapa Mental - Climas</p>
                      <p className={`${t.textMuted} text-[9px]`}>Enviado por Alex (Curador)</p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${t.cardSub} flex gap-3 items-center border border-violet-500/10`}>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <LinkIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded uppercase">
                        Link Recomendado
                      </span>
                      <p className={`${t.textMain} text-xs font-semibold mt-1`}>Vídeo: El Niño (Youtube)</p>
                      <p className={`${t.textMuted} text-[9px]`}>Enviado por Bia (Revisora)</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={`${t.card} rounded-3xl p-6 text-center space-y-3 transition-colors`}>
          <div className="w-12 h-12 rounded-full bg-amber-500/15 mx-auto flex items-center justify-center text-amber-500">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className={`${t.textMain} font-bold text-base`}>Hub da Escola (Global)</h3>
          <p className={`${t.textMuted} text-xs max-w-xs mx-auto leading-relaxed`}>
            Espaço assíncrono para compartilhamento de curadorias escolares. Materiais validados pela coordenação estarão disponíveis aqui.
          </p>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-5 ${t.card} border border-violet-500/20 shadow-2xl space-y-4`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`${t.textMain} font-bold text-sm flex items-center gap-1.5`}>
                  <UserPlus className="w-4 h-4 text-fuchsia-500" />
                  Adicionar Aluno à Mesa
                </h3>
                <p className={`${t.textMuted} text-[10px]`}>
                  Integre colegas para compartilhar este aparelho.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {availableStudents.length > 0 && (
              <div className="space-y-2">
                <p className={`${t.textMuted} text-[10px] uppercase font-bold tracking-wider`}>
                  Colegas Disponíveis:
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {availableStudents.map((s: any) => (
                    <div
                      key={s.userId}
                      className={`p-2 rounded-xl ${t.cardSub} flex items-center justify-between border border-violet-500/10`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {s.avatar ? (
                            <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`${t.textMain} text-xs font-bold truncate`}>{s.name}</p>
                          <p className={`${t.textMuted} text-[9px]`}>{s.role || 'Curador'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddMember(s.userId, s.name, s.role)}
                        disabled={isSubmittingAdd}
                        className="px-2.5 py-1 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-[10px] font-bold shadow-xs transition-all flex items-center gap-1 flex-shrink-0"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Entrar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-violet-500/15 space-y-2">
              <p className={`${t.textMuted} text-[10px] uppercase font-bold tracking-wider`}>
                Ou Digitar Nome de Novo Colega:
              </p>
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Ex: Mariana Costa"
                className="w-full p-2.5 rounded-xl bg-slate-900/90 dark:bg-black/60 text-white placeholder:text-slate-400 text-xs outline-none focus:ring-1 focus:ring-fuchsia-500 border border-violet-500/30"
              />

              <div className="space-y-1">
                <p className={`${t.textMuted} text-[10px] font-medium`}>Função Pedagógica na Mesa:</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Curador', 'Revisor', 'Comunicador'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewStudentRole(role)}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        newStudentRole === role
                          ? 'bg-fuchsia-500 text-white shadow-xs'
                          : `${t.cardSub} ${t.textMuted} hover:brightness-95`
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleAddMember(undefined, newStudentName, newStudentRole)}
                disabled={isSubmittingAdd || !newStudentName.trim()}
                className={`w-full py-2.5 rounded-xl text-xs font-bold text-white ${t.primaryGrad} shadow-md hover:brightness-110 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-1.5`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirmar Entrada na Mesa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
