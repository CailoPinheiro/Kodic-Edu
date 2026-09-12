const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, requireRole, requireLeaderOrTeacher } = require('../middleware/auth');
const ModerationService = require('../services/moderationService');

const router = express.Router();

router.get('/notebooks', authenticateToken, (req, res) => {
  const notebooks = db.prepare(`
    SELECT n.*, u.name as student_name
    FROM notebook_uploads n
    JOIN users u ON u.id = n.student_id
    WHERE n.status = 'published'
    ORDER BY n.id DESC
  `).all();

  return res.json({ notebooks });
});

router.post('/notebooks', authenticateToken, (req, res) => {
  const { classId, title, type, imageUrl, badge } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const evaluation = ModerationService.evaluateContent({ title, url: imageUrl });

  const assignedBadge = badge || (type === 'MIND_MAP' ? 'Mapa Mental' : 'Print de Caderno');
  const defaultImage = imageUrl || (type === 'MIND_MAP'
    ? 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=400&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80');

  const initialStatus = evaluation.aiApproved ? 'published' : 'in_moderation';

  const result = db.prepare(`
    INSERT INTO notebook_uploads (class_id, student_id, author_name, title, type, image_url, badge, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    classId || 1,
    req.user.id,
    `${req.user.name} (${req.user.intelligence_role || 'Curador'})`,
    title,
    type || 'HANDWRITTEN_NOTEBOOK',
    defaultImage,
    assignedBadge,
    initialStatus
  );

  if (!evaluation.aiApproved) {
    db.prepare(`
      INSERT INTO moderation_queue (class_id, title, author, ai_status, human_status, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(
      classId || 1,
      title,
      req.user.name,
      evaluation.aiStatus,
      evaluation.humanStatus
    );
  }

  const newNotebook = db.prepare('SELECT * FROM notebook_uploads WHERE id = ?').get(result.lastInsertRowid);

  return res.status(201).json({
    notebook: newNotebook,
    moderation: evaluation,
    message: evaluation.aiApproved ? 'Material publicado no Hub de Conhecimento' : 'Material em análise pela moderação'
  });
});

router.get('/moderation', authenticateToken, (req, res) => {
  const queue = db.prepare(`
    SELECT * FROM moderation_queue WHERE status = 'pending' ORDER BY id DESC
  `).all();

  return res.json({ queue });
});

router.put('/moderation/:id/approve', authenticateToken, requireLeaderOrTeacher, (req, res) => {
  const itemId = req.params.id;

  const item = db.prepare('SELECT * FROM moderation_queue WHERE id = ?').get(itemId);
  if (!item) {
    return res.status(404).json({ error: 'Moderation item not found' });
  }

  db.prepare(`
    UPDATE moderation_queue
    SET status = 'approved', approved_by_id = ?
    WHERE id = ?
  `).run(req.user.id, itemId);

  return res.json({
    success: true,
    message: `Item aprovado com sucesso por ${req.user.name}`
  });
});

router.get('/impact', authenticateToken, (req, res) => {
  const notifications = db.prepare(`
    SELECT * FROM gratitude_notifications
    WHERE user_id = ?
    ORDER BY id DESC
  `).all(req.user.id);

  return res.json({
    notifications,
    summary: {
      totalImpacts: notifications.length,
      privateOnly: true,
      description: 'Impacto Silencioso: Reconhecimento pedagógico focado em utilidade real e cooperação, sem contagem pública de curtidas.'
    }
  });
});

router.get('/heatmap', authenticateToken, (req, res) => {
  const heatmap = db.prepare(`
    SELECT * FROM bncc_skills_mastery ORDER BY mastery_percentage DESC
  `).all();

  return res.json({ heatmap });
});

router.get('/announcements', authenticateToken, (req, res) => {
  const announcements = db.prepare(`
    SELECT * FROM announcements ORDER BY id DESC
  `).all();

  return res.json({ announcements });
});

router.post('/announcements', authenticateToken, requireRole('teacher'), (req, res) => {
  const { classId, tag, title, desc, color } = req.body;

  if (!title || !desc) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const result = db.prepare(`
    INSERT INTO announcements (class_id, tag, title, desc, color)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    classId || 1,
    tag || 'COMUNICADO DOCENTE',
    title,
    desc,
    color || 'var(--kodic-fuchsia)'
  );

  const newAnn = db.prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ announcement: newAnn });
});

module.exports = router;
