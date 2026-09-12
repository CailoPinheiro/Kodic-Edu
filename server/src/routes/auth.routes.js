const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, password, role, grade, intelligenceRole } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password and role are required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const userRole = role === 'teacher' ? 'teacher' : 'student';
  const assignedGrade = grade || '1º Ano A — Ensino Médio';
  const assignedIntelRole = intelligenceRole || 'Curador';

  const defaultBadges = userRole === 'student'
    ? JSON.stringify([{ id: 'b_new', title: 'Novo Explorador', desc: 'Iniciou a jornada Kodic', icon: 'zap', color: 'var(--kodic-purple)' }])
    : JSON.stringify([{ id: 'b_t_new', title: 'Docente Conectado', desc: 'Educação Ativa', icon: 'award', color: 'var(--kodic-fuchsia)' }]);

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, grade, intelligence_role, points, badges_json, lgpd_consent)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1)
  `).run(name, email, passwordHash, userRole, assignedGrade, assignedIntelRole, defaultBadges);

  const userId = result.lastInsertRowid;
  const user = db.prepare('SELECT id, name, email, role, grade, intelligence_role, is_leader, points, avatar_url, badges_json FROM users WHERE id = ?').get(userId);
  user.badges = JSON.parse(user.badges_json || '[]');
  delete user.badges_json;

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, is_leader: user.is_leader }, JWT_SECRET, { expiresIn: '7d' });

  return res.status(201).json({ token, user });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, is_leader: user.is_leader }, JWT_SECRET, { expiresIn: '7d' });

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    grade: user.grade,
    intelligence_role: user.intelligence_role,
    is_leader: user.is_leader,
    points: user.points,
    avatar_url: user.avatar_url,
    badges: JSON.parse(user.badges_json || '[]')
  };

  return res.json({ token, user: safeUser });
});

router.post('/quick-login', (req, res) => {
  const { role } = req.body;
  const targetEmail = role === 'teacher' ? 'professora@kodic.edu' : 'alex@kodic.edu';

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(targetEmail);
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, is_leader: user.is_leader }, JWT_SECRET, { expiresIn: '7d' });

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    grade: user.grade,
    intelligence_role: user.intelligence_role,
    is_leader: user.is_leader,
    points: user.points,
    avatar_url: user.avatar_url,
    badges: JSON.parse(user.badges_json || '[]')
  };

  return res.json({ token, user: safeUser });
});

router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, grade, intelligence_role, is_leader, points, avatar_url, badges_json FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.badges = JSON.parse(user.badges_json || '[]');
  delete user.badges_json;

  return res.json({ user });
});

router.put('/profile/intelligence-role', authenticateToken, (req, res) => {
  const { intelligenceRole } = req.body;
  if (!['Curador', 'Revisor', 'Comunicador'].includes(intelligenceRole)) {
    return res.status(400).json({ error: 'Invalid intelligence role' });
  }

  db.prepare('UPDATE users SET intelligence_role = ? WHERE id = ?').run(intelligenceRole, req.user.id);
  db.prepare('UPDATE group_members SET role_name = ? WHERE user_id = ?').run(intelligenceRole, req.user.id);

  return res.json({ success: true, intelligenceRole });
});

router.get('/privacy-policy', (req, res) => {
  return res.json({
    compliance: 'LGPD & Privacy by Design',
    dataMinimization: 'Coleta estritamente restrita a nome, série, turma e progresso pedagógico.',
    minorsProtection: 'Ambiente fechado escolar sob custódia e consentimento da instituição de ensino.',
    advertising: 'Plataforma 100% livre de publicidade comercial e sem monetização de dados.',
    aiProcessing: 'Textos analisados pela moderação não são retidos permanentemente nem usados para treinamento de modelos de terceiros.',
    bnccDataFlow: 'Consultas à bncc.dev são públicas e unidirecionais; nenhum dado de alunos trafega para APIs curriculares externas.'
  });
});

module.exports = router;
