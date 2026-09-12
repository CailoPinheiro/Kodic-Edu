import React, { useState } from 'react';
import { Users, Smartphone, RefreshCw, FolderTree, Camera, Globe2, BookOpen, Search, CheckCircle2, Mic } from 'lucide-react';
import { api } from '../../services/api';

export function StudentGroupTab({ sharedGroup, notebooks, onDataChange, showToast }) {
  const [hubView, setHubView] = useState('turma');
  const [isRotating, setIsRotating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleRotateDevice = async () => {
    if (!sharedGroup || isRotating) return;
    setIsRotating(true);
    try {
      const result = await api.groups.rotateDevice(sharedGroup.id);
      showToast(result.message);
      onDataChange();
    } catch {
      showToast('Erro ao girar rodízio de aparelho.');
    } finally {
      setIsRotating(false);
    }
  };

  const handleUploadNotebook = async () => {
    setIsUploading(true);
    try {
      const titles = [
        'Resolução Manuscrita: Análise de Bacias Hidrográficas',
        'Mapa Mental: Matrizes Energéticas e Sustentabilidade',
        'Caderno: Exercícios de Geopolítica Pós-1950'
      ];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];

      await api.content.uploadNotebook({
        title: randomTitle,
        type: 'HANDWRITTEN_NOTEBOOK',
        badge: 'Print de Caderno'
      });

      showToast('📸 Foto do caderno enviada com sucesso ao Hub de Conhecimento!');
      onDataChange();
    } catch {
      showToast('Erro ao enviar caderno.');
    } finally {
      setIsUploading(false);
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'Revisor') return <CheckCircle2 size={13} style={{ color: 'var(--kodic-amber)' }} />;
    if (role === 'Comunicador') return <Mic size={13} style={{ color: 'var(--kodic-pink)' }} />;
    return <Search size={13} style={{ color: 'var(--kodic-blue)' }} />;
  };

  return (
    <>
      <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
        <button
          className="btn-secondary"
          onClick={() => setHubView('turma')}
          style={{
            flex: 1,
            border: 'none',
            background: hubView === 'turma' ? 'linear-gradient(135deg, var(--kodic-purple), var(--kodic-fuchsia))' : 'transparent',
            color: hubView === 'turma' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Users size={14} /> Espaço da Turma
        </button>
        <button
          className="btn-secondary"
          onClick={() => setHubView('escola')}
          style={{
            flex: 1,
            border: 'none',
            background: hubView === 'escola' ? 'linear-gradient(135deg, var(--kodic-orange), var(--kodic-pink))' : 'transparent',
            color: hubView === 'escola' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Globe2 size={14} /> Hub da Escola (Global)
        </button>
      </div>

      {hubView === 'turma' ? (
        <>
          {sharedGroup && (
            <div className="glass-card">
              <div className="card-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FolderTree size={18} style={{ color: 'var(--kodic-purple)' }} />
                  <span>Identificação do Grupo</span>
                </div>
                <span className="pill-tag pill-purple">{sharedGroup.groupType}</span>
              </div>

              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {sharedGroup.name}
              </div>

              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {sharedGroup.objective}
              </p>
            </div>
          )}

          {sharedGroup && (
            <div className="glass-card">
              <div className="card-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smartphone size={18} style={{ color: 'var(--kodic-green)' }} />
                  <span>Modo Compartilhado (4 em 1)</span>
                </div>
                <span className="pill-tag pill-green">Sincronizado</span>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--kodic-green)', borderRadius: 'var(--radius-md)', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={16} style={{ color: 'var(--kodic-green)' }} />
                  <span>Rodízio Atual: <strong>{sharedGroup.currentDeviceHolder}</strong></span>
                </div>
                <button
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                  onClick={handleRotateDevice}
                  disabled={isRotating}
                >
                  <RefreshCw size={12} className={isRotating ? 'spin' : ''} />
                  Girar Posse
                </button>
              </div>

              <div className="shared-group-grid">
                {(sharedGroup.members || []).map((m) => (
                  <div key={m.id} className={`member-card ${m.isCurrentDeviceHolder ? 'is-holder' : ''}`}>
                    {m.isCurrentDeviceHolder && (
                      <div className="device-holder-badge">
                        <Smartphone size={10} /> Segurando o Celular
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={m.name}
                        style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{m.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: m.roleColor }}>
                          {getRoleIcon(m.role)}
                          <span>{m.role}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.74rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Pontos</span>
                      <strong style={{ color: 'var(--kodic-fuchsia)' }}>{m.points} pts</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card">
            <div className="card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} style={{ color: 'var(--kodic-amber)' }} />
                <span>Resolução Híbrida (Caderno Físico)</span>
              </div>
              <button
                className="btn-primary"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.72rem' }}
                onClick={handleUploadNotebook}
                disabled={isUploading}
              >
                <Camera size={14} /> {isUploading ? 'Enviando...' : 'Fotografar Caderno'}
              </button>
            </div>

            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Valorize o raciocínio no papel: envie fotos das resoluções à mão e mapas mentais para o repositório seguro da equipe.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(notebooks || []).map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card-sub)', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.author_name}</div>
                  </div>
                  <span className="pill-tag pill-amber" style={{ fontSize: '0.65rem' }}>{item.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe2 size={18} style={{ color: 'var(--kodic-orange)' }} />
              <span>Hub da Escola — Mentoria Solidária</span>
            </div>
            <span className="pill-tag pill-amber">Global</span>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Neste espaço assíncrono, os materiais curados pelos alunos são compartilhados entre turmas de diferentes anos sem métricas de vaidade.
          </p>
          <div style={{ background: 'var(--bg-card-sub)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ fontSize: '0.84rem' }}>Quiz: Frações Básicas & Geometria</strong>
              <span className="pill-tag pill-green">Aprovado pela Coordenação</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Elaborado pela Equipe Exploradores para as turmas do 6º Ano do Ensino Fundamental.
            </p>
            <div style={{ fontSize: '0.72rem', color: 'var(--kodic-fuchsia)', fontWeight: 700, marginTop: '4px' }}>
              ✨ Ajudou 24 alunos nesta semana em recuperação paralela.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
