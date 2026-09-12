import React, { useState } from 'react';
import { User, GraduationCap, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AuthModal() {
  const { login, register, quickLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [intelligenceRole, setIntelligenceRole] = useState('Curador');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register({
          name,
          email,
          password,
          role: activeTab,
          intelligenceRole: activeTab === 'student' ? intelligenceRole : 'Curador'
        });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Falha na autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (role) => {
    setErrorMsg('');
    setLoading(true);
    try {
      await quickLogin(role);
    } catch (err) {
      setErrorMsg(err.message || 'Falha no acesso rápido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="device-wrapper">
      <div className="phone-container" style={{ minHeight: 'auto', padding: '24px 20px', gap: '16px' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'rgba(217, 70, 239, 0.15)', border: '1px solid var(--kodic-fuchsia)' }}>
            <Zap size={32} style={{ color: 'var(--kodic-fuchsia)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>
            Kodic<span style={{ color: 'var(--kodic-fuchsia)' }}>Edu</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
            O Celular como Ferramenta de Engajamento Coletivo & Bem-Estar Escolar
          </p>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'student' ? 'linear-gradient(135deg, var(--kodic-purple), var(--kodic-fuchsia))' : 'transparent',
              color: activeTab === 'student' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <User size={14} /> Sou Aluno
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teacher')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'teacher' ? 'linear-gradient(135deg, var(--kodic-purple), var(--kodic-fuchsia))' : 'transparent',
              color: activeTab === 'teacher' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <GraduationCap size={14} /> Sou Professor
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--kodic-red)', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: '0.75rem', color: 'var(--kodic-red)' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isRegistering && (
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={activeTab === 'student' ? 'Ex: Alex Silva' : 'Ex: Profª. Cláudia Mendes'}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              E-mail Institucional ou Escolar
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'student' ? 'alex@kodic.edu' : 'professora@kodic.edu'}
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {isRegistering && activeTab === 'student' && (
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Perfil de Múltiplas Inteligências
              </label>
              <select
                value={intelligenceRole}
                onChange={(e) => setIntelligenceRole(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Curador">Curador (Pesquisa investigativa e análise de fontes)</option>
                <option value="Revisor">Revisor (Atenção a detalhes e controle de qualidade)</option>
                <option value="Comunicador">Comunicador (Porta-voz e apresentações em equipe)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '4px' }}>
            {loading ? 'Processando...' : isRegistering ? 'Criar Conta' : 'Entrar no Kodic Edu'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ background: 'none', border: 'none', color: 'var(--kodic-fuchsia)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {isRegistering ? 'Já tem conta? Faça Login' : 'Ainda não tem conta? Cadastre-se'}
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textAlign: 'center', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Acesso Rápido de Demonstração (1 Clique)
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleQuick('student')}
            disabled={loading}
          >
            <User size={14} style={{ color: 'var(--kodic-fuchsia)' }} />
            Entrar como Aluno (Alex Silva — Líder / Curador)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleQuick('teacher')}
            disabled={loading}
          >
            <GraduationCap size={14} style={{ color: 'var(--kodic-purple)' }} />
            Entrar como Professora (Profª. Cláudia Mendes)
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--kodic-green)', marginTop: '4px' }}>
          <ShieldCheck size={14} />
          <span>Privacy by Design: Dados escolares protegidos pela LGPD</span>
        </div>
      </div>
    </div>
  );
}
