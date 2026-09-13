'use client';

import React, { useState, useMemo } from 'react';
import { Gamepad2, CheckSquare, Sparkles, Compass, ArrowRight, Check, Layers, Heart, BookImage, Link as LinkIcon, Plus, X, Library } from 'lucide-react';
import { useTheme } from '@/frontend/context/ThemeContext';

interface StudentMissionsProps {
  quizzes?: any[];
  quizStats?: any;
  sharedGroup?: any;
  notebooks?: any[];
  studentAnswers?: Record<string | number, { answered: boolean; selectedOption: number; isCorrect: boolean }>;
  onGoToHome?: () => void;
  onDataChange?: () => void;
}

interface TrilhaItem {
  id: string;
  title: string;
  bnccCode: string;
  subject: string;
  description: string;
  tag: string;
}

const BASE_TRILHAS: TrilhaItem[] = [
  {
    id: 'trilha_EM13CHS202',
    title: 'Espaço Urbano e Cidades Inteligentes',
    bnccCode: 'EM13CHS202',
    subject: 'Geografia',
    description: 'Análise do impacto tecnológico, mobilidade e redes urbanas nas metrópoles.',
    tag: 'Trilha Oficial'
  },
  {
    id: 'trilha_EM13CHS101',
    title: 'Guerra Fria e Geopolítica Pós-1950',
    bnccCode: 'EM13CHS101',
    subject: 'História',
    description: 'Compreensão de processos geopolíticos contemporâneos e corrida tecnológica.',
    tag: 'Trilha Oficial'
  },
  {
    id: 'trilha_EM13CNT206',
    title: 'Biomas Brasileiros e Sustentabilidade',
    bnccCode: 'EM13CNT206',
    subject: 'Ciências da Natureza',
    description: 'Dinâmica dos ecossistemas nacionais e preservação socioambiental.',
    tag: 'Sala Invertida'
  }
];

