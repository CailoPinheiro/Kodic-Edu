import React from 'react';
import { Gamepad2, PlayCircle, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

export function StudentMissionsTab({ currentClass, showToast }) {
  const tracks = [
    {
      id: 'tr_1',
      title: 'Revisão: Guerra Fria e Geopolítica Pós-1950',
      desc: '1 Vídeo Explicativo • 1 Leitura Guiada • 3 Quizzes BNCC',
      bncc: 'EM13CHS101',
      progress: 45,
      badge: 'Trilha Oficial'
    },
    {
      id: 'tr_2',
      title: 'Cidades Inteligentes & Espaço Tecnificado',
      desc: '1 Leitura Conceitual • 1 Resolução no Caderno • 2 Quizzes',
      bncc: 'EM13CHS202',
      progress: 80,
      badge: 'Sala de Aula Invertida'
    }
  ];

  const handleStartMission = (title) => {
    showToast(`🚀 Missão iniciada: "${title}". Resoluções sincronizadas com sua equipe!`);
  };

  return (
    <>
      <div className="glass-card">
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gamepad2 size={18} style={{ color: 'var(--kodic-fuchsia)' }} />
            <span>Trilhas de Aprendizagem (Missões)</span>
          </div>
          <span className="pill-tag pill-purple">BNCC Integrada</span>
        </div>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
          Roteiros estruturados que integram teoria, discussão em equipe e resolução prática manuscrita.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
          {tracks.map((t) => (
            <div
              key={t.id}
              style={{
                background: 'var(--bg-card-sub)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{t.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{t.desc}</div>
                </div>
                <span className="pill-tag pill-green">{t.bncc}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem' }}>
                <div style={{ flex: 1 }} className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${t.progress}%` }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--kodic-fuchsia)' }}>{t.progress}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span className="pill-tag pill-amber" style={{ fontSize: '0.65rem' }}>{t.badge}</span>
                <button
                  className="btn-primary"
                  style={{ width: 'auto', padding: '6px 14px', fontSize: '0.74rem' }}
                  onClick={() => handleStartMission(t.title)}
                >
                  Continuar Trilha
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
