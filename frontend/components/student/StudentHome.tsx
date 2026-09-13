'use client';

import React, { useState } from 'react';
import { Megaphone, BrainCircuit, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '@/frontend/context/ThemeContext';

interface StudentHomeProps {
  currentClass: any;
  quizzes: any[];
  quizStats?: any;
  sharedGroup?: any;
  announcements: any[];
  onDataChange: () => void;
  onAnswerCorrect?: (info?: { points: number; isHolder: boolean }) => void;
}

export function StudentHome({
  currentClass,
  quizzes,
  quizStats,
  sharedGroup,
  announcements,
  onDataChange,
  onAnswerCorrect
}: StudentHomeProps) {
  const { isDarkMode, theme: t } = useTheme();

  const [answeredState, setAnsweredState] = useState<Record<string | number, { selectedIndex: number; isCorrect: boolean; correctIndex: number }>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isAllCompleted = Boolean(
    quizStats?.allCompleted ||
    (quizzes.length > 0 && quizzes.every((q) => q.completed || answeredState[q.id]))
  );

  const pendingQuiz = quizzes.find((q) => !q.completed && !answeredState[q.id]);
  const activeQuiz = pendingQuiz || quizzes[0] || null;
  const isQuizAnswered = activeQuiz && (answeredState[activeQuiz.id] || activeQuiz.completed);

  const handleOptionSelect = async (optionIndex: number) => {
    if (!activeQuiz || isSubmitting || answeredState[activeQuiz.id]) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('kodicedu_token') || localStorage.getItem('kodic_jwt_token');
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          optionIndex
        })
      });

      const result = await res.json();

      setAnsweredState((prev) => ({
        ...prev,
        [activeQuiz.id]: {
          selectedIndex: optionIndex,
          isCorrect: result.isCorrect,
          correctIndex: result.correctIndex
        }
      }));

      if (result.isCorrect && onAnswerCorrect) {
        onAnswerCorrect({
          points: result.pointsAwarded || 50,
          isHolder: Boolean(result.isHolder)
        });
      }

      onDataChange();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPoints = currentClass?.current_points ?? 7620;
  const goalPoints = currentClass?.goal_points ?? 8500;
  const progressPct = Math.min(100, Math.round((currentPoints / goalPoints) * 100));
  const activeAnnouncement = announcements && announcements.length > 0 ? announcements[0] : null;

  return (
    <div className="p-5 space-y-5 animate-in fade-in pb-24">
      {activeAnnouncement && (
        <div className="bg-slate-900/95 dark:bg-[#150D33] rounded-3xl p-5 border-l-4 border-l-fuchsia-500 border border-fuchsia-500/25 text-white shadow-lg transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 uppercase tracking-wider">
              {activeAnnouncement.tag || 'Coordenação'}
            </span>
          </div>
          <h4 className="text-white text-sm font-bold">{activeAnnouncement.title || 'Quadro Oficial'}</h4>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            {activeAnnouncement.desc || activeAnnouncement.content}
          </p>
        </div>
      )}

      <div className={`${t.card} rounded-3xl p-5 relative overflow-hidden transition-colors`}>
        <div className="absolute top-0 right-0 p-3">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            {progressPct}% Atingido
          </span>
        </div>
        <h2 className={`${t.textMain} font-bold text-lg mb-1`}>Meta Coletiva</h2>
        <p className={`${t.textMuted} text-xs mb-4`}>
          Pontuação Acumulada: <span className="font-bold text-violet-500">{currentPoints.toLocaleString()}</span> / {goalPoints.toLocaleString()} pts
        </p>

        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-1000"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className={`p-3 rounded-xl ${t.cardSub} flex items-center justify-between border border-emerald-500/20`}>
          <span className={`${t.textMain} text-xs font-semibold flex items-center gap-2`}>
            Recompensa Coletiva: {currentClass?.reward_title || 'Passeio Cultural Virtual 🎟'}
          </span>
        </div>
      </div>

      <div className={`${t.card} rounded-3xl p-5 border-2 border-violet-500/30 transition-colors`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className={`${t.textMain} font-bold text-lg flex items-center gap-2`}>
              <BrainCircuit className="w-5 h-5 text-violet-500 flex-shrink-0" />
              Desafio Diário Coletivo
            </h2>
            {!isAllCompleted && activeQuiz && (
              <span className="text-[10px] font-mono mt-1 text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded inline-block font-bold">
                {activeQuiz.bnccCode || activeQuiz.bncc}
              </span>
            )}
          </div>
        </div>

        {isAllCompleted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2.5 animate-in fade-in">
            <div className="w-12 h-12 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg text-white">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className={`${t.textMain} font-bold text-base`}>
              Quizzes completos para {sharedGroup?.name || 'sua mesa'}!
            </h3>
            <p className={`${t.textMuted} text-xs max-w-xs mx-auto leading-relaxed`}>
              Sua equipe respondeu a todos os desafios disponíveis. Novos quizzes aparecerão aqui assim que o professor publicar novas atividades.
            </p>
          </div>
        ) : activeQuiz && !isQuizAnswered ? (
          <div className="space-y-4">
            <p className={`${t.textMain} text-sm font-medium leading-relaxed`}>{activeQuiz.question}</p>
            <div className="space-y-2">
              {activeQuiz.options.map((opt: string, i: number) => (
                <button
                  key={i}
                  disabled={isSubmitting}
                  onClick={() => handleOptionSelect(i)}
                  className={`w-full p-3 text-left rounded-xl border transition-all text-xs flex items-center gap-2.5 ${
                    isDarkMode
                      ? 'border-violet-800/80 bg-white/5 hover:bg-violet-900/40 text-white'
                      : 'border-violet-200 hover:bg-violet-50 text-slate-800'
                  }`}
                >
                  <span className="font-black text-violet-500 w-4">{['A', 'B', 'C', 'D'][i]}</span>
                  <span className="flex-1 leading-snug">{opt}</span>
                </button>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-1 text-[10px] text-amber-600 dark:text-amber-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Fair Sync: +{activeQuiz.pointsReward || 50} pts coletivos por aluno</span>
                </div>
              </div>
              <p className="text-[9px] opacity-85 pl-5">
                +10 pts extras individuais para quem está segurando o aparelho
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg text-white">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className={`${t.textMain} font-bold text-base`}>Desafio Concluído!</h3>
            <p className={`${t.textMuted} text-xs max-w-xs mx-auto`}>
              Resposta registrada com sucesso para o grupo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
