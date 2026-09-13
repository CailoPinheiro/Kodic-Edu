import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/backend/db';
import { getAuthUser } from '@/backend/auth';

export async function POST(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { groupId, userId, name, role } = await request.json().catch(() => ({}));
  const targetGroupId = groupId || 1;
  const assignedRole = ['Curador', 'Revisor', 'Comunicador'].includes(role) ? role : 'Curador';

  const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(targetGroupId) as any;
  if (!group) {
    return NextResponse.json({ error: 'Grupo não encontrado' }, { status: 404 });
  }

  const currentMembers = db.prepare('SELECT id FROM group_members WHERE group_id = ?').all(targetGroupId);
  if (currentMembers.length >= 4) {
    return NextResponse.json({
      error: 'A mesa já atingiu a capacidade máxima de 4 alunos.'
    }, { status: 400 });
  }

  let targetUserId = userId ? Number(userId) : null;

  if (!targetUserId && name && name.trim()) {
    const studentName = name.trim();
    const existingUser = db.prepare('SELECT id FROM users WHERE name = ? COLLATE NOCASE').get(studentName) as any;

    if (existingUser) {
      targetUserId = existingUser.id;
    } else {
      const emailSlug = studentName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const uniqueEmail = `${emailSlug || 'aluno'}_${Date.now()}@kodic.edu`;
      const passwordHash = bcrypt.hashSync('senha123', 10);

      const userInsert = db.prepare(`
        INSERT INTO users (name, email, password_hash, role, grade, intelligence_role, points, avatar_url)
        VALUES (?, ?, ?, 'student', '1º Ano A — Ensino Médio', ?, 400, ?)
      `).run(
        studentName,
        uniqueEmail,
        passwordHash,
        assignedRole,
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      );

      targetUserId = Number(userInsert.lastInsertRowid);
    }

    db.prepare('INSERT OR IGNORE INTO class_enrollments (class_id, student_id) VALUES (?, ?)').run(
      group.class_id,
      targetUserId
    );
  }

  if (!targetUserId) {
    return NextResponse.json({ error: 'Estudante ou nome não informado' }, { status: 400 });
  }

  db.prepare('INSERT OR IGNORE INTO class_enrollments (class_id, student_id) VALUES (?, ?)').run(
    group.class_id,
    targetUserId
  );

  const existingMember = db.prepare('SELECT id FROM group_members WHERE group_id = ? AND user_id = ?').get(targetGroupId, targetUserId);
  if (existingMember) {
    return NextResponse.json({ error: 'Estudante já está na mesa compartilhada' }, { status: 400 });
  }

  db.prepare(`
    INSERT INTO group_members (group_id, user_id, role_name, has_phone, points)
    VALUES (?, ?, ?, 0, 0)
  `).run(targetGroupId, targetUserId, assignedRole);

  if (!group.current_device_holder_id) {
    db.prepare('UPDATE groups SET current_device_holder_id = ? WHERE id = ?').run(targetUserId, targetGroupId);
  }

  const userRecord = db.prepare('SELECT id, name, email, avatar_url, points FROM users WHERE id = ?').get(targetUserId) as any;

  return NextResponse.json({
    success: true,
    message: `${userRecord?.name || 'Estudante'} entrou na mesa compartilhada`,
    member: {
      userId: targetUserId,
      name: userRecord?.name,
      role: assignedRole,
      avatar: userRecord?.avatar_url,
      points: userRecord?.points || 0
    }
  }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let groupId: any;
  let userId: any;

  const url = new URL(request.url);
  groupId = url.searchParams.get('groupId');
  userId = url.searchParams.get('userId');

  if (!userId) {
    const body = await request.json().catch(() => ({}));
    groupId = groupId || body.groupId;
    userId = body.userId;
  }

  const targetGroupId = groupId ? Number(groupId) : 1;
  const targetUserId = Number(userId);

  if (!targetUserId) {
    return NextResponse.json({ error: 'ID do estudante é obrigatório' }, { status: 400 });
  }

  const members = db.prepare('SELECT user_id FROM group_members WHERE group_id = ? ORDER BY id ASC').all(targetGroupId) as any[];

  const isSelfLeaving = authUser.id === targetUserId;
  if (!isSelfLeaving && authUser.role !== 'teacher' && members.length <= 1) {
    return NextResponse.json({
      error: 'A mesa compartilhada precisa manter pelo menos 1 estudante ativo no aparelho.'
    }, { status: 400 });
  }

  const group = db.prepare('SELECT current_device_holder_id FROM groups WHERE id = ?').get(targetGroupId) as any;
  let newHolderId = group?.current_device_holder_id;

  if (group && group.current_device_holder_id === targetUserId) {
    const nextMember = members.find((m) => m.user_id !== targetUserId);
    newHolderId = nextMember ? nextMember.user_id : null;
    db.prepare('UPDATE groups SET current_device_holder_id = ? WHERE id = ?').run(newHolderId, targetGroupId);
  }

  db.prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ?').run(targetGroupId, targetUserId);

  return NextResponse.json({
    success: true,
    message: 'Estudante saiu da mesa compartilhada',
    newHolderId
  });
}

export async function PATCH(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { groupId, userId, role } = await request.json().catch(() => ({}));
  const targetGroupId = groupId || 1;
  const targetUserId = Number(userId);

  if (!targetUserId || !role || !['Curador', 'Revisor', 'Comunicador'].includes(role)) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
  }

  db.prepare('UPDATE group_members SET role_name = ? WHERE group_id = ? AND user_id = ?').run(role, targetGroupId, targetUserId);
  db.prepare('UPDATE users SET intelligence_role = ? WHERE id = ?').run(role, targetUserId);

  return NextResponse.json({
    success: true,
    message: 'Função do estudante atualizada com sucesso'
  });
}
