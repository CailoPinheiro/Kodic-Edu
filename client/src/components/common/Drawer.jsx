import React from 'react';
import { X, Crown, Search, CheckCircle2, Mic, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Drawer({ isOpen, onClose, onOpenFocus }) {
  const { user, isStudent, isLeader, updateIntelligenceRole } = useAuth();

  if (!user) return null;

  const roles = [
    {
      key: 'Curador',
      title: 'Os Curadores',
      icon: Search,
      badge: 'Pesquisador Destaque',
      desc: 'Investigativo e analítico. Reúne referências e constrói a base sólida do grupo.',
      color: 'var(--kodic-blue)'
    },
    {
      key: 'Revisor',
      title: 'Os Revisores',
      icon: CheckCircle2,
      badge: 'Mestre da Lógica',
      desc: 'Detalhista. Revisa perguntas, valida coerência dos dados e bugs cruzados.',
      color: 'var(--kodic-amber)'
    },
    {
      key: 'Comunicador',
      title: 'Os Comunicadores',
      icon: Mic,
      badge: 'Voz da Equipe',
      desc: 'Porta-voz voluntário para explicar, narrar e apresentar conclusões.',
      color: 'var(--kodic-pink)'
    }
  ];

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`side-drawer ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crown size={20} style={{ color: 'var(--kodic-fuchsia)' }} />
            <strong style={{ fontSize: '0.95rem' }}>Menu & Identidade</strong>
          </div>
          <button className="icon-btn" style={{ width: '30px', height: '30px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--kodic-fuchsia)' }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{user.grade}</div>
              {isLeader && (
                <span className="pill-tag pill-amber" style={{ marginTop: '4px' }}>
                  Líder de Turma (Moderação Ativa)
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
            {(user.badges || []).map((b) => (
              <span key={b.id || b.title} className="pill-tag pill-fuchsia">
                {b.title}
              </span>
            ))}
          </div>
        </div>

        {isStudent && (
          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Múltiplas Inteligências (Seu Papel)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {roles.map((r) => {
                const IconComponent = r.icon;
                const isSelected = user.intelligence_role === r.key;
                return (
                  <div
                    key={r.key}
                    onClick={() => updateIntelligenceRole(r.key)}
                    style={{
                      background: isSelected ? 'rgba(217, 70, 239, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isSelected ? 'var(--kodic-fuchsia)' : 'var(--border-glass)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.82rem', color: r.color }}>
                        <IconComponent size={14} />
                        <span>{r.title}</span>
                      </div>
                      {isSelected && <span className="pill-tag pill-fuchsia">Ativo</span>}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{r.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={16} style={{ color: 'var(--kodic-amber)' }} />
            <strong style={{ fontSize: '0.85rem' }}>Ferramenta Anti-Distração</strong>
          </div>
          <button
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, var(--kodic-amber), var(--kodic-orange))' }}
            onClick={() => {
              onClose();
              onOpenFocus();
            }}
          >
            Abrir Modo Foco (Pomodoro 25m)
          </button>
        </div>

        <div className="glass-card" style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--kodic-green)', marginBottom: '4px' }}>
            <ShieldCheck size={16} />
            <strong style={{ fontSize: '0.82rem' }}>Privacy by Design & LGPD</strong>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
            Coleta mínima de dados para menores de idade, consentimento escolar, zero anúncios comerciais e IA sem retenção de dados pessoais.
          </p>
        </div>
      </aside>
    </>
  );
}