export function StudentMissions({
  quizzes = [],
  quizStats,
  sharedGroup,
  notebooks = [],
  studentAnswers = {},
  onGoToHome,
  onDataChange
}: StudentMissionsProps) {
  const { theme: t } = useTheme();
  const [missionsSubTab, setMissionsSubTab] = useState<'trilhas' | 'quizzes' | 'hub'>('trilhas');
  const [activeTrilhaId, setActiveTrilhaId] = useState<string>(BASE_TRILHAS[0].id);
  const [selectedQuizFilter, setSelectedQuizFilter] = useState<string>('all');
  const [thankedItems, setThankedItems] = useState<Set<string>>(new Set());
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState<boolean>(false);
  const [materialTitle, setMaterialTitle] = useState<string>('');
  const [materialType, setMaterialType] = useState<'HANDWRITTEN_NOTEBOOK' | 'MIND_MAP' | 'CURATED_LINK'>('HANDWRITTEN_NOTEBOOK');
  const [materialUrl, setMaterialUrl] = useState<string>('');
  const [isSubmittingMaterial, setIsSubmittingMaterial] = useState<boolean>(false);

  const handleThank = (key: string) => {
    setThankedItems((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const handleAddMaterial = async () => {
    if (isSubmittingMaterial || !materialTitle.trim()) return;
    setIsSubmittingMaterial(true);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/content/notebooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: materialTitle.trim(),
          type: materialType,
          imageUrl: materialUrl.trim() || undefined
        })
      });
      if (res.ok) {
        setMaterialTitle('');
        setMaterialUrl('');
        setMaterialType('HANDWRITTEN_NOTEBOOK');
        setIsMaterialModalOpen(false);
        onDataChange?.();
      }
    } finally {
      setIsSubmittingMaterial(false);
    }
  };

  const listQuizzes = useMemo(() => {
    if (quizStats) return quizzes;
    if (quizzes.length > 0) return quizzes;
    return [
      {
        id: 1,
        bnccCode: 'EM13CHS202',
        subject: 'Geografia',
        question: "Como o conceito de 'Espaço Geográfico Tecnificado' se aplica ao desenvolvimento de cidades inteligentes?",
        options: [
          'Integrando dados em tempo real para otimizar serviços públicos e mobilidade urbana.',
          'Isolando a população sem acesso à internet das redes municipais de saúde.',
          'Substituindo todas as áreas verdes por data centers urbanos centralizados.',
          'Proibindo a utilização de dispositivos móveis no transporte público.'
        ],
        correctIndex: 0,
        completed: false
      }
    ];
  }, [quizzes, quizStats]);

  const trilhas = useMemo(() => {
    const dynamicMap = new Map<string, TrilhaItem>();

    for (const bt of BASE_TRILHAS) {
      dynamicMap.set(bt.bnccCode, bt);
    }

    for (const q of listQuizzes) {
      const code = q.bnccCode || q.bncc;
      if (code && !dynamicMap.has(code)) {
        dynamicMap.set(code, {
          id: `trilha_${code}`,
          title: `Trilha: ${q.subject || 'Atividade Curricular'}`,
          bnccCode: code,
          subject: q.subject || 'Multidisciplinar',
          description: `Desafios curriculares vinculados à matriz ${code}.`,
          tag: 'Postada pelo Professor'
        });
      }
    }

    return Array.from(dynamicMap.values());
  }, [listQuizzes]);

  const trilhasWithStats = useMemo(() => {
    return trilhas.map((trilha) => {
      const associatedQuizzes = listQuizzes.filter((q) => {
        const code = q.bnccCode || q.bncc;
        const subj = (q.subject || '').toLowerCase();
        const trilhaSubj = (trilha.subject || '').toLowerCase();
        return (code && code === trilha.bnccCode) || (subj && trilhaSubj && subj === trilhaSubj);
      });

      const total = associatedQuizzes.length;
      const completed = associatedQuizzes.filter((q) => q.completed || studentAnswers[q.id]).length;
      const pending = total - completed;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      const isCompleted = total > 0 && completed === total;

      return {
        ...trilha,
        quizzes: associatedQuizzes,
        totalQuizzes: total,
        completedQuizzes: completed,
        pendingQuizzes: pending,
        percentage,
        isCompleted
      };
    });
  }, [trilhas, listQuizzes, studentAnswers]);

  const activeTrilha = trilhasWithStats.find((t) => t.id === activeTrilhaId) || trilhasWithStats[0];

  const groupName = sharedGroup?.name || quizStats?.group?.name || 'sua mesa';

  const isAllCompleted = Boolean(
    quizStats?.allCompleted ||
    (listQuizzes.length > 0 && listQuizzes.every((q: any) => q.completed || studentAnswers[q.id]))
  );

  const displayedQuizzes = useMemo(() => {
    let baseList = listQuizzes;
    if (selectedQuizFilter !== 'all') {
      const targetTrilha = trilhasWithStats.find((tr) => tr.id === selectedQuizFilter);
      if (targetTrilha) {
        baseList = targetTrilha.quizzes;
      }
    }
    return baseList.filter((q: any) => !q.completed && !studentAnswers[q.id]);
  }, [listQuizzes, selectedQuizFilter, trilhasWithStats, studentAnswers]);

  const handleSelectTrilha = (trilhaId: string) => {
    setActiveTrilhaId(trilhaId);
    setSelectedQuizFilter(trilhaId);
  };

  const handleViewTrilhaQuizzes = (trilhaId: string) => {
    setActiveTrilhaId(trilhaId);
    setSelectedQuizFilter(trilhaId);
    setMissionsSubTab('quizzes');
  };

  return (
    <div className="p-5 space-y-5 animate-in fade-in pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${t.textMain} font-bold text-xl flex items-center gap-2`}>
            <Gamepad2 className="w-5 h-5 text-fuchsia-500" />
            Trilhas & Missões
          </h2>
          <p className={`${t.textMuted} text-xs mt-0.5`}>
            {activeTrilha ? `Trilha Atual: ${activeTrilha.title}` : 'Selecione uma trilha de aprendizagem'}
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-500 uppercase">
          BNCC
        </span>
      </div>

      <div className={`flex p-1 rounded-2xl ${t.cardSub} border border-violet-500/10`}>
        <button
          onClick={() => setMissionsSubTab('trilhas')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            missionsSubTab === 'trilhas' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          Trilhas ({trilhas.length})
        </button>
        <button
          onClick={() => setMissionsSubTab('quizzes')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            missionsSubTab === 'quizzes' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          Quizzes {isAllCompleted ? '✓' : `(${listQuizzes.filter((q) => !q.completed && !studentAnswers[q.id]).length})`}
        </button>
        <button
          onClick={() => setMissionsSubTab('hub')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            missionsSubTab === 'hub' ? `${t.card} shadow-sm ${t.textMain}` : t.textMuted
          }`}
        >
          Hub ({notebooks.length})
        </button>
      </div>

      {missionsSubTab === 'trilhas' && (
        <div className="space-y-4">
          <div className={`p-3 rounded-2xl ${t.cardSub} border border-violet-500/15 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-violet-500" />
              <div>
                <p className={`${t.textMain} text-[11px] font-bold`}>
                  Trilha em Foco: {activeTrilha?.title}
                </p>
                <p className={`${t.textMuted} text-[9px]`}>
                  {activeTrilha?.totalQuizzes || 0} quizzes vinculados • {activeTrilha?.pendingQuizzes || 0} pendente(s)
                </p>
              </div>
            </div>
            <button
              onClick={() => handleViewTrilhaQuizzes(activeTrilha?.id || trilhasWithStats[0].id)}
              className="px-2.5 py-1 rounded-xl bg-violet-500 text-white text-[10px] font-bold shadow-xs hover:brightness-110 transition-all flex items-center gap-1"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {trilhasWithStats.map((trilha) => {
            const isActive = trilha.id === activeTrilhaId;

            return (
              <div
                key={trilha.id}
                className={`${t.card} rounded-3xl p-5 relative overflow-hidden border transition-all ${
                  isActive
                    ? 'border-violet-500 shadow-md ring-1 ring-violet-500/30'
                    : 'border-violet-500/15 hover:border-violet-500/40'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    isActive ? 'bg-violet-500 text-white' : 'bg-violet-500/10 text-violet-500'
                  }`}>
                    {isActive ? 'Trilha Ativa da Mesa' : trilha.tag}
                  </span>
                  <span className="text-[10px] font-mono text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded font-bold">
                    {trilha.bnccCode}
                  </span>
                </div>

                <h3 className={`${t.textMain} font-bold text-base mt-1`}>{trilha.title}</h3>
                <p className={`${t.textMuted} text-xs mt-1 mb-3 leading-relaxed`}>{trilha.description}</p>

                <div className="flex justify-between text-[10px] font-bold text-violet-500 mb-1">
                  <span>Progresso da Equipe</span>
                  <span>{trilha.completedQuizzes}/{trilha.totalQuizzes} quizzes ({trilha.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${t.primaryGrad} transition-all duration-500`}
                    style={{ width: `${trilha.percentage}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  {!isActive && (
                    <button
                      onClick={() => handleSelectTrilha(trilha.id)}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs ${t.cardSub} ${t.textMain} border border-violet-500/20 hover:brightness-105 transition-all`}
                    >
                      Mudar para esta Trilha
                    </button>
                  )}
                  <button
                    onClick={() => handleViewTrilhaQuizzes(trilha.id)}
                    className={`flex-1 py-2 rounded-xl font-bold text-white text-xs ${t.primaryGrad} shadow-xs hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5`}
                  >
                    <span>{trilha.isCompleted ? 'Rever Quizzes' : 'Ver Quizzes'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {missionsSubTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedQuizFilter('all')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                selectedQuizFilter === 'all'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : `${t.cardSub} ${t.textMuted}`
              }`}
            >
              Todas as Trilhas
            </button>
            {trilhasWithStats.map((tr) => (
              <button
                key={tr.id}
                onClick={() => {
                  setSelectedQuizFilter(tr.id);
                  setActiveTrilhaId(tr.id);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 ${
                  selectedQuizFilter === tr.id
                    ? 'bg-violet-600 text-white shadow-xs'
                    : `${t.cardSub} ${t.textMuted}`
                }`}
              >
                <span>{tr.subject}</span>
                {tr.pendingQuizzes > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center">
                    {tr.pendingQuizzes}
                  </span>
                ) : (
                  <Check className="w-3 h-3 text-emerald-400" />
                )}
              </button>
            ))}
          </div>

          {isAllCompleted || displayedQuizzes.length === 0 ? (
            <div className={`${t.card} rounded-3xl p-6 text-center border-2 border-emerald-500/40 space-y-3 animate-in fade-in`}>
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-inner">
                <CheckSquare className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full inline-block mb-2">
                  Quizzes Concluídos
                </span>
                <h3 className={`${t.textMain} font-bold text-base`}>
                  {selectedQuizFilter === 'all'
                    ? `Quizzes completos para ${groupName}!`
                    : `Quizzes desta trilha completos para ${groupName}!`}
                </h3>
                <p className={`${t.textMuted} text-xs max-w-xs mx-auto mt-1 leading-relaxed`}>
                  Todos os desafios disponíveis foram respondidos pela sua equipe. Novos quizzes aparecerão aqui assim que o professor publicar atividades.
                </p>
              </div>
              <div className={`p-3 rounded-2xl ${t.cardSub} text-[11px] ${t.textMuted} max-w-xs mx-auto flex items-center justify-center gap-1.5`}>
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Aguarde o professor postar novos quizzes nesta trilha.</span>
              </div>
            </div>
          ) : (
            displayedQuizzes.map((quiz: any) => (
              <div key={quiz.id} className={`${t.card} rounded-3xl p-5 border-l-4 border-amber-500 transition-colors`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    Pendente
                  </span>
                  <span className="text-[10px] font-mono text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded font-bold">
                    {quiz.bnccCode || quiz.bncc} • {quiz.subject || 'Geral'}
                  </span>
                </div>

                <p className={`${t.textMain} text-sm font-medium mb-4 leading-relaxed`}>{quiz.question}</p>
                <button
                  onClick={onGoToHome}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs ${t.primaryGrad} text-white shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5`}
                >
                  <span>Ir para Resolução (Início)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {missionsSubTab === 'hub' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className={`${t.textMuted} text-[11px] leading-relaxed max-w-[220px]`}>
              Conteúdo e quizzes publicados por toda a turma, de todas as matérias. Agradeça o que te ajudou.
            </p>
            <button
              onClick={() => setIsMaterialModalOpen(true)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-bold text-white ${t.primaryGrad} shadow-xs hover:brightness-110 transition-all`}
            >
              <Plus className="w-3.5 h-3.5" /> Publicar
            </button>
          </div>

          {notebooks.length === 0 && listQuizzes.length === 0 ? (
            <div className={`${t.cardSub} rounded-2xl p-5 text-center border border-dashed border-violet-500/20`}>
              <Library className={`w-6 h-6 mx-auto mb-2 ${t.textMuted}`} />
              <p className={`${t.textMuted} text-[11px]`}>
                Nada publicado na turma ainda. Seja o primeiro a compartilhar um material.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notebooks.map((n: any) => {
                const key = `notebook-${n.id}`;
                const isThanked = thankedItems.has(key);
                return (
                  <div
                    key={key}
                    className={`${t.card} rounded-2xl p-3.5 border border-violet-500/10 flex items-center gap-3 shadow-sm`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-500 flex items-center justify-center flex-shrink-0">
                      {n.type === 'CURATED_LINK' ? <LinkIcon className="w-4 h-4" /> : <BookImage className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`${t.textMain} text-xs font-bold truncate`}>{n.title}</p>
                      <p className={`${t.textMuted} text-[10px] truncate`}>{n.author_name} &middot; {n.badge}</p>
                    </div>
                    <button
                      onClick={() => handleThank(key)}
                      disabled={isThanked}
                      title="Agradecer silenciosamente"
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isThanked ? 'bg-pink-500/15 text-pink-500' : `${t.cardSub} ${t.textMuted} hover:text-pink-500`
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isThanked ? 'fill-pink-500' : ''}`} />
                    </button>
                  </div>
                );
              })}

              {listQuizzes.map((q: any) => {
                const key = `quiz-${q.id}`;
                const isThanked = thankedItems.has(key);
                return (
                  <div
                    key={key}
                    className={`${t.card} rounded-2xl p-3.5 border border-violet-500/10 flex items-center gap-3 shadow-sm`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`${t.textMain} text-xs font-bold truncate`}>{q.question}</p>
                      <p className={`${t.textMuted} text-[10px] truncate`}>{q.subject || 'Geral'} &middot; {q.bnccCode || q.bncc}</p>
                    </div>
                    <button
                      onClick={() => handleThank(key)}
                      disabled={isThanked}
                      title="Agradecer silenciosamente"
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isThanked ? 'bg-pink-500/15 text-pink-500' : `${t.cardSub} ${t.textMuted} hover:text-pink-500`
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isThanked ? 'fill-pink-500' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-5 ${t.card} border border-violet-500/20 shadow-2xl space-y-4`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`${t.textMain} font-bold text-sm flex items-center gap-1.5`}>
                  <BookImage className="w-4 h-4 text-fuchsia-500" />
                  Publicar no Hub da Turma
                </h3>
                <p className={`${t.textMuted} text-[10px]`}>
                  Foto de resolução, mapa mental ou link recomendado.
                </p>
              </div>
              <button
                onClick={() => setIsMaterialModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className={`${t.textMuted} text-[10px] font-medium`}>Tipo de material:</p>
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  { value: 'HANDWRITTEN_NOTEBOOK', label: 'Caderno' },
                  { value: 'MIND_MAP', label: 'Mapa Mental' },
                  { value: 'CURATED_LINK', label: 'Link' }
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMaterialType(opt.value)}
                    className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      materialType === opt.value
                        ? 'bg-fuchsia-500 text-white shadow-xs'
                        : `${t.cardSub} ${t.textMuted} hover:brightness-95`
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="Título (ex: Resolução Equação de 2º Grau)"
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs outline-none focus:ring-1 focus:ring-fuchsia-500 border border-slate-200 dark:border-violet-800/60"
            />

            <input
              type="text"
              value={materialUrl}
              onChange={(e) => setMaterialUrl(e.target.value)}
              placeholder="URL da foto ou link (opcional)"
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs outline-none focus:ring-1 focus:ring-fuchsia-500 border border-slate-200 dark:border-violet-800/60"
            />

            <button
              onClick={handleAddMaterial}
              disabled={isSubmittingMaterial || !materialTitle.trim()}
              className={`w-full py-2.5 rounded-xl text-xs font-bold text-white ${t.primaryGrad} shadow-md hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Publicar no Hub</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
