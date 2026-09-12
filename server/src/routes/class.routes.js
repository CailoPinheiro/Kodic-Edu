const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/current', authenticateToken, (req, res) => {
  let targetClass = null;

  if (req.user.role === 'teacher') {
    targetClass = db.prepare(`
      SELECT * FROM classes WHERE teacher_id = ? ORDER BY id ASC LIMIT 1
    `).get(req.user.id);
  } else {
    targetClass = db.prepare(`
      SELECT c.* FROM classes c
      JOIN class_enrollments ce ON ce.class_id = c.id
      WHERE ce.student_id = ?
      ORDER BY c.id ASC LIMIT 1
    `).get(req.user.id);
  }

  if (!targetClass) {
    targetClass = db.prepare('SELECT * FROM classes ORDER BY id ASC LIMIT 1').get();
  }

  if (!targetClass) {
    return res.status(404).json({ error: 'No class found' });
  }

  const teacher = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(targetClass.teacher_id);
  const studentCount = db.prepare('SELECT count(*) as count FROM class_enrollments WHERE class_id = ?').get(targetClass.id).count;

  const percentage = Math.min(100, Math.round((targetClass.current_points / targetClass.goal_points) * 100));

  return res.json({
    class: {
      ...targetClass,
      teacherName: teacher ? teacher.name : 'Professor Responsável',
      studentCount,
      percentage
    }
  });
});

router.post('/', authenticateToken, requireRole('teacher'), (req, res) => {
  const { name, school, subject, goalPoints, rewardTitle, code } = req.body;

  if (!name || !school || !subject) {
    return res.status(400).json({ error: 'Name, school and subject are required' });
  }

  const classCode = code || `KODIC-${Math.floor(100 + Math.random() * 900)}`;

  const result = db.prepare(`
    INSERT INTO classes (teacher_id, code, name, school, subject, goal_points, current_points, reward_title, onboarding_level)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1)
  `).run(
    req.user.id,
    classCode,
    name,
    school,
    subject,
    goalPoints || 8500,
    rewardTitle || 'Passeio Cultural Virtual 🏛️'
  );

  const newClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ class: newClass });
});

router.post('/join', authenticateToken, (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Class code is required' });
  }

  const targetClass = db.prepare('SELECT * FROM classes WHERE code = ?').get(code.trim().toUpperCase());
  if (!targetClass) {
    return res.status(404).json({ error: 'Class not found with the provided code' });
  }

  try {
    db.prepare('INSERT INTO class_enrollments (class_id, student_id) VALUES (?, ?)').run(targetClass.id, req.user.id);
  } catch {
    return res.status(200).json({ message: 'Already enrolled in this class', class: targetClass });
  }

  return res.json({ message: 'Enrolled successfully', class: targetClass });
});

router.put('/:id/onboarding', authenticateToken, requireRole('teacher'), (req, res) => {
  const { level } = req.body;
  const classId = req.params.id;

  if (![1, 2, 3].includes(Number(level))) {
    return res.status(400).json({ error: 'Level must be 1, 2 or 3' });
  }

  db.prepare('UPDATE classes SET onboarding_level = ? WHERE id = ? AND teacher_id = ?').run(level, classId, req.user.id);
  return res.json({ success: true, onboarding_level: level });
});

module.exports = router;
