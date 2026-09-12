import React, { useState } from 'react';
import { Target, Award, Sparkles, CheckCircle2, HelpCircle, Bell } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function StudentHomeTab({ currentClass, quizzes, announcements, onDataChange, showToast }) {
  const { refreshUser } = useAuth();
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [answeredState, setAnsweredState] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeQuiz = quizzes && quizzes.length > 0 ? quizzes[selectedQuizIndex] : null;

  const handleOptionSelect = async (optionIndex) => {
    if (!activeQuiz || isSubmitting || answeredState[activeQuiz.id]) return;

    setIsSubmitting(true);
    try {
      const result = await api.quizzes.submit(activeQuiz.id, optionIndex);

      setAnsweredState((prev) => ({
        ...prev,
        [activeQuiz.id]: {
          selectedIndex: optionIndex,
          isCorrect: result.isCorrect,
          correctIndex: result.correctIndex
        }
      }));

      if (result.isCorrect) {
        showToast(`🎉 Resposta Correta! +${result.pointsAwarded * result.fairSyncMembersCount} pts distribuídos igualmente ao seu grupo 4-em-1 e à Turma!`);
      } else {
        showToast('❌ Resposta incorreta. Revise o conceito com o Revisor da sua equipe!');
      }

      await refreshUser();
      onDataChange();
    } catch (err) {
      showToast('Erro ao submeter resposta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPct = currentClass ? currentClass.percentage : 75;

  return (
    <>
      {announcements && announcements.length > 0 && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--kodic-fuchsia)' }}>
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} style={{ color: 'var(--kodic-fuchsia)' }} />
              <span>{announcements[0].title}</span>
            </div>
            <span className="pill-tag pill-fuchsia">{announcements[0].tag}</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {announcements[0].desc}
          </p>
        </div>
      )}

      {currentClass && (
        <div className="glass-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} style={{ color: 'var(--kodic-fuchsia)' }} />
              <span>Meta Coletiva da Turma</span>
            </div>
            <span className="pill-tag pill-purple">{progressPct}% Atingido</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Pontuação Acumulada</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              {currentClass.current_points?.toLocaleString()} / {currentClass.goal_points?.toLocaleString()} pts
            </strong>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--kodic-amber)', background: 'rgba(245, 158, 11, 0.1)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
            <Award size={16} />
            <span>Recompensa Coletiva: <strong>{currentClass.reward_title}</strong></span>
          </div>
        </div>
      )}

      {activeQuiz && (
        <div className="glass-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} style={{ color: 'var(--kodic-purple)' }} />
              <span>Desafio Diário Coletivo</span>
            </div>
            <span className="pill-tag pill-green">{activeQuiz.bnccCode}</span>
          </div>

          <p style={{ fontSize: '0.84rem', fontWeight: 600, lineHeight: '1.4' }}>
            {activeQuiz.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            {activeQuiz.options.map((opt, idx) => {
              const quizState = answeredState[activeQuiz.id];
              let optionClass = 'quiz-option';

              if (quizState) {
                if (idx === quizState.correctIndex) {
                  optionClass += ' correct';
                } else if (idx === quizState.selectedIndex && !quizState.isCorrect) {
                  optionClass += ' wrong';
                }
              }

              return (
                <button
                  key={idx}
                  className={optionClass}
                  disabled={Boolean(quizState) || isSubmitting}
                  onClick={() => handleOptionSelect(idx)}
                >
                  <span style={{ fontWeight: 800, color: 'var(--kodic-fuchsia)' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '10px', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} style={{ color: 'var(--kodic-amber)' }} />
              <span>Sincronização Justa: +{activeQuiz.pointsReward} pts por aluno</span>
            </div>
            {quizzes.length > 1 && (
              <button
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                onClick={() => setSelectedQuizIndex((prev) => (prev + 1) % quizzes.length)}
              >
                Próximo Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
