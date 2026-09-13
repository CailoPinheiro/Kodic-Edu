import bcrypt from 'bcryptjs';
import db from './db';

let isSeeded = false;

export function ensureSeeded(): void {
  const checkEnzo = db.prepare('SELECT id FROM users WHERE email = ?').get('enzo@kodic.edu');
  if (!checkEnzo) {
    const defaultPasswordHash = bcrypt.hashSync('senha123', 10);
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (name, email, password_hash, role, grade, intelligence_role, is_leader, points, avatar_url, badges_json, lgpd_consent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertUser.run(
      'Enzo Ribeiro',
      'enzo@kodic.edu',
      defaultPasswordHash,
      'student',
      '1º Ano A — Ensino Médio',
      'Curador',
      0,
      390,
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      JSON.stringify([{ id: 'b6', title: 'Explorador Ágil', desc: 'Inovação e Curiosidade', icon: 'zap', color: 'var(--kodic-blue)' }])
    );

    insertUser.run(
      'Fernanda Lima',
      'fernanda@kodic.edu',
      defaultPasswordHash,
      'student',
      '1º Ano A — Ensino Médio',
      'Revisor',
      0,
      410,
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      JSON.stringify([{ id: 'b7', title: 'Olhar Crítico', desc: 'Atenção aos Detalhes', icon: 'shield-check', color: 'var(--kodic-amber)' }])
    );

    insertUser.run(
      'Gabriel Souza',
      'gabriel@kodic.edu',
      defaultPasswordHash,
      'student',
      '1º Ano A — Ensino Médio',
      'Comunicador',
      0,
      370,
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      JSON.stringify([{ id: 'b8', title: 'Articulador', desc: 'Engajamento e Síntese', icon: 'mic', color: 'var(--kodic-pink)' }])
    );

    const classId = (db.prepare('SELECT id FROM classes WHERE code = ?').get('GEO-2026') as any)?.id;
    if (classId) {
      const insertEnrollment = db.prepare('INSERT OR IGNORE INTO class_enrollments (class_id, student_id) VALUES (?, ?)');
      const getUserId = db.prepare('SELECT id FROM users WHERE email = ?');
      ['enzo@kodic.edu', 'fernanda@kodic.edu', 'gabriel@kodic.edu'].forEach((email) => {
        const u = getUserId.get(email) as any;
        if (u) insertEnrollment.run(classId, u.id);
      });
    }
  }

  if (isSeeded) return;

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('professora@kodic.edu');
  if (existing) {
    isSeeded = true;
    return;
  }

  const seedTransaction = db.transaction(() => {
    const saltRounds = 10;
    const defaultPasswordHash = bcrypt.hashSync('senha123', saltRounds);

    const teacherBadges = JSON.stringify([
      { id: 'b_t1', title: 'Docente Inovador', desc: 'Metodologias Ativas', icon: 'award', color: 'var(--kodic-purple)' },
      { id: 'b_t2', title: 'Mentor BNCC', desc: 'Qualidade Pedagógica', icon: 'book-open', color: 'var(--kodic-green)' }
    ]);

    const alexBadges = JSON.stringify([
      { id: 'b1', title: 'Líder de Turma', desc: 'Moderação Ativa', icon: 'crown', color: 'var(--kodic-amber)' },
      { id: 'b2', title: 'Mentor Ouro', desc: 'Ajudou +50 alunos', icon: 'award', color: 'var(--kodic-orange)' }
    ]);

    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (name, email, password_hash, role, grade, intelligence_role, is_leader, points, avatar_url, badges_json, lgpd_consent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertUser.run(
      'Profª. Cláudia Mendes',
      'professora@kodic.edu',
      defaultPasswordHash,
      'teacher',
      'Ensino Médio e Fundamental II',
      'Curador',
      0,
      1500,
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      teacherBadges
    );

    insertUser.run(
      'Alex Silva',
      'alex@kodic.edu',
      defaultPasswordHash,
      'student',
      '1º Ano A — Ensino Médio',
      'Curador',
      1,
      480,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      alexBadges
    );

    insertUser.run(
      'Bia Santos',
      'bia@kodic.edu',
      defaultPasswordHash,
      'student',
      '1º Ano A — Ensino Médio',
      'Revisor',
      0,
      520,
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      JSON.stringify([{ id: 'b3', title: 'Mestre da Revisão', desc: 'Controle de Qualidade', icon: 'check-circle-2', color: 'var(--kodic-amber)' }])
    );

    insertUser.run(
      'Carla Dias',
      'carla@kodic.edu',
      defaultPasswordHash,
      'student',
      '1º Ano A — Ensino Médio',
      'Comunicador',
      0,
      430,
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      JSON.stringify([{ id: 'b4', title: 'Voz da Equipe', desc: 'Porta-voz do Grupo', icon: 'mic', color: 'var(--kodic-pink)' }])
    );

    insertUser.run(
      'Diego Alves',
      'diego@kodic.edu',
      defaultPasswordHash,
      'student',
      '1º Ano A — Ensino Médio',
      'Curador',
      0,
      460,
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      JSON.stringify([{ id: 'b5', title: 'Pesquisador Destaque', desc: 'Curadoria de Fontes', icon: 'search', color: 'var(--kodic-blue)' }])
    );

    const getUserId = db.prepare('SELECT id FROM users WHERE email = ?');
    const teacherId = (getUserId.get('professora@kodic.edu') as any)?.id;
    const alexId = (getUserId.get('alex@kodic.edu') as any)?.id;
    const biaId = (getUserId.get('bia@kodic.edu') as any)?.id;
    const carlaId = (getUserId.get('carla@kodic.edu') as any)?.id;
    const diegoId = (getUserId.get('diego@kodic.edu') as any)?.id;

    if (!teacherId || !alexId) return;

    const insertClass = db.prepare(`
      INSERT OR IGNORE INTO classes (teacher_id, code, name, school, subject, goal_points, current_points, reward_title, onboarding_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertClass.run(
      teacherId,
      'GEO-2026',
      '1º Ano A — Ensino Médio',
      'Escola Estadual Profa. Maria Heloísa',
      'Geografia e História Integrada',
      8500,
      6420,
      'Passeio Cultural Virtual 🏛️',
      2
    );

    const classId = (db.prepare('SELECT id FROM classes WHERE code = ?').get('GEO-2026') as any)?.id;
    if (!classId) return;

    const insertEnrollment = db.prepare('INSERT OR IGNORE INTO class_enrollments (class_id, student_id) VALUES (?, ?)');
    [alexId, biaId, carlaId, diegoId].forEach((sid) => {
      if (sid) insertEnrollment.run(classId, sid);
    });

    const insertGroup = db.prepare(`
      INSERT OR IGNORE INTO groups (class_id, name, group_type, objective, status, current_device_holder_id)
      VALUES (?, ?, ?, ?, 'approved', ?)
    `);

    insertGroup.run(
      classId,
      'Equipe Exploradores da Geografia',
      'Oficial da Disciplina',
      'Estudo prático da urbanização brasileira e matrizes energéticas (BNCC EM13CHS202).',
      alexId
    );

    insertGroup.run(
      classId,
      'Clube de Estudos Foco ENEM',
      'Grupo de Estudo Livre (Foco ENEM)',
      'Resolução colaborativa de questões e resumos compartilhados.',
      alexId
    );

    const groupId = (db.prepare('SELECT id FROM groups WHERE class_id = ? AND name = ?').get(classId, 'Equipe Exploradores da Geografia') as any)?.id;

    if (groupId) {
      const insertMember = db.prepare(`
        INSERT OR IGNORE INTO group_members (group_id, user_id, role_name, has_phone, points)
        VALUES (?, ?, ?, ?, ?)
      `);

      insertMember.run(groupId, alexId, 'Curador', 1, 480);
      insertMember.run(groupId, biaId, 'Revisor', 0, 520);
      insertMember.run(groupId, carlaId, 'Comunicador', 0, 430);
      insertMember.run(groupId, diegoId, 'Curador', 0, 460);
    }

    const insertQuiz = db.prepare(`
      INSERT OR IGNORE INTO quizzes (class_id, author_id, subject, bncc_code, question, options_json, correct_index, points_reward, is_ai_generated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertQuiz.run(
      classId,
      teacherId,
      'Geografia',
      'EM13CHS202',
      "Como o conceito de 'Espaço Geográfico Tecnificado' se aplica ao desenvolvimento de cidades inteligentes?",
      JSON.stringify([
        'Integrando dados em tempo real para otimizar serviços públicos e mobilidade urbana.',
        'Isolando a população sem acesso à internet das redes municipais de saúde.',
        'Substituindo todas as áreas verdes por data centers urbanos centralizados.',
        'Proibindo a utilização de dispositivos móveis no transporte público.'
      ]),
      0,
      50,
      1
    );

    insertQuiz.run(
      classId,
      teacherId,
      'História',
      'EM13CHS101',
      'De que maneira as transformações do espaço urbano pós-1950 impactaram a organização do trabalho?',
      JSON.stringify([
        'Concentrando indústrias e serviços em metrópoles, atraindo fluxos migratórios maciços.',
        'Eliminando completamente os empregos fabris no território nacional.',
        'Obrigando a população urbana a retornar integralmente para atividades agrícolas.',
        'Fechando as universidades públicas nas grandes cidades.'
      ]),
      0,
      50,
      1
    );

    const insertNotebook = db.prepare(`
      INSERT OR IGNORE INTO notebook_uploads (class_id, student_id, author_name, title, type, image_url, badge, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'published')
    `);

    insertNotebook.run(
      classId,
      alexId,
      'Alex Silva (Curador)',
      'Resolução Equação de 2º Grau',
      'HANDWRITTEN_NOTEBOOK',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      'Print de Caderno'
    );

    insertNotebook.run(
      classId,
      diegoId,
      'Diego Alves (Curador)',
      'Artigo: Transição Energética no Brasil',
      'CURATED_LINK',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80',
      'Link Recomendado'
    );

    const insertMod = db.prepare(`
      INSERT OR IGNORE INTO moderation_queue (class_id, title, author, ai_status, human_status, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `);

    insertMod.run(
      classId,
      "Link: Artigo 'Matrizes Energéticas no Brasil'",
      'Diego Alves (Curador)',
      'Aprovado por IA (Filtro de Segurança OK)',
      'Aguardando validação do Líder da Turma (Alex Silva)'
    );

    const insertGratitude = db.prepare(`
      INSERT OR IGNORE INTO gratitude_notifications (user_id, icon, title, text)
      VALUES (?, ?, ?, ?)
    `);

    insertGratitude.run(
      alexId,
      'lightbulb',
      'Impacto no Aprendizado',
      'O mapa mental que você adicionou no Hub de Geografia ajudou 3 colegas a entenderem o conceito hoje.'
    );

    insertGratitude.run(
      alexId,
      'award',
      'Mentoria Solidária Global',
      'Incrível! Seu quiz sobre Frações Básicas foi concluído por 12 alunos do 6º Ano hoje.'
    );

    insertGratitude.run(
      alexId,
      'camera',
      'Caderno Compartilhado',
      'Sua foto de resolução escrita à mão sobre Equações foi salva por 6 colegas.'
    );

    const insertHeatmap = db.prepare(`
      INSERT OR IGNORE INTO bncc_skills_mastery (class_id, skill_code, skill_desc, mastery_percentage, level)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertHeatmap.run(classId, 'EM13CHS101', 'Análise de Processos Históricos', 88, 'lvl-high');
    insertHeatmap.run(classId, 'EM13CHS202', 'Geografia e Espaço Urbano', 92, 'lvl-high');
    insertHeatmap.run(classId, 'EM13LPT02', 'Leitura Crítica de Mídias', 64, 'lvl-mid');
    insertHeatmap.run(classId, 'EM13MAT103', 'Raciocínio Lógico e Funções', 42, 'lvl-low');

    const insertAnnouncement = db.prepare(`
      INSERT OR IGNORE INTO announcements (class_id, tag, title, desc, color)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertAnnouncement.run(
      classId,
      'COORDENAÇÃO',
      'Feira de Ciências 2026',
      'Inscrições dos projetos em equipe abertas até sexta-feira na secretaria virtual.',
      'var(--kodic-fuchsia)'
    );
  });

  seedTransaction();
  isSeeded = true;
}
