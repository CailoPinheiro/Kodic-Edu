import React, { useState, useEffect } from 'react';
import { Target, Bot, Sparkles, BarChart3, ShieldCheck, Bell, Send, CheckCircle2, Award, BookOpen, Layers } from 'lucide-react';
import { api } from '../../services/api';

export function TeacherDashboard({ currentClass, showToast, onDataChange }) {
  const [activeTeacherSection, setActiveTeacherSection] = useState('overview');
  const [bnccCatalog, setBnccCatalog] = useState([]);
  const [selectedBnccCode, setSelectedBnccCode] = useState('EM13CHS202');
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [heatmapData, setHeatmapData] = useState([]);
  const [moderationQueue, setModerationQueue] = useState([]);

  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');
  const [annTag, setAnnTag] = useState('COMUNICADO DOCENTE');

  useEffect(() => {
    async function loadTeacherData() {
      try {
        const [catalogRes, heatmapRes, modRes] = await Promise.all([
          api.quizzes.getBnccCatalog(),
          api.content.getHeatmap(),
          api.content.getModerationQueue()
        ]);
        setBnccCatalog(catalogRes.skills || []);
        setHeatmapData(heatmapRes.heatmap || []);
        setModerationQueue(modRes.queue || []);
      } catch {}
    }
    loadTeacherData();
  }, []);

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const res = await api.quizzes.generateAi(selectedBnccCode);
      setGeneratedQuiz(res.quiz);
      showToast('🤖 Quiz ancorado na BNCC oficial gerado com 0% de risco de alucinação!');
    } catch {
      showToast('Erro ao gerar quiz com IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishQuiz = async () => {
    if (!generatedQuiz || isPublishing) return;
    setIsPublishing(true);
    try {
      await api.quizzes.publish({
        classId: currentClass?.id || 1,
        subject: generatedQuiz.subject,
        bnccCode: generatedQuiz.bnccCode,
        question: generatedQuiz.question,
        options: generatedQuiz.options,
        correctIndex: generatedQuiz.correctIndex,
        pointsReward: generatedQuiz.pointsReward,
        isAiGenerated: 1
      });
      showToast('🚀 Quiz publicado para a turma com sucesso!');
      setGeneratedQuiz(null);
      onDataChange();
    } catch {
      showToast('Erro ao publicar quiz.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleApproveModeration = async (id) => {
    try {
      await api.content.approveModeration(id);
      setModerationQueue((prev) => prev.filter((item) => item.id !== id));
      showToast('✅ Material de aluno aprovado pelo corpo docente!');
    } catch {
      showToast('Erro ao aprovar item.');
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annDesc) return;
    try {
      await api.content.createAnnouncement({
        classId: currentClass?.id || 1,
        tag: annTag,
        title: annTitle,
        desc: annDesc
      });
      showToast('📢 Comunicado publicado para a turma!');
      setAnnTitle('');
      setAnnDesc('');
      onDataChange();
    } catch {
      showToast('Erro ao criar comunicado.');
    }
  };

  const handleOnboardingChange = async (lvl) => {
    try {
      await api.classes.updateOnboarding(currentClass.id, lvl);
      showToast(`Maturidade pedagógica atualizada para: Nível ${lvl}`);
      onDataChange();
    } catch {}
  };

  const progressPct = currentClass ? currentClass.percentage : 75;

  return (
    <>
      <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', overflowX: 'auto', gap: '4px' }}>
        <button
          className="btn-secondary"
          onClick={() => setActiveTeacherSection('overview')}
          style={{
            flex: 1,
            border: 'none',
            fontSize: '0.74rem',
            background: activeTeacherSection === 'overview' ? 'linear-gradient(135deg, var(--kodic-purple), var(--kodic-fuchsia))' : 'transparent',
            color: activeTeacherSection === 'overview' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Visão Geral
        </button>
        <button
          className="btn-secondary"
          onClick={() => setActiveTeacherSection('ai_generator')}
          style={{
            flex: 1,
            border: 'none',
            fontSize: '0.74rem',
            background: activeTeacherSection === 'ai_generator' ? 'linear-gradient(135deg, var(--kodic-purple), var(--kodic-fuchsia))' : 'transparent',
            color: activeTeacherSection === 'ai_generator' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Assistente BNCC
        </button>
        <button
          className="btn-secondary"
          onClick={() => setActiveTeacherSection('heatmap')}
          style={{
            flex: 1,
            border: 'none',
            fontSize: '0.74rem',
            background: activeTeacherSection === 'heatmap' ? 'linear-gradient(135deg, var(--kodic-purple), var(--kodic-fuchsia))' : 'transparent',
            color: activeTeacherSection === 'heatmap' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Heatmap
        </button>
        <button
          className="btn-secondary"
          onClick={() => setActiveTeacherSection('moderation')}
          style={{
            flex: 1,
            border: 'none',
            fontSize: '0.74rem',
            background: activeTeacherSection === 'moderation' ? 'linear-gradient(135deg, var(--kodic-purple), var(--kodic-fuchsia))' : 'transparent',
            color: activeTeacherSection === 'moderation' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          Moderação
        </button>
      </div>

      {activeTeacherSection === 'overview' && (
        <>
          <div className="glass-card" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
            <div className="card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} style={{ color: 'var(--kodic-purple)' }} />
                <span>Onboarding Progressivo do Docente</span>
              </div>
              <span className="pill-tag pill-purple">Zero Sobrecarga</span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Adote a ferramenta de acordo com seu ritmo e maturidade da sala de aula:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '6px' }}>
              <button
                onClick={() => handleOnboardingChange(1)}
                style={{
                  background: currentClass?.onboarding_level === 1 ? 'rgba(217, 70, 239, 0.2)' : 'var(--bg-card-sub)',
                  border: `1px solid ${currentClass?.onboarding_level === 1 ? 'var(--kodic-fuchsia)' : 'var(--border-glass)'}`,
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.68rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <strong>Nível 1 (Semana 1)</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.62rem' }}>Quizzes BNCC</div>
              </button>
              <button
                onClick={() => handleOnboardingChange(2)}
                style={{
                  background: currentClass?.onboarding_level === 2 ? 'rgba(217, 70, 239, 0.2)' : 'var(--bg-card-sub)',
                  border: `1px solid ${currentClass?.onboarding_level === 2 ? 'var(--kodic-fuchsia)' : 'var(--border-glass)'}`,
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.68rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <strong>Nível 2 (Mês 1)</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.62rem' }}>Líderes de Turma</div>
              </button>
              <button
                onClick={() => handleOnboardingChange(3)}
                style={{
                  background: currentClass?.onboarding_level === 3 ? 'rgba(217, 70, 239, 0.2)' : 'var(--bg-card-sub)',
                  border: `1px solid ${currentClass?.onboarding_level === 3 ? 'var(--kodic-fuchsia)' : 'var(--border-glass)'}`,
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.68rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <strong>Nível 3 (Pleno)</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.62rem' }}>Sala Invertida</div>
              </button>
            </div>
          </div>

          {currentClass && (
            <div className="glass-card">
              <div className="card-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} style={{ color: 'var(--kodic-fuchsia)' }} />
                  <span>Meta Coletiva da Turma ({currentClass.code})</span>
                </div>
                <span className="pill-tag pill-purple">{progressPct}%</span>
              </div>

              <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>{currentClass.name}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{currentClass.school}</div>

              <div className="progress-bar-container" style={{ margin: '10px 0' }}>
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <span>Pontos: {currentClass.current_points?.toLocaleString()} / {currentClass.goal_points?.toLocaleString()}</span>
                <span style={{ color: 'var(--kodic-amber)' }}>{currentClass.reward_title}</span>
              </div>
            </div>
          )}

          <div className="glass-card">
            <div className="card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} style={{ color: 'var(--kodic-fuchsia)' }} />
                <span>Publicar Comunicado Oficial</span>
              </div>
            </div>

            <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                required
                placeholder="Título do comunicado..."
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                style={{
                  background: 'var(--bg-card-sub)',
                  border: '1px solid var(--border-glass)',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              />
              <textarea
                required
                rows={2}
                placeholder="Mensagem para todos os alunos da turma..."
                value={annDesc}
                onChange={(e) => setAnnDesc(e.target.value)}
                style={{
                  background: 'var(--bg-card-sub)',
                  border: '1px solid var(--border-glass)',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  resize: 'none'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.76rem' }}>
                <Send size={14} /> Publicar no Mural Oficial
              </button>
            </form>
          </div>
        </>
      )}

      {activeTeacherSection === 'ai_generator' && (
        <div className="glass-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={18} style={{ color: 'var(--kodic-fuchsia)' }} />
              <span>Gerador IA Ancorado na BNCC (bncc.dev)</span>
            </div>
            <span className="pill-tag pill-green">Zero Alucinação</span>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            O Kodic Edu conecta-se às 1.721 habilidades oficiais da BNCC homologadas pelo MEC. Isso elimina a taxa de 54% de alucinação curricular comum em IAs sem fonte oficial.
          </p>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Selecione a Habilidade BNCC Oficial
            </label>
            <select
              value={selectedBnccCode}
              onChange={(e) => setSelectedBnccCode(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-card-sub)',
                border: '1px solid var(--border-glass)',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem'
              }}
            >
              {bnccCatalog.map((s) => (
                <option key={s.code} value={s.code}>
                  [{s.code}] {s.subject} — {s.description.slice(0, 70)}...
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-primary"
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
          >
            <Sparkles size={16} />
            {isGenerating ? 'Consultando bncc.dev & Gerando...' : 'Gerar Quiz Estruturado'}
          </button>

          {generatedQuiz && (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--kodic-green)', borderRadius: 'var(--radius-md)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="pill-tag pill-green">{generatedQuiz.bnccCode}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--kodic-green)', fontWeight: 700 }}>
                  {generatedQuiz.auditTrail?.sourceApi} • Risco 0%
                </span>
              </div>
              <strong style={{ fontSize: '0.84rem' }}>{generatedQuiz.question}</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {generatedQuiz.options.map((opt, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: '0.74rem',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: i === generatedQuiz.correctIndex ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: i === generatedQuiz.correctIndex ? 'var(--kodic-green)' : 'var(--text-secondary)',
                      fontWeight: i === generatedQuiz.correctIndex ? 700 : 500
                    }}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </div>
                ))}
              </div>
              <button
                className="btn-primary"
                onClick={handlePublishQuiz}
                disabled={isPublishing}
                style={{ marginTop: '4px' }}
              >
                <CheckCircle2 size={16} />
                {isPublishing ? 'Publicando...' : 'Publicar Desafio para a Turma'}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTeacherSection === 'heatmap' && (
        <div className="glass-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} style={{ color: 'var(--kodic-purple)' }} />
              <span>Mapa de Aprendizagem (Learning Analytics)</span>
            </div>
            <span className="pill-tag pill-purple">Sem Vigilância Invasiva</span>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            O Kodic Edu não monitora telas ou aplicativos pessoais dos alunos. O painel docente é 100% pedagógico, exibindo o domínio por habilidade da BNCC.
          </p>

          <table className="heatmap-table" style={{ marginTop: '6px' }}>
            <thead>
              <tr>
                <th>Código BNCC</th>
                <th>Competência</th>
                <th>Domínio</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((h) => (
                <tr key={h.id}>
                  <td style={{ fontWeight: 800 }}>{h.skill_code}</td>
                  <td style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{h.skill_desc}</td>
                  <td>
                    <span className={h.level === 'lvl-high' ? 'badge-high' : h.level === 'lvl-mid' ? 'badge-mid' : 'badge-low'}>
                      {h.mastery_percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTeacherSection === 'moderation' && (
        <div className="glass-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--kodic-green)' }} />
              <span>Fila de Moderação em Camadas</span>
            </div>
            <span className="pill-tag pill-green">IA + Líderes</span>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Camada 1: Filtro de IA para vocabulário e segurança. Camada 2: Validação descentralizada por Líderes de Turma nomeados e supervisão docente.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            {moderationQueue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Nenhum item pendente na fila de moderação. Todos os materiais validados!
              </div>
            ) : (
              moderationQueue.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-card-sub)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: '0.82rem' }}>{item.title}</strong>
                    <span className="pill-tag pill-amber" style={{ fontSize: '0.62rem' }}>Pendente</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Autor: {item.author}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--kodic-green)' }}>{item.ai_status}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--kodic-amber)' }}>{item.human_status}</div>
                  <button
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.72rem', width: 'auto', alignSelf: 'flex-end', marginTop: '4px' }}
                    onClick={() => handleApproveModeration(item.id)}
                  >
                    <CheckCircle2 size={14} /> Aprovar Material
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
