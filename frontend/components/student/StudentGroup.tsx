'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  RefreshCcw,
  UserPlus,
  LogOut,
  Shield,
  X,
  Check,
  User,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '@/frontend/context/ThemeContext';
import { useAuth } from '@/frontend/context/AuthContext';

interface StudentGroupProps {
  sharedGroup: any;
  quizzes?: any[];
  quizStats?: any;
  notebooks?: any[];
  onDataChange: () => void;
  onGoToQuiz?: () => void;
}

export function StudentGroup({
  sharedGroup,
  quizzes = [],
  quizStats,
  notebooks,
  onDataChange,
  onGoToQuiz
}: StudentGroupProps) {
  const { theme: t } = useTheme();
  const { user } = useAuth();

  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentRole, setNewStudentRole] = useState<'Curador' | 'Revisor' | 'Comunicador'>('Curador');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const rawMembers: any[] = sharedGroup?.members || [];

  const isCurrentUserInGroup = Boolean(
    sharedGroup &&
    rawMembers.length > 0 &&
    rawMembers.some((m: any) => m.userId === user?.id || (m.userId === undefined && m.isMe))
  );

  const membersList = rawMembers.map((m: any, idx: number) => {
    const isMe = m.userId === user?.id || (m.userId === undefined && m.isMe);
    return {
      id: m.userId || m.id || idx + 1,
      userId: m.userId || m.id || idx + 1,
      name: m.name || 'Estudante',
      role: m.role || 'Curador',
      pts: m.points ?? m.pts ?? 0,
      isMe,
      isCurrentDeviceHolder: Boolean(m.isCurrentDeviceHolder)
    };
  });

  const isTableFull = membersList.length >= 4;
  const availableStudents: any[] = sharedGroup?.availableStudents || [];

  const holdingMember = membersList.find((m) => m.isCurrentDeviceHolder) || membersList[0] || {
    id: 1,
    userId: 1,
    name: 'Estudante',
    role: 'Curador',
    pts: 0,
    isMe: false,
    isCurrentDeviceHolder: true
  };

  const handleRotateDevice = async (targetUserId?: number) => {
    if (isRotating || !sharedGroup?.id) return;
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
    if (isSubmittingAdd || !sharedGroup?.id) return;
    if (isTableFull) {
      setActionError('A mesa já atingiu a capacidade máxima de 4 alunos.');
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
      setActionError('Não foi possível adicionar o estudante.');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!sharedGroup?.id || !user?.id) return;
    setActionError(null);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch(`/api/groups/members?groupId=${sharedGroup.id}&userId=${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Erro ao sair da mesa.');
        return;
      }

      onDataChange();
    } catch {
      setActionError('Não foi possível sair da mesa.');
    }
  };

  if (!isCurrentUserInGroup) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[380px] text-center animate-in fade-in">
        <div className={`w-14 h-14 rounded-full ${t.cardSub} flex items-center justify-center mb-3.5 text-slate-400 dark:text-violet-400 border border-violet-500/10 shadow-inner`}>
          <Smartphone className="w-6 h-6 opacity-40" />
        </div>
        <h3 className={`${t.textMain} font-bold text-sm mb-1`}>Nenhuma mesa vinculada</h3>
        <p className={`${t.textMuted} text-xs max-w-[240px] leading-relaxed`}>
          Você não está em nenhuma mesa no momento. Aguarde o professor adicionar você a um grupo.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 animate-in fade-in pb-24">
      {actionError && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-rose-500 text-xs">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-rose-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`${t.textMain} text-2xl font-black tracking-tight`}>Aparelho Compartilhado</h2>
          <p className={`${t.textMuted} text-xs mt-1 flex items-center gap-1.5`}>
            <Smartphone className="w-3.5 h-3.5" /> 1 Celular • {membersList.length} Estudantes
          </p>
        </div>
        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Sincronizado
        </span>
      </div>

      <div className={`p-4 rounded-[24px] ${holdingMember.isMe ? 'bg-fuchsia-50 border-fuchsia-100 dark:bg-fuchsia-900/20 dark:border-fuchsia-800/50' : `${t.cardSub} border-transparent`} border transition-colors duration-500 mb-8 flex items-center justify-between shadow-sm`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full shadow-md shrink-0 ring-2 ring-fuchsia-400 bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white font-black text-base flex items-center justify-center select-none">
            {(holdingMember.name || 'E').trim().charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={`${t.textMuted} text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1`}>
              <Smartphone className="w-3 h-3 text-fuchsia-500" /> Posse Atual
            </p>
            <h3 className={`${t.textMain} font-bold text-sm leading-tight`}>
              {holdingMember.name} {holdingMember.isMe && <span className="text-fuchsia-500">(Você)</span>}
            </h3>
          </div>
        </div>
        <button
          onClick={() => handleRotateDevice()}
          disabled={isRotating}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1242] shadow-sm flex items-center justify-center text-fuchsia-500 hover:scale-105 active:scale-95 transition-transform"
        >
          <RefreshCcw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className={`${t.card} rounded-3xl p-4 border border-violet-500/20 mb-6 space-y-2.5 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-500 flex items-center justify-center">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
            <h3 className={`${t.textMain} font-bold text-xs`}>Desafios Coletivos da Mesa</h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">
            {quizzes.filter((q: any) => !q.completed).length > 0
              ? `${quizzes.filter((q: any) => !q.completed).length} Pendente(s)`
              : 'Em dia ✓'}
          </span>
        </div>

        {quizzes.some((q: any) => !q.completed) ? (
          <div className={`p-3 rounded-2xl ${t.cardSub} space-y-2 border border-amber-500/20`}>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Novo Desafio Postado
              </span>
              <span className="font-mono text-violet-500 font-bold">
                {quizzes.find((q: any) => !q.completed)?.bnccCode || 'BNCC'}
              </span>
            </div>
            <p className={`${t.textMain} text-xs font-medium line-clamp-2`}>
              {quizzes.find((q: any) => !q.completed)?.question}
            </p>
            <button
              onClick={onGoToQuiz}
              className={`w-full py-2 rounded-xl text-xs font-bold text-white ${t.primaryGrad} shadow-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5`}
            >
              <span>Resolver Desafio da Mesa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              ✓ Quizzes da mesa concluídos!
            </p>
            <p className={`${t.textMuted} text-[10px] mt-0.5`}>
              Aguarde o professor postar novas atividades para a turma.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end mb-4">
        <h3 className={`${t.textMain} text-xs font-bold uppercase tracking-wider`}>Integrantes da Mesa</h3>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (isTableFull) {
                setActionError('A mesa já atingiu a capacidade máxima de 4 alunos.');
              } else {
                setIsAddModalOpen(true);
              }
            }}
            className={`${t.textMuted} hover:text-fuchsia-500 flex items-center gap-1 text-[10px] font-bold transition-colors`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Adicionar
          </button>
          <button
            onClick={handleLeaveGroup}
            className={`${t.textMuted} hover:text-red-500 flex items-center gap-1 text-[10px] font-bold transition-colors`}
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {membersList.map((m) => {
          const isHolding = m.isCurrentDeviceHolder;
          return (
            <div
              key={m.id}
              onClick={() => handleRotateDevice(m.userId)}
              className={`cursor-pointer relative p-4 rounded-[28px] border transition-all duration-300 flex flex-col items-center text-center ${
                isHolding
                  ? 'bg-fuchsia-50/80 border-fuchsia-200 dark:bg-fuchsia-900/20 dark:border-fuchsia-700/50 shadow-sm transform scale-[1.02]'
                  : `${t.card} border-transparent hover:border-violet-200 dark:hover:border-violet-800`
              }`}
            >
              {isHolding && (
                <div className="absolute top-3 right-3 w-4 h-4 bg-fuchsia-500 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}

              <div className={`w-14 h-14 rounded-full mb-3 shadow-md ring-4 transition-all duration-300 shrink-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white font-black text-xl flex items-center justify-center select-none ${
                isHolding ? 'ring-fuchsia-400 dark:ring-fuchsia-500 scale-105' : 'ring-transparent'
              }`}>
                {(m.name || 'E').trim().charAt(0).toUpperCase()}
              </div>

              <h4 className={`${t.textMain} font-bold text-xs leading-tight mb-0.5 truncate w-full`}>
                {m.name}
              </h4>
              <span className={`${t.textMuted} text-[10px] font-medium mb-3`}>
                {m.role}
              </span>

              <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold w-full transition-colors ${
                isHolding
                  ? 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-[#130b2e] dark:text-violet-300'
              }`}>
                {m.pts} pts {isHolding && <span className="opacity-70 ml-0.5">+10</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${t.cardSub} rounded-[20px] p-3.5 border border-transparent flex items-center justify-between text-[10px] shadow-sm`}>
        <span className={`flex items-center gap-1.5 ${t.textMuted} font-medium`}>
          <Shield className="w-3.5 h-3.5 text-emerald-500" /> Regra Fair Sync
        </span>
        <span className={`${t.textMain} font-bold`}>+50 coletivo / +10 ao segurar</span>
      </div>

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
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white text-xs font-bold flex-shrink-0 flex items-center justify-center select-none shadow-xs">
                          {(s.name || 'E').trim().charAt(0).toUpperCase()}
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
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs outline-none focus:ring-1 focus:ring-fuchsia-500 border border-slate-200 dark:border-violet-800/60"
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
