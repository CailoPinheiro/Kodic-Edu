'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  BrainCircuit,
  BarChart3,
  Shield,
  Megaphone,
  Plus,
  CheckSquare,
  CheckCircle2,
  Users,
  Edit3,
  UserPlus,
  Trash2,
  GraduationCap,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { useTheme } from '@/frontend/context/ThemeContext';
import { TeacherGroups } from './TeacherGroups';

interface TeacherDashboardProps {
  currentClass: any;
  onDataChange: () => void;
}

export function TeacherDashboard({ currentClass, onDataChange }: TeacherDashboardProps) {
  const { isDarkMode, theme: t } = useTheme();

  const [teacherTab, setTeacherTab] = useState<'visao_geral' | 'grupos' | 'bncc' | 'heatmap' | 'moderacao'>('visao_geral');
  const [bnccStep, setBnccStep] = useState<'list' | 'select' | 'generating' | 'preview' | 'manual'>('list');
  const [selectedSkill, setSelectedSkill] = useState<string>('EM13CHS202');
  const [draftQuiz, setDraftQuiz] = useState<any>(null);

  const [manualQuestion, setManualQuestion] = useState<string>('');
  const [manualSubject, setManualSubject] = useState<string>('Geografia');
  const [manualBncc, setManualBncc] = useState<string>('EM13CHS202');
  const [manualOptions, setManualOptions] = useState<string[]>(['', '', '', '']);
  const [manualCorrectIndex, setManualCorrectIndex] = useState<number>(0);

  const [bnccCatalog, setBnccCatalog] = useState<any[]>([]);
  const [publishedQuizzes, setPublishedQuizzes] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [moderationQueue, setModerationQueue] = useState<any[]>([]);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState<boolean>(false);
  const [annTitle, setAnnTitle] = useState<string>('');
  const [annDesc, setAnnDesc] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const [classTeachers, setClassTeachers] = useState<any[]>([]);
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedTeacherRole, setSelectedTeacherRole] = useState<string>('Professor Co-docente');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isSubmittingMember, setIsSubmittingMember] = useState<boolean>(false);
  const [memberFeedback, setMemberFeedback] = useState<string | null>(null);

  const loadTeacherData = async () => {
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const headers = { Authorization: `Bearer ${token}` };
      const classId = currentClass?.id || 1;

      const [catalogRes, quizzesRes, heatmapRes, modRes, annRes, membersRes] = await Promise.all([
        fetch('/api/quizzes/bncc-catalog', { headers }).then((r) => r.json()).catch(() => ({ skills: [] })),
        fetch('/api/quizzes', { headers }).then((r) => r.json()).catch(() => ({ quizzes: [] })),
        fetch(`/api/content/heatmap?classId=${classId}`, { headers }).then((r) => r.json()).catch(() => ({ heatmap: [] })),
        fetch('/api/content/moderation', { headers }).then((r) => r.json()).catch(() => ({ queue: [] })),
        fetch('/api/content/announcements', { headers }).then((r) => r.json()).catch(() => ({ announcements: [] })),
        fetch(`/api/classes/members?classId=${classId}`, { headers }).then((r) => r.json()).catch(() => ({ teachers: [], students: [], availableTeachers: [], availableStudents: [] }))
      ]);

      setBnccCatalog(catalogRes.skills || []);
      setPublishedQuizzes(quizzesRes.quizzes || []);
      setHeatmapData(heatmapRes.heatmap || []);
      setModerationQueue(modRes.queue || []);

      const anns = annRes.announcements || [];
      setAnnouncements(anns);
      if (anns.length > 0) {
        setAnnTitle(anns[0].title || '');
        setAnnDesc(anns[0].desc || '');
      }

      setClassTeachers(membersRes.teachers || []);
      setClassStudents(membersRes.students || []);
      setAvailableTeachers(membersRes.availableTeachers || []);
      setAvailableStudents(membersRes.availableStudents || []);
    } catch {}
  };

  useEffect(() => {
    loadTeacherData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedSkill) return;
    setBnccStep('generating');

    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/quizzes/generate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bnccCode: selectedSkill })
      });
      const data = await res.json();
      setDraftQuiz(data.quiz);
      setBnccStep('preview');
    } catch {
      setBnccStep('select');
    }
  };

  const handlePublishQuiz = async () => {
    if (!draftQuiz || isPublishing) return;
    setIsPublishing(true);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          classId: currentClass?.id || 1,
          subject: draftQuiz.subject || 'Geografia',
          bnccCode: draftQuiz.bnccCode || selectedSkill,
          question: draftQuiz.question,
          options: draftQuiz.options,
          correctIndex: draftQuiz.correctIndex,
          pointsReward: draftQuiz.pointsReward || 50,
          isAiGenerated: 1
        })
      });

      const data = await res.json();
      const created = data?.quiz || { ...draftQuiz, id: Date.now() };

      setPublishedQuizzes((prev) => [created, ...prev]);
      setBnccStep('list');
      setSelectedSkill('');
      setDraftQuiz(null);
      onDataChange();
      loadTeacherData();
    } catch {
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublishManualQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuestion.trim() || manualOptions.some((o) => !o.trim()) || isPublishing) return;
    setIsPublishing(true);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          classId: currentClass?.id || 1,
          subject: manualSubject,
          bnccCode: manualBncc,
          question: manualQuestion.trim(),
          options: manualOptions.map((o) => o.trim()),
          correctIndex: manualCorrectIndex,
          pointsReward: 50,
          isAiGenerated: 0
        })
      });

      const data = await res.json();
      const created = data?.quiz || {
        id: Date.now(),
        question: manualQuestion,
        bnccCode: manualBncc,
        subject: manualSubject
      };

      setPublishedQuizzes((prev) => [created, ...prev]);
      setBnccStep('list');
      setManualQuestion('');
      setManualOptions(['', '', '', '']);
      setManualCorrectIndex(0);
      onDataChange();
      loadTeacherData();
    } catch {
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublishAnnouncement = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!annDesc.trim()) return;
    setIsPublishing(true);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const activeAnn = announcements[0];

      if (isEditingAnnouncement && activeAnn?.id) {
        await fetch('/api/content/announcements', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            id: activeAnn.id,
            title: annTitle.trim() || 'Aviso da Coordenação & Professores',
            desc: annDesc.trim()
          })
        });
      } else {
        await fetch('/api/content/announcements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            classId: currentClass?.id || 1,
            tag: 'COMUNICADO DOCENTE',
            title: annTitle.trim() || 'Aviso da Coordenação & Professores',
            desc: annDesc.trim()
          })
        });
      }

      setIsEditingAnnouncement(false);
      onDataChange();
      await loadTeacherData();
    } catch {
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddTeacher = async () => {
    if (!selectedTeacherId) return;
    setIsSubmittingMember(true);
    setMemberFeedback(null);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/classes/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'add_teacher',
          classId: currentClass?.id || 1,
          teacherId: Number(selectedTeacherId),
          roleTitle: selectedTeacherRole
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMemberFeedback(data.error || 'Erro ao associar professor.');
      } else {
        setSelectedTeacherId('');
        setMemberFeedback('Professor associado à sala com sucesso!');
        await loadTeacherData();
        onDataChange();
      }
    } catch {
      setMemberFeedback('Erro na requisição ao associar professor.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleRemoveTeacher = async (teacherId: number) => {
    setIsSubmittingMember(true);
    setMemberFeedback(null);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/classes/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'remove_teacher',
          classId: currentClass?.id || 1,
          teacherId
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMemberFeedback(data.error || 'Erro ao desvincular professor.');
      } else {
        setMemberFeedback('Professor desvinculado da sala.');
        await loadTeacherData();
        onDataChange();
      }
    } catch {
      setMemberFeedback('Erro na requisição.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedStudentId) return;
    setIsSubmittingMember(true);
    setMemberFeedback(null);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/classes/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'add_student',
          classId: currentClass?.id || 1,
          studentId: Number(selectedStudentId)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMemberFeedback(data.error || 'Erro ao matricular estudante.');
      } else {
        setSelectedStudentId('');
        setMemberFeedback('Estudante matriculado na sala com sucesso!');
        await loadTeacherData();
        onDataChange();
      }
    } catch {
      setMemberFeedback('Erro na requisição.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    setIsSubmittingMember(true);
    setMemberFeedback(null);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/classes/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'remove_student',
          classId: currentClass?.id || 1,
          studentId
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMemberFeedback(data.error || 'Erro ao desvincular estudante.');
      } else {
        setMemberFeedback('Estudante desvinculado da sala.');
        await loadTeacherData();
        onDataChange();
      }
    } catch {
      setMemberFeedback('Erro na requisição.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleApproveModeration = async (id: number) => {
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      await fetch(`/api/content/moderation/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setModerationQueue((prev) => prev.filter((item) => item.id !== id));
    } catch {
    }
  };

  const currentPoints = currentClass?.current_points ?? 7620;
  const goalPoints = currentClass?.goal_points ?? 8500;
  const progressPct = Math.min(100, Math.round((currentPoints / goalPoints) * 100));

  return (
    <div className="space-y-4">
      <div className={`px-2 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide border-b ${isDarkMode ? 'border-violet-900/50' : 'border-violet-100'} relative z-10 bg-inherit`}>
        {[
          { id: 'visao_geral', label: 'Geral', icon: Activity },
          { id: 'grupos', label: 'Mesas', icon: Users },
          { id: 'bncc', label: 'QUIZ', icon: BrainCircuit },
          { id: 'heatmap', label: 'Heatmap', icon: BarChart3 },
          { id: 'moderacao', label: 'Moderação', icon: Shield }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTeacherTab(tab.id as any)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
              teacherTab === tab.id
                ? `${t.primaryGrad} text-white shadow-xs`
                : `${t.cardSub} ${t.textMuted}`
            }`}
          >
            <tab.icon className="w-3 h-3" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-3.5 space-y-4 animate-in fade-in pb-20">
        {teacherTab === 'visao_geral' && (
          <>
            <div className={`${t.card} rounded-3xl p-5 border-2 border-fuchsia-500/25 transition-colors relative overflow-hidden`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-fuchsia-500/15 text-fuchsia-500 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className={`${t.textMain} font-bold text-sm`}>Comunicado Oficial Atual</h2>
                    <span className="text-[10px] text-fuchsia-500 font-medium">Mural da Turma Ativo</span>
                  </div>
                </div>
                {!isEditingAnnouncement && announcements.length > 0 && (
                  <button
                    onClick={() => {
                      setAnnTitle(announcements[0]?.title || '');
                      setAnnDesc(announcements[0]?.desc || '');
                      setIsEditingAnnouncement(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold ${t.cardSub} ${t.textMain} hover:border-fuchsia-500 border border-violet-500/20 flex items-center gap-1.5 transition-all`}
                  >
                    <Edit3 className="w-3 h-3 text-fuchsia-500" />
                    <span>Mudar Comunicado</span>
                  </button>
                )}
              </div>

              {!isEditingAnnouncement && announcements.length > 0 ? (
                <div className={`p-4 rounded-2xl ${t.cardSub} border border-violet-500/15 space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-500 uppercase tracking-wider">
                      {announcements[0]?.tag || 'COMUNICADO DOCENTE'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {announcements[0]?.created_at ? new Date(announcements[0].created_at).toLocaleDateString('pt-BR') : 'Hoje'}
                    </span>
                  </div>
                  <h3 className={`${t.textMain} text-sm font-bold leading-snug`}>
                    {announcements[0]?.title}
                  </h3>
                  <p className={`${t.textMuted} text-xs leading-relaxed whitespace-pre-line`}>
                    {announcements[0]?.desc}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePublishAnnouncement} className="space-y-3">
                  <div>
                    <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                      Título do Comunicado
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Feira de Ciências & Entrega de Trabalhos"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs outline-none focus:ring-1 focus:ring-fuchsia-500 border border-slate-200 dark:border-violet-500/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                      Mensagem / Aviso para os Alunos *
                    </label>
                    <textarea
                      required
                      value={annDesc}
                      onChange={(e) => setAnnDesc(e.target.value)}
                      placeholder="Escreva a mensagem que aparecerá em destaque no celular de todos os estudantes..."
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs outline-none focus:ring-1 focus:ring-fuchsia-500 resize-none h-24 border border-slate-200 dark:border-violet-500/30 transition-colors"
                    />
                  </div>
                  <div className="flex gap-2">
                    {announcements.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsEditingAnnouncement(false)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${t.cardSub} ${t.textMuted}`}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isPublishing || !annDesc.trim()}
                      className={`flex-[2] py-2.5 rounded-xl font-bold text-white text-xs ${t.primaryGrad} shadow-md hover:brightness-110 transition-all disabled:opacity-50`}
                    >
                      {isPublishing ? 'Publicando...' : 'Salvar e Atualizar Mural'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className={`${t.card} rounded-3xl p-5 border border-violet-500/20 transition-colors space-y-4`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-500 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className={`${t.textMain} font-bold text-sm`}>Gestão da Sala: Professores & Alunos</h2>
                    <p className={`${t.textMuted} text-[10px]`}>
                      {currentClass?.name || '1º Ano A — Ensino Médio'} • Código: <span className="font-mono font-bold text-violet-500">{currentClass?.code || 'GEO-2026'}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase">
                  Sala Conectada
                </span>
              </div>

              {memberFeedback && (
                <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-between text-[11px] text-violet-600 dark:text-violet-300">
                  <span>{memberFeedback}</span>
                  <button onClick={() => setMemberFeedback(null)} className="hover:opacity-75">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${t.textMain} text-xs font-bold uppercase tracking-wider`}>
                    Professores da Sala ({classTeachers.length})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {classTeachers.map((tc: any) => (
                    <div
                      key={tc.id}
                      className={`p-2.5 rounded-xl ${t.cardSub} flex items-center justify-between border border-violet-500/10 text-xs`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {(tc.name || 'P').trim().charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={`${t.textMain} font-bold leading-tight`}>{tc.name}</div>
                          <div className={`${t.textMuted} text-[10px]`}>{tc.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-300">
                          {tc.role_title || (tc.is_primary ? 'Titular' : 'Co-docente')}
                        </span>
                        {!tc.is_primary && (
                          <button
                            onClick={() => handleRemoveTeacher(tc.id)}
                            disabled={isSubmittingMember}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                            title="Desvincular professor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {availableTeachers.length > 0 && (
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <select
                      value={selectedTeacherId}
                      onChange={(e) => setSelectedTeacherId(e.target.value)}
                      className={`flex-1 p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border border-violet-500/20`}
                    >
                      <option value="">Selecionar professor para associar...</option>
                      {availableTeachers.map((at: any) => (
                        <option key={at.id} value={at.id}>
                          {at.name} ({at.email})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={selectedTeacherRole}
                      onChange={(e) => setSelectedTeacherRole(e.target.value)}
                      placeholder="Função (ex: Co-docente)"
                      className={`w-full sm:w-40 p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border border-violet-500/20`}
                    />
                    <button
                      type="button"
                      onClick={handleAddTeacher}
                      disabled={isSubmittingMember || !selectedTeacherId}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-white ${t.primaryGrad} shadow-xs hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-1`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Associar</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-violet-500/10">
                <div className="flex justify-between items-center">
                  <span className={`${t.textMain} text-xs font-bold uppercase tracking-wider`}>
                    Alunos Matriculados ({classStudents.length})
                  </span>
                  <span className="text-[10px] text-violet-500 font-bold">
                    {classStudents.filter((s: any) => s.group_name && s.group_name !== 'Sem Mesa').length} em Mesas
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {classStudents.map((st: any) => (
                    <div
                      key={st.id}
                      className={`p-2 rounded-xl ${t.cardSub} flex items-center justify-between border border-violet-500/10 text-xs`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {(st.name || 'A').trim().charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className={`${t.textMain} font-bold text-[11px] truncate`}>{st.name}</div>
                          <div className={`${t.textMuted} text-[9px] truncate`}>
                            {st.intelligence_role || 'Curador'} • {st.group_name || 'Sem Mesa'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-violet-500">{st.points || 0} pts</span>
                        <button
                          onClick={() => handleRemoveStudent(st.id)}
                          disabled={isSubmittingMember}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                          title="Desmatricular aluno"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {availableStudents.length > 0 && (
                  <div className="pt-2 flex gap-2">
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className={`flex-1 p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border border-violet-500/20`}
                    >
                      <option value="">Selecionar aluno cadastrado para matricular...</option>
                      {availableStudents.map((as: any) => (
                        <option key={as.id} value={as.id}>
                          {as.name} ({as.grade || 'Aluno'})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddStudent}
                      disabled={isSubmittingMember || !selectedStudentId}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-white ${t.primaryGrad} shadow-xs hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-1 shrink-0`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Matricular</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`${t.card} rounded-3xl p-5 relative overflow-hidden transition-colors`}>
              <h2 className={`${t.textMain} font-bold text-sm mb-1`}>
                Meta Coletiva da Turma
              </h2>
              <p className={`${t.textMuted} text-xs mb-3`}>Acompanhamento em tempo real</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-violet-500">{currentPoints.toLocaleString()} pts alcançados</span>
                <span className={t.textMuted}>Meta: {goalPoints.toLocaleString()}</span>
              </div>
            </div>

            <div className={`${t.card} rounded-2xl p-3 border border-violet-500/20 transition-colors flex items-center justify-between gap-2.5`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-500 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className={`${t.textMain} font-bold text-xs truncate`}>
                    Mesas & Grupos
                  </h3>
                  <p className={`${t.textMuted} text-[10px] truncate`}>
                    Organize as mesas e alunos na hora
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTeacherTab('grupos')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold text-white ${t.primaryGrad} shadow-xs hover:brightness-110 transition-all shrink-0`}
              >
                Gerenciar
              </button>
            </div>
          </>
        )}

        {teacherTab === 'grupos' && (
          <TeacherGroups
            currentClass={currentClass}
            onDataChange={onDataChange}
          />
        )}

        {teacherTab === 'bncc' && (
          <>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className={`${t.textMain} font-bold text-base sm:text-lg leading-snug`}>
                  Gerador de Quizzes
                </h2>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-500 dark:text-violet-400 border border-violet-500/30 uppercase tracking-wide whitespace-nowrap flex-shrink-0">
                  BNCC & IA
                </span>
              </div>
              <p className={`${t.textMuted} text-xs leading-relaxed`}>
                Crie desafios manuais ou gere quizzes pedagógicos com inteligência artificial.
              </p>
            </div>

            {bnccStep === 'list' && (
              <>
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  <button
                    onClick={() => setBnccStep('select')}
                    className={`py-3 px-3 rounded-2xl font-bold text-white text-xs ${t.primaryGrad} flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all`}
                  >
                    <BrainCircuit className="w-4 h-4 shrink-0" />
                    <span>Gerar com IA</span>
                  </button>
                  <button
                    onClick={() => setBnccStep('manual')}
                    className={`py-3 px-3 rounded-2xl font-bold ${t.cardSub} ${t.textMain} border border-violet-500/20 text-xs flex items-center justify-center gap-1.5 hover:border-violet-500 transition-all`}
                  >
                    <Plus className="w-4 h-4 shrink-0 text-violet-500" />
                    <span>Criar Manual</span>
                  </button>
                </div>

                <div>
                  <h3 className={`${t.textMain} font-bold text-sm mb-3 flex items-center gap-2`}>
                    <CheckSquare className="w-4 h-4 text-violet-500" />
                    <span>Quizzes Publicados</span>
                  </h3>
                  <div className="space-y-3">
                    {publishedQuizzes.map((q: any) => (
                      <div key={q.id} className={`${t.card} p-4 rounded-2xl border-l-4 border-violet-500 transition-colors`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded font-bold">
                            {q.bnccCode || q.bncc}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            {q.groupsAnswered !== undefined ? q.groupsAnswered : 0} {q.totalGroups ? `de ${q.totalGroups} ` : ''}{q.groupsAnswered === 1 ? 'Grupo Respondeu' : 'Grupos Responderam'}
                          </span>
                        </div>
                        <p className={`${t.textMain} text-xs font-medium truncate`}>{q.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {bnccStep === 'select' && (
              <div className={`${t.card} rounded-3xl p-5 border-2 border-violet-500/20 transition-colors`}>
                <label className={`${t.textMain} text-xs font-bold mb-2 block`}>
                  Selecione a Habilidade BNCC Oficial
                </label>
                <select
                  className={`w-full p-3 rounded-xl ${t.cardSub} ${t.textMain} text-xs mb-4 outline-none border border-slate-200 dark:border-violet-500/10 transition-colors`}
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">-- Escolha uma habilidade --</option>
                  {bnccCatalog.map((s) => (
                    <option key={s.code} value={s.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      [{s.code}] {s.subject} — {s.description.substring(0, 40)}...
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBnccStep('list')}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs ${t.cardSub} ${t.textMain}`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedSkill}
                    className={`flex-[2] py-3 rounded-xl font-bold text-white text-xs ${
                      !selectedSkill ? 'bg-slate-400' : t.primaryGrad
                    } flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition-all`}
                  >
                    <BrainCircuit className="w-4 h-4" />
                    <span>Gerar Quiz Estruturado</span>
                  </button>
                </div>
              </div>
            )}

            {bnccStep === 'generating' && (
              <div className={`${t.card} rounded-3xl p-10 flex flex-col items-center justify-center text-center`}>
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className={`${t.textMain} font-bold text-sm`}>Analisando matriz BNCC...</p>
                <p className={`${t.textMuted} text-xs mt-1`}>Criando distratores pedagógicos e gabarito</p>
              </div>
            )}

            {bnccStep === 'preview' && draftQuiz && (
              <div className={`${t.card} rounded-3xl p-5 border-2 border-emerald-500/30 animate-in zoom-in-95 transition-colors`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`${t.textMain} font-bold text-sm`}>Preview do Quiz Gerado</h3>
                  <span className="text-[10px] font-mono bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded font-bold">
                    {draftQuiz.bnccCode || draftQuiz.bncc}
                  </span>
                </div>
                <p className={`${t.textMain} text-sm font-medium mb-3 leading-relaxed`}>{draftQuiz.question}</p>
                <div className="space-y-2 mb-4">
                  {draftQuiz.options.map((opt: string, i: number) => {
                    const isGabarito = i === draftQuiz.correctIndex;
                    return (
                      <div
                        key={i}
                        className={`p-2.5 rounded-lg text-xs flex justify-between items-center ${
                          isGabarito
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                            : `${t.cardSub} ${t.textMuted}`
                        }`}
                      >
                        <span>{['A', 'B', 'C', 'D'][i]}) {opt}</span>
                        {isGabarito && <span className="text-[10px] uppercase ml-2 shrink-0 font-bold">✓ Gabarito</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBnccStep('select')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${t.cardSub} ${t.textMain}`}
                  >
                    Refazer
                  </button>
                  <button
                    onClick={handlePublishQuiz}
                    disabled={isPublishing}
                    className="flex-1 py-2.5 rounded-xl font-bold text-white text-xs bg-emerald-500 hover:bg-emerald-600 shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publicar para a Turma</span>
                  </button>
                </div>
              </div>
            )}

            {bnccStep === 'manual' && (
              <div className={`${t.card} rounded-3xl p-5 border-2 border-violet-500/20 transition-colors space-y-3 animate-in zoom-in-95`}>
                <div className="flex justify-between items-center pb-2 border-b border-violet-500/10">
                  <h3 className={`${t.textMain} font-bold text-sm flex items-center gap-1.5`}>
                    <Plus className="w-4 h-4 text-violet-500" />
                    <span>Criar Quiz Manual para a Turma</span>
                  </h3>
                  <button
                    onClick={() => setBnccStep('list')}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancelar
                  </button>
                </div>

                <form onSubmit={handlePublishManualQuiz} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                        Disciplina / Trilha
                      </label>
                      <select
                        value={manualSubject}
                        onChange={(e) => setManualSubject(e.target.value)}
                        className={`w-full p-2.5 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border border-violet-500/10`}
                      >
                        <option value="Geografia">Geografia</option>
                        <option value="História">História</option>
                        <option value="Ciências da Natureza">Ciências da Natureza</option>
                        <option value="Matemática">Matemática</option>
                        <option value="Língua Portuguesa">Língua Portuguesa</option>
                      </select>
                    </div>

                    <div>
                      <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                        Código BNCC
                      </label>
                      <input
                        type="text"
                        required
                        value={manualBncc}
                        onChange={(e) => setManualBncc(e.target.value)}
                        placeholder="Ex: EM13CHS202"
                        className={`w-full p-2.5 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border border-violet-500/10 font-mono`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`${t.textMain} text-[10px] font-bold block mb-1`}>
                      Enunciado da Questão *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={manualQuestion}
                      onChange={(e) => setManualQuestion(e.target.value)}
                      placeholder="Digite a pergunta ou problema para as equipes responderem..."
                      className={`w-full p-2.5 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border border-violet-500/10`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`${t.textMain} text-[10px] font-bold block`}>
                      Alternativas (marque a letra do Gabarito Correto)
                    </label>
                    {manualOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setManualCorrectIndex(i)}
                          className={`w-6 h-6 rounded-lg font-bold text-xs shrink-0 transition-all ${
                            manualCorrectIndex === i
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : `${t.cardSub} ${t.textMuted}`
                          }`}
                        >
                          {['A', 'B', 'C', 'D'][i]}
                        </button>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const updated = [...manualOptions];
                            updated[i] = e.target.value;
                            setManualOptions(updated);
                          }}
                          placeholder={`Opção ${['A', 'B', 'C', 'D'][i]}`}
                          className={`flex-1 p-2 rounded-xl ${t.cardSub} ${t.textMain} text-xs outline-none border ${
                            manualCorrectIndex === i ? 'border-emerald-500/50' : 'border-violet-500/10'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-violet-500/10">
                    <button
                      type="button"
                      onClick={() => setBnccStep('list')}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${t.cardSub} ${t.textMuted}`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isPublishing || !manualQuestion.trim() || manualOptions.some((o) => !o.trim())}
                      className={`flex-[2] py-2.5 rounded-xl font-bold text-white text-xs ${t.primaryGrad} shadow-md hover:brightness-110 transition-all disabled:opacity-50`}
                    >
                      {isPublishing ? 'Publicando...' : 'Publicar Quiz para a Turma'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {teacherTab === 'heatmap' && (
          <>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className={`${t.textMain} font-bold text-base sm:text-lg leading-snug`}>
                  Mapa de Aprendizagem (Heatmap)
                </h2>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase tracking-wide whitespace-nowrap flex-shrink-0">
                  Métricas Reais
                </span>
              </div>
              <p className={`${t.textMuted} text-xs leading-relaxed`}>
                Acompanhamento pedagógico 100% real baseado no desempenho dos alunos e grupos nos quizzes da BNCC.
              </p>
            </div>

            <div className={`${t.card} rounded-2xl overflow-hidden border border-violet-500/15 transition-colors`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={isDarkMode ? 'bg-black/20' : 'bg-slate-100'}>
                    <tr>
                      <th className={`p-3 font-bold ${t.textMain} border-b ${isDarkMode ? 'border-violet-800' : 'border-violet-100'}`}>
                        Habilidade BNCC
                      </th>
                      <th className={`p-3 font-bold ${t.textMain} border-b ${isDarkMode ? 'border-violet-800' : 'border-violet-100'}`}>
                        Domínio Real
                      </th>
                      <th className={`p-3 font-bold ${t.textMain} border-b ${isDarkMode ? 'border-violet-800' : 'border-violet-100'}`}>
                        Atividade Coletiva
                      </th>
                      <th className={`p-3 font-bold ${t.textMain} border-b ${isDarkMode ? 'border-violet-800' : 'border-violet-100'}`}>
                        Diagnóstico
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row: any, i: number) => {
                      const pct = row.mastery_percentage ?? 0;
                      const hasSubmissions = (row.total_submissions || 0) > 0;
                      const barColor = !hasSubmissions
                        ? 'bg-slate-400'
                        : pct >= 80
                        ? 'bg-emerald-500'
                        : pct >= 60
                        ? 'bg-amber-500'
                        : 'bg-red-500';

                      const badgeText = !hasSubmissions
                        ? 'Sem Respostas'
                        : pct >= 80
                        ? 'Alto Domínio'
                        : pct >= 60
                        ? 'Em Evolução'
                        : 'Atenção / Reforço';

                      const badgeClass = !hasSubmissions
                        ? 'bg-slate-500/15 text-slate-400'
                        : pct >= 80
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : pct >= 60
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400';

                      return (
                        <tr key={i} className={`border-b ${isDarkMode ? 'border-violet-800/50' : 'border-violet-50'}`}>
                          <td className="p-3">
                            <span className={`font-mono text-[11px] font-bold ${t.textMain} block`}>
                              {row.skill_code || row.id}
                            </span>
                            <span className={`${t.textMuted} text-[10px] block line-clamp-1`}>
                              {row.skill_desc || row.subject || 'Habilidade Geral'}
                            </span>
                          </td>
                          <td className="p-3 min-w-[130px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className={`font-bold ${t.textMain} w-9 text-right font-mono`}>{pct}%</span>
                            </div>
                          </td>
                          <td className={`p-3 ${t.textMuted} text-[10px]`}>
                            {hasSubmissions ? (
                              <div>
                                <span className="font-bold text-violet-500">{row.total_submissions} respostas</span>
                                <span className="block text-[9px]">
                                  {row.correct_submissions} acertos • {row.groups_count || 1} mesa(s)
                                </span>
                              </div>
                            ) : (
                              <span className="italic opacity-60">Nenhum quiz respondido</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeClass} uppercase tracking-wider whitespace-nowrap`}>
                              {badgeText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {teacherTab === 'moderacao' && (
          <>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className={`${t.textMain} font-bold text-base sm:text-lg leading-snug`}>
                  Fila de Moderação em Camadas
                </h2>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-fuchsia-500/15 text-fuchsia-500 dark:text-fuchsia-400 border border-fuchsia-500/30 uppercase tracking-wide whitespace-nowrap flex-shrink-0">
                  IA + Líderes
                </span>
              </div>
              <p className={`${t.textMuted} text-xs leading-relaxed`}>
                Filtro automático por IA seguido de validação descentralizada por Líderes de Turma e docentes.
              </p>
            </div>

            {moderationQueue.length === 0 ? (
              <div className={`${t.card} rounded-3xl p-10 flex flex-col items-center justify-center text-center border-dashed border-2 ${isDarkMode ? 'border-violet-800' : 'border-violet-200'} transition-colors`}>
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Shield className={`w-8 h-8 ${t.textMuted} opacity-50`} />
                </div>
                <h3 className={`${t.textMain} font-bold text-sm mb-1`}>
                  Nenhum item pendente na fila de moderação. Todos os materiais validados!
                </h3>
              </div>
            ) : (
              <div className="space-y-3">
                {moderationQueue.map((item: any) => (
                  <div key={item.id} className={`${t.card} rounded-2xl p-4 border border-violet-500/20 flex flex-col gap-2 transition-colors`}>
                    <div className="flex justify-between items-start">
                      <strong className={`${t.textMain} text-xs font-bold`}>{item.title}</strong>
                      <span className="text-[9px] font-bold bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded uppercase">
                        Pendente
                      </span>
                    </div>
                    <div className={`${t.textMuted} text-[11px]`}>Autor: {item.author}</div>
                    <div className="text-[11px] text-emerald-500 font-semibold">{item.ai_status}</div>
                    <button
                      onClick={() => handleApproveModeration(item.id)}
                      className="self-end px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm flex items-center gap-1 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aprovar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
