import React from 'react';
import { Heart, Lightbulb, Award, Camera, ShieldCheck, Sparkles } from 'lucide-react';

export function StudentImpactTab({ impactNotifications }) {
  const getImpactIcon = (iconName) => {
    if (iconName === 'award') return <Award size={18} style={{ color: 'var(--kodic-orange)' }} />;
    if (iconName === 'camera') return <Camera size={18} style={{ color: 'var(--kodic-blue)' }} />;
    return <Lightbulb size={18} style={{ color: 'var(--kodic-amber)' }} />;
  };

  return (
    <>
      <div className="glass-card" style={{ borderLeft: '4px solid var(--kodic-pink)' }}>
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} style={{ color: 'var(--kodic-pink)' }} />
            <span>Impacto Silencioso (Gratidão Privada)</span>
          </div>
          <span className="pill-tag pill-fuchsia">Sem Likes Públicos</span>
        </div>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          No Kodic Edu não existem métricas de vaidade, seguidores ou disputa por curtidas. Aqui você é reconhecido pela utilidade real do seu conhecimento para a aprendizagem dos seus colegas.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {(impactNotifications || []).map((notif) => (
          <div
            key={notif.id}
            className="glass-card"
            style={{ padding: '12px', background: 'var(--bg-card-sub)' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)' }}>
                {getImpactIcon(notif.icon)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.84rem' }}>{notif.title}</strong>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Privado</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.3' }}>
                  {notif.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ background: 'rgba(139, 92, 246, 0.08)', borderColor: 'var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--kodic-purple)', fontWeight: 800, fontSize: '0.8rem' }}>
          <Sparkles size={14} />
          <span>Saúde Mental Preservada</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Somente você visualiza estas notificações. Zero comparação social, 100% de sentimento de pertencimento e utilidade coletiva.
        </p>
      </div>
    </>
  );
}
