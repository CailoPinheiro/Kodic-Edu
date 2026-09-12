/* Kodic Edu — Comprehensive Data Store covering 100% of Specifications */

window.KodicData = {
  // Student Profile Info
  userProfile: {
    name: "Alex Silva",
    grade: "1º Ano A — Ensino Médio",
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badges: [
      {
        id: "b1",
        title: "Líder de Turma",
        desc: "Moderação Ativa",
        icon: "crown",
        color: "var(--kodic-amber)"
      },
      {
        id: "b2",
        title: "Mentor Ouro",
        desc: "Ajudou +50 alunos",
        icon: "award",
        color: "var(--kodic-orange)"
      }
    ]
  },

  // Hierarchical Organization (Escola -> Turma -> Matéria -> Grupo) & Identification Card
  groupIdentification: {
    school: "Escola Estadual Profa. Maria Heloísa",
    class: "1º Ano A — Ensino Médio",
    subject: "Geografia e História Integrada",
    teacher: "Profª. Cláudia Mendes",
    groupName: "Equipe Exploradores da Geografia",
    groupType: "Oficial da Disciplina", // 'Oficial da Disciplina' | 'Grupo de Estudo Livre (Foco ENEM)'
    objective: "Estudo prático da urbanização brasileira e matrizes energéticas (BNCC EM13CHS202)."
  },

  // Class Metadata & Goal
  currentClass: {
    name: "1º Ano A - Ensino Médio",
    school: "Escola Estadual Profa. Maria Heloísa",
    subject: "Geografia e História Integrada",
    teacher: "Profª. Cláudia Mendes",
    classGoalPoints: 8500,
    currentGoalPoints: 6420,
    rewardTitle: "Passeio Cultural Virtual 🏛️"
  },

  // Official Announcements Board
  officialAnnouncements: [
    {
      id: "ann_1",
      tag: "COORDENAÇÃO",
      title: "Feira de Ciências 2026",
      desc: "Inscrições dos projetos em equipe abertas até sexta-feira na secretaria virtual.",
      color: "var(--kodic-fuchsia)"
    }
  ],

  // Active Shared Group (4-in-1 Device Mode)
  sharedGroup: {
    id: "grp_01",
    name: "Equipe Exploradores da Geografia",
    members: [
      {
        id: "usr_101",
        name: "Alex Silva",
        role: "Curador",
        roleIcon: "search",
        roleColor: "var(--kodic-blue)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        points: 480,
        hasPhone: true // Device owner
      },
      {
        id: "usr_102",
        name: "Bia Santos",
        role: "Revisor",
        roleIcon: "check-circle-2",
        roleColor: "var(--kodic-amber)",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        points: 520,
        hasPhone: false
      },
      {
        id: "usr_103",
        name: "Carla Dias",
        role: "Comunicador",
        roleIcon: "mic",
        roleColor: "var(--kodic-pink)",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        points: 430,
        hasPhone: false
      },
      {
        id: "usr_104",
        name: "Diego Alves",
        role: "Curador",
        roleIcon: "search",
        roleColor: "var(--kodic-blue)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        points: 460,
        hasPhone: false
      }
    ]
  },

  // Multiple Intelligences Roles Definitions
  roleDefinitions: {
    Curador: {
      title: "Os Curadores",
      icon: "search",
      badge: "Pesquisador Destaque",
      desc: "Perfil investigativo. Analisa fontes, reúne artigos de qualidade e cria a base conceitual sólida do grupo.",
      color: "var(--kodic-blue)"
    },
    Comunicador: {
      title: "Os Comunicadores",
      icon: "mic",
      badge: "Voz da Equipe",
      desc: "Perfil dinâmico. Porta-voz voluntário para gravar explicações em vídeo/áudio, narrar resumos ou apresentar conclusões.",
      color: "var(--kodic-pink)"
    },
    Revisor: {
      title: "Os Revisores",
      icon: "check-circle-2",
      badge: "Mestre da Lógica",
      desc: "Perfil analítico e detalhista. Revisa perguntas, valida coerência dos dados e garante o controle de qualidade.",
      color: "var(--kodic-amber)"
    }
  },

  // Multi-layer Moderation Queue (Fila de Moderação em Camadas)
  moderationQueue: [
    {
      id: "mod_1",
      title: "Link: Artigo 'Matrizes Energéticas no Brasil'",
      author: "Diego Alves (Curador)",
      aiStatus: "Aprovado por IA (Filtro de Segurança OK)",
      humanStatus: "Aguardando validação do Líder da Turma (Alex Silva)",
      statusBadge: "Fila de Moderação"
    }
  ],

  // Silent Impact Notifications (Private Gratitude System)
  gratitudeNotifications: [
    {
      id: "notif_1",
      icon: "lightbulb",
      title: "Impacto no Aprendizado",
      text: "O mapa mental que você adicionou no Hub de Geografia ajudou 3 colegas a entenderem o conceito hoje.",
      timestamp: "Há 15 min",
      privateOnly: true
    },
    {
      id: "notif_2",
      icon: "award",
      title: "Mentoria Solidária Global",
      text: "Incrível! Seu quiz sobre Frações Básicas foi concluído por 12 alunos do 6º Ano hoje.",
      timestamp: "Hoje, 10:42",
      privateOnly: true
    },
    {
      id: "notif_3",
      icon: "camera",
      title: "Caderno Compartilhado",
      text: "Sua foto de resolução escrita à mão sobre Equações foi salva por 6 colegas.",
      timestamp: "Ontem",
      privateOnly: true
    }
  ],

  // Global School Hub Contributions
  globalSchoolContributions: [
    {
      id: "glob_1",
      title: "Quiz: Frações Básicas",
      targetGrade: "Turmas do 6º Ano",
      status: "APROVADO PELA COORDENAÇÃO",
      impactText: "Ajudou 24 alunos essa semana"
    }
  ],

  // Activity Formats (Quizzes Rápidos, Desafios Práticos, Missões Completas/Trilhas)
  activityFormats: {
    quickQuiz: {
      title: "Quiz Rápido",
      desc: "Perguntas objetivas para revisão dinâmica pré-prova.",
      points: 50
    },
    practicalChallenge: {
      title: "Desafio Prático (Envio Híbrido)",
      desc: "Resolução manuscrita no caderno com foto/print anexado.",
      points: 100
    },
    fullMissionTrack: {
      title: "Missão Completa (Trilha)",
      desc: "Roteiro estruturado: 1 Vídeo + 1 Leitura + 3 Quizzes.",
      points: 250
    }
  },

  // Learning Tracks (Trilhas)
  learningTracks: [
    {
      id: "tr_1",
      title: "Revisão: Guerra Fria e Geopolítica",
      desc: "1 Vídeo • 1 Leitura • 3 Quizzes",
      progressPct: 35,
      badge: "TRILHA COMPLETA"
    }
  ],

  // Interactive Quiz Questions (BNCC Aligned)
  quizzes: [
    {
      id: "q1",
      subject: "Geografia",
      bnccCode: "EM13CHS202",
      question: "Como o conceito de 'Espaço Geográfico Tecnificado' se aplica ao desenvolvimento de cidades inteligentes?",
      options: [
        "Integrando dados em tempo real para otimizar serviços públicos e mobilidade urbana.",
        "Isolando a população sem acesso à internet das redes municipais de saúde.",
        "Substituindo todas as áreas verdes por data centers urbanos centralizados.",
        "Proibindo a utilização de dispositivos móveis no transporte público."
      ],
      correctIndex: 0,
      pointsReward: 50
    }
  ],

  // Repository Items (Hub de Conhecimento - Prateleiras Digitais)
  repositoryItems: [
    {
      id: "item_1",
      type: "HANDWRITTEN_NOTEBOOK",
      title: "Resolução Equação de 2º Grau",
      author: "Alex Silva (Curador)",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
      date: "Hoje, 09:15",
      badge: "Print de Caderno"
    },
    {
      id: "item_2",
      type: "CURATED_LINK",
      title: "Artigo: Transição Energética no Brasil",
      author: "Diego Alves (Curador)",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80",
      date: "Ontem",
      badge: "Link Recomendado"
    }
  ],

  // BNCC Skill Heatmap
  teacherHeatmap: [
    { skill: "EM13CHS101", desc: "Análise de Processos Históricos", mastery: "88%", level: "lvl-high" },
    { skill: "EM13CHS202", desc: "Geografia e Espaço Urbano", mastery: "92%", level: "lvl-high" },
    { skill: "EM13LPT02", desc: "Leitura Crítica de Mídias", mastery: "64%", level: "lvl-mid" },
    { skill: "EM13MAT103", desc: "Raciocínio Lógico e Funções", mastery: "42%", level: "lvl-low" }
  ]
};
