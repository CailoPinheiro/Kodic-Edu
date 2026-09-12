/* Kodic Edu — Enhanced UI Components with Side Drawer Support */

window.KodicComponents = {
  refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  // Render Side Drawer Menu Content (Barra Lateral)
  renderSideDrawerContent(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const prof = window.KodicData.userProfile;

    let html = `
      <div class="drawer-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i data-lucide="menu" style="color: var(--kodic-fuchsia);"></i>
          <strong style="font-size: 1rem;">Menu & Configurações</strong>
        </div>
        <button class="icon-btn" style="width: 28px; height: 28px;" onclick="KodicApp.toggleDrawer(false)">
          <i data-lucide="x"></i>
        </button>
      </div>

      <!-- 1. Perfil do Aluno Header & Badges -->
      <div class="profile-card" style="margin-bottom: 12px; padding: 10px;">
        <div class="profile-avatar-row" style="gap: 10px; margin-bottom: 6px;">
          <div class="profile-avatar-box" style="width: 44px; height: 44px;">
            <div class="profile-avatar-inner">
              <i data-lucide="user"></i>
            </div>
            <div class="verified-icon"><i data-lucide="check"></i></div>
          </div>
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 800;">${prof.name}</h3>
            <p style="font-size: 0.72rem; color: var(--text-secondary);">${prof.grade}</p>
          </div>
        </div>
        <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px;">
    `;

    prof.badges.forEach(b => {
      html += `<span class="pill-tag pill-amber">${b.title}</span>`;
    });

    html += `
        </div>
      </div>

      <!-- 2. Perfil de Inteligência (Configuração de Papel) -->
      <div id="drawer-role-widget"></div>

      <!-- 3. Modo Foco & Pomodoro -->
      <div id="drawer-focus-widget"></div>

      <!-- 4. Moderação em Camadas -->
      <div id="drawer-moderation-widget"></div>

      <!-- 5. Hub da Escola & Mentoria Global -->
      <div style="margin-top: 10px;">
        <button class="btn-primary" style="background: linear-gradient(135deg, var(--kodic-orange), var(--kodic-pink));" onclick="KodicApp.toggleDrawer(false); KodicApp.switchHubView('escola'); KodicApp.switchTab('grupo');">
          <i data-lucide="globe-2"></i> Hub da Escola (Mentoria)
        </button>
      </div>

      <!-- 6. Acesso ao Painel do Professor -->
      <div style="margin-top: 8px;">
        <button class="btn-primary" style="background: var(--bg-card-sub); border: 1px solid var(--border-glass); color: var(--text-primary);" onclick="KodicApp.toggleDrawer(false); KodicApp.switchMode('teacher');">
          <i data-lucide="graduation-cap" style="color: var(--kodic-fuchsia);"></i> Painel Professor & IA
        </button>
      </div>
    `;

    container.innerHTML = html;
    this.renderRoleSelector('drawer-role-widget');
    this.renderFocusModeCard('drawer-focus-widget');
    this.renderModerationQueue('drawer-moderation-widget');
    this.refreshIcons();
  },

  // Render Group Identification Card
  renderGroupIdentificationCard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const info = window.KodicData.groupIdentification;

    let html = `
      <div class="glass-card">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="folder-tree" style="color: var(--kodic-purple);"></i>
            <span>Identificação do Grupo</span>
          </div>
          <span class="pill-tag pill-purple">${info.groupType}</span>
        </div>
        
        <div style="font-size: 0.75rem; display: flex; flex-direction: column; gap: 4px; color: var(--text-secondary);">
          <div>🏛️ <strong>Escola:</strong> ${info.school}</div>
          <div>🏫 <strong>Turma:</strong> ${info.class} • <strong>Matéria:</strong> ${info.subject}</div>
          <div>👨‍🏫 <strong>Profª:</strong> ${info.teacher}</div>
          <div style="background: var(--bg-card-sub); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 6px 8px; margin-top: 2px; color: var(--text-primary);">
            🎯 <strong>Objetivo:</strong> ${info.objective}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Multi-layer Moderation Queue
  renderModerationQueue(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const queue = window.KodicData.moderationQueue;

    let html = `
      <div class="glass-card">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="shield-check" style="color: var(--kodic-amber);"></i>
            <span>Moderação em Camadas</span>
          </div>
          <span class="pill-tag pill-amber">IA + Líderes</span>
        </div>
    `;

    queue.forEach(item => {
      html += `
        <div style="background: var(--bg-card-sub); border-left: 3px solid var(--kodic-amber); border-radius: var(--radius-md); padding: 8px; margin-bottom: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4 style="font-size: 0.78rem; font-weight: 800;">${item.title}</h4>
            <span class="pill-tag pill-amber">${item.statusBadge}</span>
          </div>
          <div style="font-size: 0.68rem; color: var(--text-secondary); margin: 2px 0 4px;">Por: ${item.author}</div>
          <button class="btn-primary" style="padding: 4px 10px; font-size: 0.68rem; background: linear-gradient(135deg, var(--kodic-amber), var(--kodic-orange));" onclick="KodicApp.approveModerationItem('${item.id}')">
            <i data-lucide="check"></i> Aprovar Publicação
          </button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Focus Mode Card
  renderFocusModeCard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isFocus = window.KodicApp.focoAtivo;

    container.innerHTML = `
      <div class="focus-card ${isFocus ? 'active' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <i data-lucide="timer" style="color: ${isFocus ? 'var(--kodic-green)' : 'var(--kodic-purple)'};"></i>
            <strong style="font-size: 0.85rem;">Modo Foco & Pomodoro</strong>
          </div>
          <div class="toggle-switch ${isFocus ? 'active' : ''}" onclick="KodicApp.toggleFocusMode()">
            <div class="toggle-knob"></div>
          </div>
        </div>
        <p style="font-size: 0.72rem; color: var(--text-secondary); line-height: 1.3;">
          ${isFocus ? "🔒 Notificações silenciadas (25min)." : "Silencie redes sociais para atenção total."}
        </p>
      </div>
    `;
    this.refreshIcons();
  },

  // Render Official Announcements Board
  renderOfficialAnnouncements(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const anns = window.KodicData.officialAnnouncements;

    let html = `
      <div class="glass-card">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="megaphone" style="color: var(--kodic-fuchsia);"></i>
            <span>Quadro Oficial da Escola</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
    `;

    anns.forEach(a => {
      html += `
        <div style="background: var(--bg-card-sub); border-left: 4px solid ${a.color}; border-radius: var(--radius-md); padding: 8px 10px;">
          <span class="pill-tag pill-fuchsia" style="margin-bottom: 3px; display: inline-block;">${a.tag}</span>
          <h4 style="font-size: 0.82rem; font-weight: 800;">${a.title}</h4>
          <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${a.desc}</p>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Hub Toggle
  renderHubToggle(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const view = window.KodicApp.hubView || 'turma';

    container.innerHTML = `
      <div class="hub-toggle-box">
        <button class="hub-toggle-btn ${view === 'turma' ? 'active-turma' : ''}" onclick="KodicApp.switchHubView('turma')">
          <i data-lucide="users"></i> Minha Turma
        </button>
        <button class="hub-toggle-btn ${view === 'escola' ? 'active-escola' : ''}" onclick="KodicApp.switchHubView('escola')">
          <i data-lucide="globe-2"></i> Hub da Escola (Global)
        </button>
      </div>
    `;
    this.refreshIcons();
  },

  // Render Global School Hub View
  renderSchoolHubGlobalView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const contribs = window.KodicData.globalSchoolContributions;

    let html = `
      <div style="background: linear-gradient(135deg, var(--kodic-orange), var(--kodic-pink)); border-radius: var(--radius-xl); padding: 16px; color: #fff; margin-bottom: 14px; position: relative; overflow: hidden;">
        <i data-lucide="graduation-cap" style="position: absolute; right: -10px; top: -10px; width: 5rem; height: 5rem; opacity: 0.15;"></i>
        <h3 style="font-size: 1.05rem; font-weight: 900; margin-bottom: 4px;">Programa de Mentoria Solidária</h3>
        <p style="font-size: 0.75rem; opacity: 0.95; margin-bottom: 10px;">
          Compartilhe seu conhecimento com alunos de séries mais novas e conquiste Badges.
        </p>
        <button class="btn-primary" style="background: #fff; color: var(--kodic-orange); border: none;" onclick="KodicApp.showToast('📝 Solicitação enviada para a coordenação!')">
          <i data-lucide="plus-circle"></i> Solicitar Envio de Material
        </button>
      </div>

      <div class="glass-card">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="award" style="color: var(--kodic-orange);"></i>
            <span>Suas Contribuições Globais</span>
          </div>
        </div>
    `;

    contribs.forEach(c => {
      html += `
        <div style="background: var(--bg-card-sub); border-left: 3px solid var(--kodic-green); border-radius: var(--radius-md); padding: 10px; margin-bottom: 6px;">
          <span class="pill-tag pill-green" style="margin-bottom: 2px; display: inline-block;">${c.status}</span>
          <h4 style="font-size: 0.82rem; font-weight: 800;">${c.title}</h4>
          <p style="font-size: 0.72rem; color: var(--text-secondary);">${c.targetGrade}</p>
          <div style="margin-top: 4px; font-size: 0.72rem; color: var(--kodic-pink); display: flex; align-items: center; gap: 4px;">
            <i data-lucide="heart"></i> <span>${c.impactText}</span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Activity Formats & Learning Tracks
  renderLearningTracks(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tracks = window.KodicData.learningTracks;

    let html = ``;

    tracks.forEach(t => {
      html += `
        <div class="glass-card">
          <div class="card-title">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="layout-list" style="color: var(--kodic-fuchsia);"></i>
              <span>Missão Completa (Trilha)</span>
            </div>
            <span class="pill-tag pill-fuchsia">${t.badge}</span>
          </div>
          <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 4px;">${t.title}</h3>
          <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 10px;">${t.desc}</p>
          
          <div class="progress-track" style="margin-bottom: 10px;">
            <div class="progress-fill" style="width: ${t.progressPct}%;"></div>
          </div>

          <button class="btn-primary" onclick="KodicApp.showToast('🚀 Continuando trilha da turma!')">
            Continuar Trilha (${t.progressPct}%)
          </button>
        </div>
      `;
    });

    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Class Goal Progress Bar
  renderClassGoalBar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = window.KodicData.currentClass;
    const percentage = Math.min(100, Math.round((data.currentGoalPoints / data.classGoalPoints) * 100));

    container.innerHTML = `
      <div class="class-bar-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 800;">
            <i data-lucide="users" style="color: var(--kodic-fuchsia);"></i>
            <span>Conquista da Turma: ${data.name}</span>
          </div>
          <span class="pill-tag pill-fuchsia">${percentage}% Meta</span>
        </div>
        <div class="progress-track" style="margin: 6px 0 8px;">
          <div class="progress-fill" id="class-progress-fill" style="width: ${percentage}%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--text-secondary);">
          <span><strong style="color: var(--text-primary);" id="class-current-pts">${data.currentGoalPoints.toLocaleString()}</strong> / ${data.classGoalPoints.toLocaleString()} pts</span>
          <span>Prêmio: <strong>${data.rewardTitle}</strong></span>
        </div>
      </div>
    `;
    this.refreshIcons();
  },

  // Render 4-in-1 Shared Device Group Widget
  renderSharedDeviceGroup(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const members = window.KodicData.sharedGroup.members;

    let html = `
      <div class="glass-card">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="smartphone" style="color: var(--kodic-green);"></i>
            <span>Modo Compartilhado (4 Alunos / 1 Celular)</span>
          </div>
          <span class="pill-tag pill-green">Sincronizado</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 10px;">
          1 único dispositivo conecta 4 estudantes. Respostas do grupo pontuam igualmente para todos.
        </p>
        <div class="shared-grid" id="shared-students-grid">
    `;

    members.forEach(m => {
      html += `
        <div class="student-mini-card" id="card-${m.id}">
          <div class="avatar-wrapper">
            <img src="${m.avatar}" class="avatar-img" alt="${m.name}">
            <div class="role-badge-icon" style="background: ${m.roleColor};" title="${m.role}">
              <i data-lucide="${m.roleIcon}"></i>
            </div>
          </div>
          <div class="student-info">
            <div class="student-name">${m.name} ${m.hasPhone ? '📱' : ''}</div>
            <div style="font-size: 0.65rem; color: var(--text-secondary);">${m.role}</div>
            <div class="student-points" id="pts-${m.id}">${m.points} pts</div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Interactive Quiz
  renderQuizWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const quiz = window.KodicData.quizzes[0];

    let html = `
      <div class="glass-card" id="quiz-card-box">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="brain-circuit" style="color: var(--kodic-fuchsia);"></i>
            <span>Quiz Rápido Coletivo</span>
          </div>
          <span class="pill-tag pill-blue">BNCC ${quiz.bnccCode}</span>
        </div>
        <p style="font-size: 0.85rem; font-weight: 600; line-height: 1.35; margin-bottom: 12px;">
          ${quiz.question}
        </p>
        <div id="quiz-options-list">
    `;

    quiz.options.forEach((opt, idx) => {
      html += `
        <div class="quiz-option" data-index="${idx}" onclick="KodicApp.submitQuizAnswer(${idx})">
          <div style="width: 22px; height: 22px; border-radius: 50%; border: 1px solid var(--border-glass); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0;">
            ${String.fromCharCode(65 + idx)}
          </div>
          <span>${opt}</span>
        </div>
      `;
    });

    html += `
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 0.72rem; color: var(--text-secondary);">
          <span>Recompensa: <strong style="color: var(--kodic-green);">+${quiz.pointsReward} pts/aluno</strong></span>
          <span>Validado por Revisores</span>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Multiple Intelligences Role Selector
  renderRoleSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const roles = window.KodicData.roleDefinitions;
    const currentRole = window.KodicApp.activeStudentRole || "Curador";

    let html = `
      <div class="glass-card" style="padding: 10px;">
        <div class="card-title" style="margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <i data-lucide="user-check" style="color: var(--kodic-pink);"></i>
            <span style="font-size: 0.85rem;">Perfil de Inteligência</span>
          </div>
          <span class="pill-tag pill-amber" style="font-size: 0.6rem;">Sem Exposição</span>
        </div>
        <div class="roles-grid">
    `;

    Object.keys(roles).forEach(key => {
      const r = roles[key];
      const isSelected = key === currentRole;
      html += `
        <div class="role-card ${isSelected ? 'selected' : ''}" onclick="KodicApp.selectRole('${key}')">
          <i data-lucide="${r.icon}" style="color: ${r.color};"></i>
          <span>${key}</span>
        </div>
      `;
    });

    const activeDef = roles[currentRole];

    html += `
        </div>
        <div style="background: var(--bg-card-sub); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
            <strong style="font-size: 0.78rem; color: ${activeDef.color};">${activeDef.title}</strong>
            <span class="pill-tag pill-purple" style="font-size: 0.6rem;">${activeDef.badge}</span>
          </div>
          <p style="font-size: 0.72rem; color: var(--text-secondary); line-height: 1.3;">
            ${activeDef.desc}
          </p>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Silent Gratitude Notifications
  renderGratitudeDrawer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const notifs = window.KodicData.gratitudeNotifications;

    let html = `
      <div class="glass-card">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="heart" style="color: var(--kodic-pink);"></i>
            <span>Seu Impacto Silencioso (Gratidão Privada)</span>
          </div>
          <span class="pill-tag pill-fuchsia">Sem Métricas de Vaidade</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 10px;">
          Notificações privadas sobre a utilidade real dos seus estudos, sem curtidas públicas ou rankings tóxicos.
        </p>
    `;

    notifs.forEach(n => {
      html += `
        <div class="gratitude-item">
          <div class="gratitude-icon">
            <i data-lucide="${n.icon}"></i>
          </div>
          <div class="gratitude-content">
            <div class="gratitude-title">${n.title}</div>
            <div class="gratitude-text">${n.text}</div>
            <div style="font-size: 0.68rem; color: var(--kodic-fuchsia); opacity: 0.8; margin-top: 3px;">${n.timestamp} • Privado apenas para você</div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Hybrid Physical/Digital Notebook Upload
  renderNotebookUpload(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = window.KodicData.repositoryItems;

    let html = `
      <div class="glass-card">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="camera" style="color: var(--kodic-amber);"></i>
            <span>Resolução Híbrida (Foto do Caderno)</span>
          </div>
          <span class="pill-tag pill-amber">Físico + Digital</span>
        </div>
        <div style="background: var(--bg-card-sub); border: 1px dashed var(--border-glass-light); border-radius: var(--radius-md); padding: 12px; text-align: center; margin-bottom: 10px; cursor: pointer;" onclick="KodicApp.simulateNotebookUpload()">
          <i data-lucide="upload" style="color: var(--kodic-fuchsia); width: 22px; height: 22px; margin-bottom: 4px;"></i>
          <div style="font-size: 0.8rem; font-weight: 800;">Anexar Foto do Caderno</div>
          <div style="font-size: 0.68rem; color: var(--text-secondary);">Compressão otimizada &lt; 200KB no dispositivo</div>
        </div>
        <div style="font-size: 0.78rem; font-weight: 700; margin-bottom: 6px;">Prateleira de Estudos do Grupo:</div>
        <div id="repository-items-list">
    `;

    items.forEach(it => {
      html += `
        <div style="background: var(--bg-card-sub); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 8px; margin-bottom: 6px; display: flex; gap: 8px; align-items: center;">
          <img src="${it.image || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&auto=format&fit=crop&q=80'}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" alt="${it.title}">
          <div style="flex: 1; overflow: hidden;">
            <div style="font-size: 0.78rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${it.title}</div>
            <div style="font-size: 0.68rem; color: var(--text-secondary);">${it.author} • ${it.date}</div>
          </div>
          <span class="pill-tag pill-purple">${it.badge}</span>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Teacher AI Quiz Generator View
  renderTeacherAIGenerator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="glass-card">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="sparkles" style="color: var(--kodic-fuchsia);"></i>
            <span>Painel do Professor — Gerador de Quiz via IA</span>
          </div>
          <span class="pill-tag pill-fuchsia">Zero Sobrecarga</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 10px;">
          Cole seu plano de aula ou resumo para a IA estruturar desafios alinhados à BNCC.
        </p>

        <textarea id="ai-input-text" style="width: 100%; height: 80px; background: var(--bg-card-sub); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 8px; color: var(--text-primary); font-family: inherit; font-size: 0.78rem; resize: none; margin-bottom: 10px;" placeholder="Exemplo: Aula sobre urbanização, industrialização e matrizes energéticas..."></textarea>

        <button class="btn-primary" onclick="KodicApp.generateAIQuiz()">
          <i data-lucide="wand-2"></i>
          <span>Gerar Quiz Alinhado à BNCC</span>
        </button>

        <div id="ai-output-box" style="margin-top: 10px;"></div>
      </div>
    `;

    container.innerHTML = html;
    this.refreshIcons();
  },

  // Render Teacher Learning Analytics Heatmap
  renderLearningHeatmap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = window.KodicData.teacherHeatmap;

    let html = `
      <div class="glass-card">
        <div class="card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="bar-chart-3" style="color: var(--kodic-green);"></i>
            <span>Learning Analytics (Mapa de Calor)</span>
          </div>
          <span class="pill-tag pill-green">Sem Vigilância</span>
        </div>

        <div class="heatmap-grid">
    `;

    data.forEach(h => {
      html += `
        <div class="heatmap-cell ${h.level}" title="${h.desc}">
          <div>${h.skill}</div>
          <div style="font-size: 0.8rem; font-weight: 800; margin-top: 2px;">${h.mastery}</div>
        </div>
      `;
    });

    html += `
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.68rem; color: var(--text-secondary);">
          <span>🟢 &gt;80% Dominado</span>
          <span>🟡 60-80% Médio</span>
          <span>🔴 &lt;60% Atenção</span>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.refreshIcons();
  }
};
