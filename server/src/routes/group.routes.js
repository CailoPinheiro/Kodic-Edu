const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/shared', authenticateToken, (req, res) => {
  let group = null;

  const userGroup = db.prepare(`
    SELECT g.* FROM groups g
    JOIN group_members gm ON gm.group_id = g.id
    WHERE gm.user_id = ?
    ORDER BY g.id ASC LIMIT 1
  `).get(req.user.id);

  if (userGroup) {
    group = userGroup;
  } else {
    group = db.prepare('SELECT * FROM groups WHERE group_type = ? ORDER BY id ASC LIMIT 1').get('Oficial da Disciplina');
  }

  if (!group) {
    return res.status(404).json({ error: 'No study group found' });
  }

  const members = db.prepare(`
    SELECT gm.id as membership_id, gm.role_name as role, gm.has_phone, gm.points,
           u.id as user_id, u.name, u.avatar_url, u.is_leader, u.grade
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY gm.id ASC
  `).all(group.id);

  const formattedMembers = members.map(m => {
    let roleIcon = 'search';
    let roleColor = 'var(--kodic-blue)';

    if (m.role === 'Revisor') {
      roleIcon = 'check-circle-2';
      roleColor = 'var(--kodic-amber)';
    } else if (m.role === 'Comunicador') {
      roleIcon = 'mic';
      roleColor = 'var(--kodic-pink)';
    }

    return {
      id: `usr_${m.user_id}`,
      userId: m.user_id,
      name: m.name,
      role: m.role,
      roleIcon,
      roleColor,
      avatar: m.avatar_url,
      points: m.points,
      hasPhone: Boolean(m.has_phone),
      isLeader: Boolean(m.is_leader),
      isCurrentDeviceHolder: group.current_device_holder_id === m.user_id
    };
  });

  const currentHolder = formattedMembers.find(m => m.userId === group.current_device_holder_id) || formattedMembers[0];

  return res.json({
    group: {
      id: group.id,
      name: group.name,
      groupType: group.group_type,
      objective: group.objective,
      status: group.status,
      currentDeviceHolder: currentHolder ? currentHolder.name : 'Vez de Aluno',
      currentDeviceHolderId: group.current_device_holder_id,
      members: formattedMembers
    }
  });
});

router.post('/rotate-device', authenticateToken, (req, res) => {
  const { groupId } = req.body;
  const targetGroupId = groupId || 1;

  const members = db.prepare(`
    SELECT user_id FROM group_members WHERE group_id = ? ORDER BY id ASC
  `).all(targetGroupId);

  if (members.length === 0) {
    return res.status(404).json({ error: 'Group members not found' });
  }

  const group = db.prepare('SELECT current_device_holder_id FROM groups WHERE id = ?').get(targetGroupId);
  const currentIndex = members.findIndex(m => m.user_id === group.current_device_holder_id);
  const nextIndex = (currentIndex + 1) % members.length;
  const nextHolderId = members[nextIndex].user_id;

  db.prepare('UPDATE groups SET current_device_holder_id = ? WHERE id = ?').run(nextHolderId, targetGroupId);
  const nextUser = db.prepare('SELECT id, name FROM users WHERE id = ?').get(nextHolderId);

  return res.json({
    success: true,
    message: `Rodízio ativo: O celular agora está nas mãos de ${nextUser.name}!`,
    currentDeviceHolderId: nextHolderId,
    currentDeviceHolderName: nextUser.name
  });
});

router.get('/all', authenticateToken, (req, res) => {
  const groups = db.prepare(`
    SELECT g.*, c.name as class_name, c.subject as subject_name
    FROM groups g
    JOIN classes c ON c.id = g.class_id
    ORDER BY g.created_at DESC
  `).all();

  return res.json({ groups });
});

router.post('/', authenticateToken, (req, res) => {
  const { classId, name, groupType, objective } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Group name is required' });
  }

  const initialStatus = req.user.role === 'teacher' ? 'approved' : 'pending_approval';

  const result = db.prepare(`
    INSERT INTO groups (class_id, name, group_type, objective, status, current_device_holder_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    classId || 1,
    name,
    groupType || 'Grupo de Estudo Livre (Foco ENEM)',
    objective || 'Grupo autônomo colaborativo de estudos.',
    initialStatus,
    req.user.id
  );

  const newGroupId = result.lastInsertRowid;
  db.prepare(`
    INSERT INTO group_members (group_id, user_id, role_name, has_phone, points)
    VALUES (?, ?, ?, 1, 0)
  `).run(newGroupId, req.user.id, req.user.intelligence_role || 'Curador');

  return res.status(201).json({
    group: db.prepare('SELECT * FROM groups WHERE id = ?').get(newGroupId),
    message: initialStatus === 'approved' ? 'Grupo criado com sucesso' : 'Grupo criado e enviado para aprovação do professor'
  });
});

router.put('/:id/approve', authenticateToken, requireRole('teacher'), (req, res) => {
  const groupId = req.params.id;
  db.prepare('UPDATE groups SET status = ? WHERE id = ?').run('approved', groupId);
  return res.json({ success: true, message: 'Grupo pedagógico aprovado com sucesso' });
});

module.exports = router;
