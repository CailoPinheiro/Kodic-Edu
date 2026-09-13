'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  UserMinus,
  Smartphone,
  ArrowRightLeft,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  X,
  RefreshCw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface TeacherGroupsProps {
  currentClass: any;
  onDataChange: () => void;
}

export function TeacherGroups({ currentClass, onDataChange }: TeacherGroupsProps) {
  const { isDarkMode, theme: t } = useTheme();

  const [groups, setGroups] = useState<any[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [allocatedCount, setAllocatedCount] = useState<number>(0);
  const [unallocatedCount, setUnallocatedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'groups' | 'students'>('groups');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupType, setNewGroupType] = useState<string>('Oficial da Disciplina');
  const [newGroupObjective, setNewGroupObjective] = useState<string>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [newDeviceHolderId, setNewDeviceHolderId] = useState<number | null>(null);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState<boolean>(false);

  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editType, setEditType] = useState<string>('');
  const [editObjective, setEditObjective] = useState<string>('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);

  const [addMemberTargetGroup, setAddMemberTargetGroup] = useState<any | null>(null);
  const [selectedAddStudentId, setSelectedAddStudentId] = useState<number | null>(null);
  const [selectedAddRole, setSelectedAddRole] = useState<string>('Curador');
  const [isSubmittingAddMember, setIsSubmittingAddMember] = useState<boolean>(false);

  const [deletingGroupId, setDeletingGroupId] = useState<number | null>(null);

  const loadGroupsData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const classId = currentClass?.id || 1;
      const res = await fetch(`/api/groups?classId=${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setGroups(data.groups || []);
        setEnrolledStudents(data.enrolledStudents || []);
        setAllocatedCount(data.allocatedCount || 0);
        setUnallocatedCount(data.unallocatedCount || 0);
      }
    } catch {
      setActionError('Falha ao carregar grupos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroupsData();
  }, [currentClass]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      setActionError('Informe o nome do grupo.');
      return;
    }
    if (selectedStudentIds.length > 4) {
      setActionError('Máximo de 4 alunos por mesa.');
      return;
    }

    setIsSubmittingCreate(true);
    setActionError(null);

    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          classId: currentClass?.id || 1,
          name: newGroupName.trim(),
          groupType: newGroupType,
          objective: newGroupObjective.trim() || 'Estudo prático com materiais curriculares.',
          memberIds: selectedStudentIds,
          currentDeviceHolderId: newDeviceHolderId || (selectedStudentIds.length > 0 ? selectedStudentIds[0] : null)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Erro ao criar grupo.');
        return;
      }

      setActionSuccess(`Mesa "${newGroupName}" criada!`);
      setIsCreateModalOpen(false);
      setNewGroupName('');
      setNewGroupObjective('');
      setSelectedStudentIds([]);
      setNewDeviceHolderId(null);
      await loadGroupsData();
      onDataChange();
    } catch {
      setActionError('Erro de conexão.');
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleOpenEdit = (group: any) => {
    setEditingGroup(group);
    setEditName(group.name);
    setEditType(group.groupType);
    setEditObjective(group.objective || '');
    setActionError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup || !editName.trim()) return;

    setIsSubmittingEdit(true);
    setActionError(null);

    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/groups', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupId: editingGroup.id,
          name: editName.trim(),
          groupType: editType,
          objective: editObjective.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Erro ao atualizar.');
        return;
      }

      setActionSuccess('Grupo atualizado com sucesso!');
      setEditingGroup(null);
      await loadGroupsData();
      onDataChange();
    } catch {
      setActionError('Erro ao atualizar.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch(`/api/groups?groupId=${groupId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Erro ao excluir.');
        return;
      }

      setActionSuccess('Grupo excluído.');
      setDeletingGroupId(null);
      await loadGroupsData();
      onDataChange();
    } catch {
      setActionError('Erro ao excluir grupo.');
    }
  };

  const handleRemoveMember = async (groupId: number, userId: number, userName: string) => {
    setActionError(null);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch(`/api/groups/members?groupId=${groupId}&userId=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Erro ao remover aluno.');
        return;
      }

      setActionSuccess(`${userName} removido(a) da mesa.`);
      await loadGroupsData();
      onDataChange();
    } catch {
      setActionError('Erro ao remover aluno.');
    }
  };

  const handleAddMemberToGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMemberTargetGroup || !selectedAddStudentId) return;

    if (addMemberTargetGroup.members.length >= 4) {
      setActionError('A mesa já atingiu a capacidade máxima (4 alunos).');
      return;
    }

    setIsSubmittingAddMember(true);
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
          groupId: addMemberTargetGroup.id,
          userId: selectedAddStudentId,
          role: selectedAddRole
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Erro ao adicionar aluno.');
        return;
      }

      setActionSuccess('Aluno adicionado com sucesso!');
      setAddMemberTargetGroup(null);
      setSelectedAddStudentId(null);
      await loadGroupsData();
      onDataChange();
    } catch {
      setActionError('Erro ao adicionar aluno.');
    } finally {
      setIsSubmittingAddMember(false);
    }
  };

  const handleChangeRole = async (groupId: number, userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/groups/members', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groupId, userId, role: newRole })
      });

      if (res.ok) {
        await loadGroupsData();
        onDataChange();
      }
    } catch {}
  };

  const handleRotateDevice = async (groupId: number, targetUserId: number) => {
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/groups/rotate-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groupId, targetUserId })
      });

      if (res.ok) {
        await loadGroupsData();
        onDataChange();
      }
    } catch {}
  };

  const toggleStudentSelection = (id: number) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds((prev) => prev.filter((sId) => sId !== id));
      if (newDeviceHolderId === id) {
        const remaining = selectedStudentIds.filter((sId) => sId !== id);
        setNewDeviceHolderId(remaining.length > 0 ? remaining[0] : null);
      }
    } else {
      if (selectedStudentIds.length >= 4) {
        setActionError('Limite máximo de 4 alunos atingido.');
        return;
      }
      setSelectedStudentIds((prev) => [...prev, id]);
      if (!newDeviceHolderId) {
        setNewDeviceHolderId(id);
      }
    }
  };

  const filteredGroups = groups.filter((g) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      g.name.toLowerCase().includes(q) ||
      (g.objective || '').toLowerCase().includes(q) ||
      g.members.some((m: any) => m.name.toLowerCase().includes(q))
    );
  });

  const filteredStudents = enrolledStudents.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-3.5 animate-in fade-in pb-4 max-w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className={`${t.textMain} font-bold text-sm flex items-center gap-1.5 truncate`}>
            <Users className="w-4 h-4 text-violet-500 shrink-0" />
            <span>Mesas de Estudo</span>
          </h2>
          <p className={`${t.textMuted} text-[10px] truncate`}>
            {groups.length} {groups.length === 1 ? 'mesa ativa' : 'mesas ativas'} • {allocatedCount} alunos
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => loadGroupsData()}
            title="Atualizar"
            className={`p-1.5 rounded-lg border ${isDarkMode ? 'border-violet-800 hover:bg-white/5' : 'border-violet-200 hover:bg-slate-100'} ${t.textMuted}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setActionError(null);
              setIsCreateModalOpen(true);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-white ${t.primaryGrad} shadow-xs hover:brightness-110 flex items-center gap-1 shrink-0`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Mesa</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1.5 p-2 rounded-2xl bg-violet-500/10 border border-violet-500/15 text-[10px] font-bold">
        <span className="text-violet-600 dark:text-violet-300">
          {groups.length} {groups.length === 1 ? 'Mesa' : 'Mesas'}
        </span>
        <span className={`${t.textMuted}`}>•</span>
        <span className="text-emerald-500">
          {allocatedCount}/{enrolledStudents.length} Alocados
        </span>
        <span className={`${t.textMuted}`}>•</span>
        <span className={unallocatedCount > 0 ? 'text-amber-500 font-black' : t.textMuted}>
          {unallocatedCount} Livres
        </span>
      </div>

      {actionError && (
        <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="p-0.5 shrink-0">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="p-0.5 shrink-0">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl">
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'groups'
                ? `${t.primaryGrad} text-white shadow-xs`
                : `${t.textMuted}`
            }`}
          >
            Mesas ({groups.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'students'
                ? `${t.primaryGrad} text-white shadow-xs`
                : `${t.textMuted}`
            }`}
          >
            Alunos ({enrolledStudents.length})
          </button>
        </div>

        <div className="relative flex-1 max-w-[140px]">
          <Search className={`w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 ${t.textMuted}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar..."
            className={`w-full pl-7 pr-2 py-1 rounded-lg ${t.cardSub} ${t.textMain} text-[10px] outline-none border ${isDarkMode ? 'border-violet-800' : 'border-violet-200'}`}
          />
        </div>
      </div>

      {activeTab === 'groups' && (
        <div className="space-y-3">
          {filteredGroups.length === 0 ? (
            <div className={`${t.card} p-6 rounded-2xl text-center border-dashed border ${isDarkMode ? 'border-violet-800' : 'border-violet-200'}`}>
              <Users className={`w-8 h-8 mx-auto mb-2 ${t.textMuted} opacity-40`} />
              <p className={`${t.textMain} font-bold text-xs`}>Nenhuma mesa encontrada</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className={`mt-2.5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white ${t.primaryGrad} inline-flex items-center gap-1`}
              >
                <Plus className="w-3 h-3" />
                <span>Criar Mesa</span>
              </button>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isFull = group.memberCount >= 4;
              const hasAvailableSlot = group.memberCount < 4;

              return (
                <div
                  key={group.id}
                  className={`${t.card} rounded-2xl p-3 border transition-colors border-violet-500/20 space-y-2.5`}
                >
                  <div className="flex items-start justify-between gap-2 border-b pb-2 border-violet-500/10">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className={`${t.textMain} font-bold text-xs truncate max-w-[170px]`}>
                          {group.name}
                        </h3>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                          isFull
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-violet-500/15 text-violet-600 dark:text-violet-300'
                        }`}>
                          {group.memberCount}/4 {isFull ? 'Cheia' : 'Vagas'}
                        </span>
                      </div>
                      {group.objective && (
                        <p className={`${t.textMuted} text-[10px] truncate mt-0.5`}>
                          <BookOpen className="w-2.5 h-2.5 inline mr-1 text-violet-400" />
                          {group.objective}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(group)}
                        title="Editar nome"
                        className="p-1 rounded-lg text-violet-500 hover:bg-violet-500/10"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (deletingGroupId === group.id) {
                            handleDeleteGroup(group.id);
                          } else {
                            setDeletingGroupId(group.id);
                          }
                        }}
                        title={deletingGroupId === group.id ? 'Confirmar exclusão?' : 'Excluir mesa'}
                        className={`p-1 rounded-lg transition-all ${
                          deletingGroupId === group.id
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'text-rose-500 hover:bg-rose-500/10'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {group.members.length === 0 ? (
                      <p className={`${t.textMuted} text-[10px] text-center py-2`}>
                        Mesa vazia. Adicione alunos abaixo.
                      </p>
                    ) : (
                      group.members.map((member: any) => {
                        const isHolder = Boolean(member.isCurrentDeviceHolder);

                        return (
                          <div
                            key={member.userId}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                              isHolder
                                ? 'border-fuchsia-500/40 bg-fuchsia-500/10'
                                : `${t.cardSub} border-violet-500/10`
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${
                                isHolder ? t.primaryGrad : 'bg-slate-300 dark:bg-slate-700'
                              }`}>
                                {member.avatar ? (
                                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[10px] font-bold text-white">{member.name.charAt(0)}</span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                  <p className={`${t.textMain} text-[11px] font-bold truncate`}>
                                    {member.name}
                                  </p>
                                  {isHolder && (
                                    <span className="text-[8px] font-black text-fuchsia-500 bg-fuchsia-500/15 px-1 py-0.2 rounded shrink-0">
                                      POSSE
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <select
                                    value={member.role || 'Curador'}
                                    onChange={(e) => handleChangeRole(group.id, member.userId, e.target.value)}
                                    className="bg-violet-500/15 text-violet-600 dark:text-violet-300 text-[9px] font-bold rounded px-1 py-0.2 border-none outline-none cursor-pointer"
                                  >
                                    <option value="Curador">Curador</option>
                                    <option value="Revisor">Revisor</option>
                                    <option value="Comunicador">Comunicador</option>
                                  </select>
                                  <span className="text-[9px] font-black text-emerald-500">
                                    {member.points} pts
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {!isHolder && (
                                <button
                                  onClick={() => handleRotateDevice(group.id, member.userId)}
                                  title="Dar celular a este aluno"
                                  className="p-1 rounded-md text-[9px] font-bold text-violet-500 bg-violet-500/10 hover:bg-violet-500/20"
                                >
                                  <ArrowRightLeft className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={() => handleRemoveMember(group.id, member.userId, member.name)}
                                title="Remover da mesa"
                                className="p-1 rounded-md text-rose-500 hover:bg-rose-500/10"
                              >
                                <UserMinus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {hasAvailableSlot ? (
                    <button
                      onClick={() => {
                        setAddMemberTargetGroup(group);
                        setSelectedAddStudentId(null);
                        setSelectedAddRole('Curador');
                        setActionError(null);
                      }}
                      className="w-full py-1.5 rounded-xl border border-dashed border-violet-500/30 text-violet-500 hover:bg-violet-500/10 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Adicionar Aluno ({group.memberCount}/4)</span>
                    </button>
                  ) : (
                    <div className="text-center py-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 rounded-lg">
                      Mesa Completa (4 Alunos)
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-2">
          {filteredStudents.map((student) => {
            const hasGroup = student.isInGroup;

            return (
              <div
                key={student.userId}
                className={`p-2.5 rounded-2xl border ${t.card} border-violet-500/10 flex items-center justify-between gap-2`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-500 text-xs font-bold shrink-0 overflow-hidden">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                    ) : (
                      student.name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`${t.textMain} text-[11px] font-bold truncate`}>{student.name}</p>
                    <span className="text-[9px] text-violet-500 font-semibold">{student.role} • {student.points} pts</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {hasGroup ? (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 block truncate max-w-[120px]">
                      {student.assignedGroups[0]?.groupName || 'Em Mesa'}
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      Livre
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className={`${t.card} w-full max-w-[350px] rounded-3xl p-4 border shadow-2xl space-y-3 max-h-[85vh] overflow-y-auto custom-scrollbar`}>
            <div className="flex items-center justify-between pb-2 border-b border-violet-500/10">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <h3 className={`${t.textMain} font-bold text-xs`}>Criar Mesa na Hora</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-2.5">
              <div>
                <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                  Nome da Mesa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mesa 2 — Biomas"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={`w-full p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border ${isDarkMode ? 'border-violet-800' : 'border-violet-200'}`}
                />
              </div>

              <div>
                <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                  Objetivo Curricular
                </label>
                <input
                  type="text"
                  placeholder="Ex: Análise de fontes e redação"
                  value={newGroupObjective}
                  onChange={(e) => setNewGroupObjective(e.target.value)}
                  className={`w-full p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border ${isDarkMode ? 'border-violet-800' : 'border-violet-200'}`}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`${t.textMain} text-[10px] font-bold`}>
                    Alunos ({selectedStudentIds.length}/4)
                  </label>
                  <span className="text-[9px] text-violet-500 font-bold">Máx. 4</span>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar p-0.5">
                  {enrolledStudents.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.userId);
                    return (
                      <div
                        key={student.userId}
                        onClick={() => toggleStudentSelection(student.userId)}
                        className={`p-1.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-violet-500 bg-violet-500/15'
                            : `${t.cardSub} border-transparent hover:border-violet-500/20`
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={`${t.textMain} text-[11px] font-bold truncate`}>{student.name}</p>
                          <span className={`${t.textMuted} text-[9px]`}>{student.role} {student.isInGroup ? '• em mesa' : ''}</span>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-400'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-violet-500/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold ${t.cardSub} ${t.textMuted}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate || !newGroupName.trim()}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold text-white ${t.primaryGrad} shadow-xs disabled:opacity-50`}
                >
                  {isSubmittingCreate ? 'Criando...' : 'Criar Mesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className={`${t.card} w-full max-w-[340px] rounded-3xl p-4 border shadow-2xl space-y-3`}>
            <div className="flex items-center justify-between pb-2 border-b border-violet-500/10">
              <h3 className={`${t.textMain} font-bold text-xs`}>Editar Mesa</h3>
              <button onClick={() => setEditingGroup(null)} className="p-1 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-2.5">
              <div>
                <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                  Nome da Mesa *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border ${isDarkMode ? 'border-violet-800' : 'border-violet-200'}`}
                />
              </div>

              <div>
                <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                  Objetivo
                </label>
                <input
                  type="text"
                  value={editObjective}
                  onChange={(e) => setEditObjective(e.target.value)}
                  className={`w-full p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border ${isDarkMode ? 'border-violet-800' : 'border-violet-200'}`}
                />
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-violet-500/10">
                <button
                  type="button"
                  onClick={() => setEditingGroup(null)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold ${t.cardSub} ${t.textMuted}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit || !editName.trim()}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold text-white ${t.primaryGrad} shadow-xs disabled:opacity-50`}
                >
                  {isSubmittingEdit ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addMemberTargetGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className={`${t.card} w-full max-w-[340px] rounded-3xl p-4 border shadow-2xl space-y-3`}>
            <div className="flex items-center justify-between pb-2 border-b border-violet-500/10">
              <div>
                <h3 className={`${t.textMain} font-bold text-xs`}>Adicionar Aluno</h3>
                <p className={`${t.textMuted} text-[9px] truncate max-w-[200px]`}>
                  Mesa: {addMemberTargetGroup.name}
                </p>
              </div>
              <button onClick={() => setAddMemberTargetGroup(null)} className="p-1 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberToGroup} className="space-y-2.5">
              <div>
                <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                  Selecione o Aluno
                </label>
                <select
                  required
                  value={selectedAddStudentId || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSelectedAddStudentId(val);
                    const s = enrolledStudents.find((st) => st.userId === val);
                    if (s) setSelectedAddRole(s.role || 'Curador');
                  }}
                  className={`w-full p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border ${isDarkMode ? 'border-violet-800' : 'border-violet-200'}`}
                >
                  <option value="">-- Escolher aluno --</option>
                  {enrolledStudents
                    .filter((s) => !addMemberTargetGroup.members.some((m: any) => m.userId === s.userId))
                    .map((s) => (
                      <option key={s.userId} value={s.userId}>
                        {s.name} ({s.role}) {s.isInGroup ? '• já em mesa' : ''}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                  Função Pedagógica
                </label>
                <select
                  value={selectedAddRole}
                  onChange={(e) => setSelectedAddRole(e.target.value)}
                  className={`w-full p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border ${isDarkMode ? 'border-violet-800' : 'border-violet-200'}`}
                >
                  <option value="Curador">Curador</option>
                  <option value="Revisor">Revisor</option>
                  <option value="Comunicador">Comunicador</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-violet-500/10">
                <button
                  type="button"
                  onClick={() => setAddMemberTargetGroup(null)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold ${t.cardSub} ${t.textMuted}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAddMember || !selectedAddStudentId}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold text-white ${t.primaryGrad} shadow-xs disabled:opacity-50`}
                >
                  {isSubmittingAddMember ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
