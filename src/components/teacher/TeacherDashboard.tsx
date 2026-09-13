'use client';

import React, { useState, useEffect } from 'react';
import { Activity, BrainCircuit, BarChart3, Shield, Megaphone, Plus, CheckSquare, CheckCircle2, Users } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { TeacherGroups } from './TeacherGroups';

interface TeacherDashboardProps {
  currentClass: any;
  onDataChange: () => void;
}

export function TeacherDashboard({ currentClass, onDataChange }: TeacherDashboardProps) {
  const { isDarkMode, theme: t } = useTheme();

  const [teacherTab, setTeacherTab] = useState<'visao_geral' | 'grupos' | 'bncc' | 'heatmap' | 'moderacao'>('visao_geral');
  const [bnccStep, setBnccStep] = useState<'list' | 'select' | 'generating' | 'preview'>('list');
  const [selectedSkill, setSelectedSkill] = useState<string>('EM13CHS202');
  const [draftQuiz, setDraftQuiz] = useState<any>(null);

  const [bnccCatalog, setBnccCatalog] = useState<any[]>([]);
  const [publishedQuizzes, setPublishedQuizzes] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [moderationQueue, setModerationQueue] = useState<any[]>([]);

  const [annTitle, setAnnTitle] = useState<string>('');
  const [annDesc, setAnnDesc] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const loadTeacherData = async () => {
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [catalogRes, quizzesRes, heatmapRes, modRes] = await Promise.all([
        fetch('/api/quizzes/bncc-catalog', { headers }).then((r) => r.json()).catch(() => ({ skills: [] })),
        fetch('/api/quizzes', { headers }).then((r) => r.json()).catch(() => ({ quizzes: [] })),
        fetch('/api/content/heatmap', { headers }).then((r) => r.json()).catch(() => ({ heatmap: [] })),
        fetch('/api/content/moderation', { headers }).then((r) => r.json()).catch(() => ({ queue: [] }))
      ]);

      setBnccCatalog(catalogRes.skills || []);
      setPublishedQuizzes(quizzesRes.quizzes || []);
      setHeatmapData(heatmapRes.heatmap || []);
      setModerationQueue(modRes.queue || []);
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
      await fetch('/api/quizzes', {
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

      setPublishedQuizzes((prev) => [draftQuiz, ...prev]);
      setBnccStep('list');
      setSelectedSkill('');
      setDraftQuiz(null);
      onDataChange();
    } catch {
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublishAnnouncement = async () => {
    if (!annDesc.trim()) return;
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      await fetch('/api/content/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          classId: currentClass?.id || 1,
          tag: 'COMUNICADO DOCENTE',
          title: annTitle.trim() || 'Aviso da Coordenação & Professora',
          desc: annDesc
        })
      });

      setAnnTitle('');
      setAnnDesc('');
      onDataChange();
    } catch {
    }
  };

  const handleOnboardingChange = async (lvl: number) => {
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      await fetch(`/api/classes/${currentClass?.id || 1}/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ onboardingLevel: lvl })
      });
      onDataChange();
    } catch {}
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
          { id: 'bncc', label: 'BNCC', icon: BrainCircuit },
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
            <div className={`${t.card} rounded-3xl p-5 transition-colors`}>
              <div className="flex justify-between items-start mb-3">
                <h2 className={`${t.textMain} font-bold text-sm`}>Onboarding Progressivo do Docente</h2>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase">
                  Zero Sobrecarga
                </span>
              </div>
              <div className="flex gap-2">
                {[
                  { lvl: 1, title: 'Nível 1', sub: 'Avisos & Quizzes' },
                  { lvl: 2, title: 'Nível 2', sub: 'Trilhas Híbridas' },
                  { lvl: 3, title: 'Nível 3', sub: 'IA Analítica' }
                ].map((item) => {
                  const isCurrent = (currentClass?.onboarding_level ?? 2) === item.lvl;
                  return (
                    <button
                      key={item.lvl}
                      onClick={() => handleOnboardingChange(item.lvl)}
                      className={`flex-1 p-2 rounded-xl text-center transition-all ${
                        isCurrent
                          ? 'border-2 border-violet-500 bg-violet-500/10'
                          : `${t.cardSub} opacity-50`
                      }`}
                    >
                      <span className={`block text-[10px] font-bold ${isCurrent ? 'text-violet-500' : t.textMuted}`}>
                        {item.title}
                      </span>
                      <span className={`${t.textMain} text-[9px] font-medium`}>{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`${t.card} rounded-3xl p-5 relative overflow-hidden transition-colors`}>
              <h2 className={`${t.textMain} font-bold text-sm mb-1`}>
                Meta Coletiva
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

            <div className={`${t.card} rounded-3xl p-5 border-2 border-fuchsia-500/20 transition-colors`}>
              <h2 className={`${t.textMain} font-bold text-sm mb-3 flex items-center gap-2`}>
                <Megaphone className="w-4 h-4 text-fuchsia-500" />
                Publicar Comunicado Oficial
              </h2>
              <input
                type="text"
                placeholder="Título (Opcional)"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900/90 dark:bg-black/60 text-white placeholder:text-slate-400 text-xs mb-2 outline-none focus:ring-1 focus:ring-fuchsia-500 border border-violet-500/30 shadow-inner"
              />
              <textarea
                value={annDesc}
                onChange={(e) => setAnnDesc(e.target.value)}
                placeholder="Escreva um aviso para a turma..."
                className="w-full p-3 rounded-xl bg-slate-900/90 dark:bg-black/60 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 resize-none h-24 mb-3 border border-violet-500/30 shadow-inner"
              />
              <button
                onClick={handlePublishAnnouncement}
                className={`w-full py-3 rounded-xl font-bold text-white text-xs ${t.primaryGrad} shadow-md hover:brightness-110 transition-all`}
              >
                Publicar no Mural Oficial
              </button>
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
                  Gerador IA Ancorado na BNCC
                </h2>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30 uppercase tracking-wide whitespace-nowrap flex-shrink-0">
                  Zero Alucinação
                </span>
              </div>
              <p className={`${t.textMuted} text-xs leading-relaxed`}>
                Gera desafios alinhados a 1.721 habilidades curriculares oficiais homologadas pelo MEC.
              </p>
            </div>

            {bnccStep === 'list' && (
              <>
                <button
                  onClick={() => setBnccStep('select')}
                  className={`w-full py-3 rounded-2xl font-bold text-white text-sm ${t.primaryGrad} flex items-center justify-center gap-2 shadow-lg mb-6 hover:brightness-110 transition-all`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Criar Novo Quiz com IA</span>
                </button>

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
                            {q.groupsAnswered || 4} Grupos Responderam
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
                  className={`w-full p-3 rounded-xl ${t.cardSub} ${t.textMain} text-xs mb-4 outline-none border border-violet-500/10`}
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  <option value="">-- Escolha uma habilidade --</option>
                  {bnccCatalog.map((s) => (
                    <option key={s.code} value={s.code}>
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
          </>
        )}

        {teacherTab === 'heatmap' && (
          <>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className={`${t.textMain} font-bold text-base sm:text-lg leading-snug`}>
                  Mapa de Aprendizagem (Heatmap)
                </h2>
                <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 ${t.textMuted} uppercase tracking-wide whitespace-nowrap flex-shrink-0`}>
                  Sem Vigilância
                </span>
              </div>
              <p className={`${t.textMuted} text-xs leading-relaxed`}>
                Acompanhamento 100% pedagógico baseado na BNCC. Sem monitoramento de telas ou aplicativos pessoais.
              </p>
            </div>

            <div className={`${t.card} rounded-2xl overflow-hidden transition-colors`}>
              <table className="w-full text-left text-xs">
                <thead className={isDarkMode ? 'bg-black/20' : 'bg-slate-100'}>
                  <tr>
                    <th className={`p-3 font-bold ${t.textMain} border-b ${isDarkMode ? 'border-violet-800' : 'border-violet-100'}`}>
                      Código BNCC
                    </th>
                    <th className={`p-3 font-bold ${t.textMain} border-b ${isDarkMode ? 'border-violet-800' : 'border-violet-100'}`}>
                      Domínio (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(heatmapData.length > 0
                    ? heatmapData
                    : [
                        { skill_code: 'EM13CHS101', mastery_percentage: 85, color: 'bg-emerald-500' },
                        { skill_code: 'EM13CHS202', mastery_percentage: 92, color: 'bg-emerald-500' },
                        { skill_code: 'EM13LPT02', mastery_percentage: 64, color: 'bg-amber-500' },
                        { skill_code: 'EM13MAT103', mastery_percentage: 42, color: 'bg-red-500' }
                      ]
                  ).map((row: any, i: number) => {
                    const pct = row.mastery_percentage || row.val;
                    const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
                    return (
                      <tr key={i} className={`border-b ${isDarkMode ? 'border-violet-800/50' : 'border-violet-50'}`}>
                        <td className={`p-3 font-mono text-[11px] font-bold ${t.textMain}`}>
                          {row.skill_code || row.id}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className={`font-bold ${t.textMain} w-9 text-right`}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
