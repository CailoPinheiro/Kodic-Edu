/* Kodic Edu — Enhanced Application Logic & State Manager with Side Drawer */

window.KodicApp = {
  currentMode: 'student', // 'student' | 'shared' | 'teacher'
  activeTab: 'inicio', // 'inicio' | 'grupo' | 'missoes' | 'impacto' | 'teacher'
  hubView: 'turma', // 'turma' | 'escola'
  activeStudentRole: 'Curador',
  isDarkMode: true,
  focoAtivo: false,
  isDrawerOpen: false,

  init() {
    this.setupEventListeners();
    this.renderCurrentView();
    window.KodicComponents.renderSideDrawerContent('side-drawer-content');
    this.showToast("🚀 Kodic Edu — Interface Limpa & Barra Lateral Pronta!");
  },

  setupEventListeners() {
    // Mode Switcher Buttons (Top Header Toolbar)
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetMode = e.currentTarget.getAttribute('data-mode');
        this.switchMode(targetMode);
      });
    });

    // App Bottom Navigation Bar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        navItems.forEach(i => i.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });
  },

  toggleDrawer(open) {
    this.isDrawerOpen = typeof open === 'boolean' ? open : !this.isDrawerOpen;
    const drawer = document.getElementById('side-drawer');
    const overlay = document.getElementById('drawer-overlay');

    if (drawer && overlay) {
      drawer.classList.toggle('open', this.isDrawerOpen);
      overlay.classList.toggle('open', this.isDrawerOpen);
    }
  },

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('light-theme', !this.isDarkMode);

    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = this.isDarkMode ? 'inline-block' : 'none';
      moonIcon.style.display = this.isDarkMode ? 'none' : 'inline-block';
    }

    this.showToast(this.isDarkMode ? "🌙 Modo Escuro Ativado" : "☀️ Modo Claro Ativado");
  },

  toggleFocusMode() {
    this.focoAtivo = !this.focoAtivo;
    window.KodicComponents.renderFocusModeCard('drawer-focus-widget');
    this.showToast(this.focoAtivo ? "⚡ Modo Foco Ativado! Notificações silenciadas por 25min." : "⏸️ Modo Foco desativado.");
  },

  switchMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });

    if (mode === 'teacher') {
      this.activeTab = 'teacher';
    } else if (mode === 'shared') {
      this.activeTab = 'grupo';
      this.hubView = 'turma';
    } else {
      this.activeTab = 'inicio';
    }

    document.querySelectorAll('.nav-item').forEach(i => {
      i.classList.toggle('active', i.getAttribute('data-tab') === this.activeTab);
    });

    this.renderCurrentView();
  },

  switchTab(tab) {
    this.activeTab = tab;
    if (tab === 'teacher') {
      this.currentMode = 'teacher';
    } else if (this.currentMode === 'teacher') {
      this.currentMode = 'student';
    }

    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-mode') === this.currentMode);
    });

    this.renderCurrentView();
  },

  switchHubView(view) {
    this.hubView = view;
    this.renderCurrentView();
    this.showToast(view === 'turma' ? "👥 Exibindo espaço da Minha Turma" : "🌐 Exibindo Hub da Escola (Mentoria Global)");
  },

  renderCurrentView() {
    const screen = document.getElementById('screen-container');
    if (!screen) return;

    if (this.activeTab === 'inicio') {
      // Clean, spacious Home Tab!
      screen.innerHTML = `
        <div id="official-anns-widget"></div>
        <div id="class-goal-widget"></div>
        <div id="quiz-widget"></div>
      `;
      window.KodicComponents.renderOfficialAnnouncements('official-anns-widget');
      window.KodicComponents.renderClassGoalBar('class-goal-widget');
      window.KodicComponents.renderQuizWidget('quiz-widget');

    } else if (this.activeTab === 'grupo') {
      screen.innerHTML = `
        <div id="hub-toggle-widget"></div>
        <div id="hub-content-area"></div>
      `;
      window.KodicComponents.renderHubToggle('hub-toggle-widget');

      const contentArea = document.getElementById('hub-content-area');
      if (this.hubView === 'turma') {
        contentArea.innerHTML = `
          <div id="group-id-widget"></div>
          <div id="shared-group-widget"></div>
          <div id="notebook-widget"></div>
        `;
        window.KodicComponents.renderGroupIdentificationCard('group-id-widget');
        window.KodicComponents.renderSharedDeviceGroup('shared-group-widget');
        window.KodicComponents.renderNotebookUpload('notebook-widget');
      } else {
        contentArea.innerHTML = `<div id="school-global-widget"></div>`;
        window.KodicComponents.renderSchoolHubGlobalView('school-global-widget');
      }

    } else if (this.activeTab === 'missoes') {
      screen.innerHTML = `
        <div id="class-goal-widget"></div>
        <div id="tracks-widget"></div>
      `;
      window.KodicComponents.renderClassGoalBar('class-goal-widget');
      window.KodicComponents.renderLearningTracks('tracks-widget');

    } else if (this.activeTab === 'impacto') {
      screen.innerHTML = `<div id="gratitude-widget"></div>`;
      window.KodicComponents.renderGratitudeDrawer('gratitude-widget');

    } else if (this.activeTab === 'teacher') {
      screen.innerHTML = `
        <div id="class-goal-widget"></div>
        <div id="teacher-ai-widget"></div>
        <div id="teacher-heatmap-widget"></div>
      `;
      window.KodicComponents.renderClassGoalBar('class-goal-widget');
      window.KodicComponents.renderTeacherAIGenerator('teacher-ai-widget');
      window.KodicComponents.renderLearningHeatmap('teacher-heatmap-widget');
    }

    window.KodicComponents.refreshIcons();
  },

  approveModerationItem(itemId) {
    window.KodicData.moderationQueue = window.KodicData.moderationQueue.filter(i => i.id !== itemId);
    window.KodicComponents.renderSideDrawerContent('side-drawer-content');
    this.showToast("✅ Item aprovado pelo Líder de Turma!");
  },

  selectRole(roleKey) {
    this.activeStudentRole = roleKey;
    window.KodicComponents.renderRoleSelector('drawer-role-widget');
    this.showToast(`✨ Perfil de Inteligência atualizado para: ${roleKey}`);
  },

  submitQuizAnswer(selectedIndex) {
    const quiz = window.KodicData.quizzes[0];
    const options = document.querySelectorAll('.quiz-option');

    options.forEach((opt, idx) => {
      if (idx === quiz.correctIndex) {
        opt.classList.add('correct');
      } else if (idx === selectedIndex) {
        opt.classList.add('wrong');
      }
      opt.style.pointerEvents = 'none';
    });

    if (selectedIndex === quiz.correctIndex) {
      const members = window.KodicData.sharedGroup.members;
      members.forEach(m => {
        m.points += quiz.pointsReward;
        
        const card = document.getElementById(`card-${m.id}`);
        if (card) {
          const pop = document.createElement('div');
          pop.className = 'point-pop';
          pop.innerText = `+${quiz.pointsReward} pts`;
          card.appendChild(pop);
          setTimeout(() => pop.remove(), 1200);

          const ptsEl = document.getElementById(`pts-${m.id}`);
          if (ptsEl) ptsEl.innerText = `${m.points} pts`;
          card.classList.add('active-quiz');
        }
      });

      window.KodicData.currentClass.currentGoalPoints += (quiz.pointsReward * 4);
      const newTotal = window.KodicData.currentClass.currentGoalPoints;
      const target = window.KodicData.currentClass.classGoalPoints;
      const pct = Math.min(100, Math.round((newTotal / target) * 100));

      const fill = document.getElementById('class-progress-fill');
      const ptsTxt = document.getElementById('class-current-pts');
      if (fill) fill.style.width = `${pct}%`;
      if (ptsTxt) ptsTxt.innerText = newTotal.toLocaleString();

      this.showToast(`🎉 Resposta Correta! +${quiz.pointsReward * 4} pts adicionados à Turma!`);
    } else {
      this.showToast("❌ Resposta incorreta. Revise o tema com seu Revisor!");
    }
  },

  simulateNotebookUpload() {
    const newItem = {
      id: `item_${Date.now()}`,
      type: "HANDWRITTEN_NOTEBOOK",
      title: "Mapa Mental: Urbanização no Brasil",
      author: "Alex Silva (Curador)",
      image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=400&auto=format&fit=crop&q=80",
      date: "Agora mesmo",
      badge: "Print de Caderno"
    };

    window.KodicData.repositoryItems.unshift(newItem);
    window.KodicComponents.renderNotebookUpload('notebook-widget');
    this.showToast("📸 Foto do caderno enviada e otimizada (142KB)!");
  },

  generateAIQuiz() {
    const outputBox = document.getElementById('ai-output-box');
    if (!outputBox) return;

    outputBox.innerHTML = `
      <div style="text-align: center; padding: 20px 0; color: var(--kodic-fuchsia);">
        <i data-lucide="loader-2" class="spin" style="width: 2rem; height: 2rem; margin-bottom: 8px;"></i>
        <div style="font-size: 0.85rem; font-weight: 700;">Consultando API bncc.dev & IA...</div>
      </div>
    `;
    window.KodicComponents.refreshIcons();

    setTimeout(() => {
      outputBox.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid var(--kodic-green); border-radius: var(--radius-md); padding: 12px; animation: slideDown 0.3s ease-out;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="font-size: 0.85rem; color: var(--kodic-green);">Quiz Estruturado pela IA</strong>
            <span class="pill-tag pill-green">BNCC EM13CHS101</span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">Pergunta Gerada:</div>
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 10px;">
            "De que maneira as transformações do espaço urbano pós-1950 impactaram a organização do trabalho?"
          </p>
          <div style="display: flex; gap: 8px;">
            <button class="btn-primary" style="padding: 8px 14px; font-size: 0.75rem;" onclick="KodicApp.publishAIQuiz()">
              <i data-lucide="send"></i> Publicar para a Turma
            </button>
          </div>
        </div>
      `;
      window.KodicComponents.refreshIcons();
      this.showToast("🤖 Quiz gerado com sucesso pela IA!");
    }, 1200);
  },

  publishAIQuiz() {
    this.showToast("🚀 Quiz publicado para os alunos com sucesso!");
    this.switchTab('missoes');
  },

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="bell" style="color: var(--kodic-fuchsia);"></i><span>${message}</span>`;
    container.appendChild(toast);
    window.KodicComponents.refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.KodicApp.init();
});
