const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const BnccService = require('../services/bnccService');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const quizzes = db.prepare(`
    SELECT q.*, u.name as author_name
    FROM quizzes q
    JOIN users u ON u.id = q.author_id
    ORDER BY q.id DESC
  `).all();

  const formattedQuizzes = quizzes.map(q => ({
    id: q.id,
    classId: q.class_id,
    subject: q.subject,
    bnccCode: q.bncc_code,
    question: q.question,
    options: JSON.parse(q.options_json || '[]'),
    correctIndex: q.correct_index,
    pointsReward: q.points_reward,
    isAiGenerated: Boolean(q.is_ai_generated),
    authorName: q.author_name,
    createdAt: q.created_at
  }));

  return res.json({ quizzes: formattedQuizzes });
});

router.post('/submit', authenticateToken, (req, res) => {
  const { quizId, selectedIndex } = req.body;

  if (quizId === undefined || selectedIndex === undefined) {
    return res.status(400).json({ error: 'quizId and selectedIndex are required' });
  }

  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(quizId);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  const isCorrect = Number(selectedIndex) === Number(quiz.correct_index);
  const pointsReward = isCorrect ? quiz.points_reward : 0;

  const membership = db.prepare(`
    SELECT group_id FROM group_members WHERE user_id = ? ORDER BY id ASC LIMIT 1
  `).get(req.user.id);

  const groupId = membership ? membership.group_id : null;

  db.prepare(`
    INSERT INTO quiz_submissions (quiz_id, student_id, group_id, selected_index, is_correct, points_awarded)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(quiz.id, req.user.id, groupId, selectedIndex, isCorrect ? 1 : 0, pointsReward);

  let distributedTo = [];
  let totalClassPointsAdded = 0;

  if (isCorrect) {
    if (groupId) {
      const members = db.prepare('SELECT user_id FROM group_members WHERE group_id = ?').all(groupId);
      
      const updateUser = db.prepare('UPDATE users SET points = points + ? WHERE id = ?');
      const updateMember = db.prepare('UPDATE group_members SET points = points + ? WHERE group_id = ? AND user_id = ?');

      for (const m of members) {
        updateUser.run(pointsReward, m.user_id);
        updateMember.run(pointsReward, groupId, m.user_id);
        distributedTo.push(m.user_id);
      }

      totalClassPointsAdded = pointsReward * members.length;
    } else {
      db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(pointsReward, req.user.id);
      distributedTo.push(req.user.id);
      totalClassPointsAdded = pointsReward;
    }

    db.prepare('UPDATE classes SET current_points = current_points + ? WHERE id = ?').run(totalClassPointsAdded, quiz.class_id);
  }

  const updatedClass = db.prepare('SELECT id, current_points, goal_points FROM classes WHERE id = ?').get(quiz.class_id);
  const updatedUser = db.prepare('SELECT id, points FROM users WHERE id = ?').get(req.user.id);

  return res.json({
    isCorrect,
    correctIndex: quiz.correct_index,
    pointsAwarded: pointsReward,
    totalClassPointsAdded,
    classCurrentPoints: updatedClass ? updatedClass.current_points : 0,
    classGoalPoints: updatedClass ? updatedClass.goal_points : 0,
    classPercentage: updatedClass ? Math.min(100, Math.round((updatedClass.current_points / updatedClass.goal_points) * 100)) : 0,
    userPoints: updatedUser ? updatedUser.points : 0,
    fairSyncMembersCount: distributedTo.length
  });
});

router.post('/generate-ai', authenticateToken, requireRole('teacher'), (req, res) => {
  const { bnccCode, subject } = req.body;
  const generated = BnccService.generateQuiz({ bnccCode, subject });
  return res.json({ quiz: generated });
});

router.get('/bncc-catalog', authenticateToken, (req, res) => {
  const skills = BnccService.getAllSkills();
  return res.json({ skills });
});

router.post('/', authenticateToken, (req, res) => {
  const { classId, subject, bnccCode, question, options, correctIndex, pointsReward, isAiGenerated } = req.body;

  if (!question || !options || options.length < 2 || correctIndex === undefined) {
    return res.status(400).json({ error: 'Question, options and correctIndex are required' });
  }

  const result = db.prepare(`
    INSERT INTO quizzes (class_id, author_id, subject, bncc_code, question, options_json, correct_index, points_reward, is_ai_generated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    classId || 1,
    req.user.id,
    subject || 'Geografia',
    bnccCode || 'EM13CHS202',
    question,
    JSON.stringify(options),
    correctIndex,
    pointsReward || 50,
    isAiGenerated ? 1 : 0
  );

  const newQuiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(result.lastInsertRowid);
  newQuiz.options = JSON.parse(newQuiz.options_json);

  return res.status(201).json({ quiz: newQuiz });
});

module.exports = router;
