import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  ensureSeeded();

  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const classIdParam = url.searchParams.get('classId');

  let targetClassId: number | null = classIdParam ? Number(classIdParam) : null;

  if (!targetClassId) {
    if (user.role === 'teacher') {
      const teacherClass = db.prepare('SELECT id FROM classes WHERE teacher_id = ? ORDER BY id ASC LIMIT 1').get(user.id) as any;
      targetClassId = teacherClass ? teacherClass.id : 1;
    } else {
      const studentClass = db.prepare(`
        SELECT c.id FROM classes c
        JOIN class_enrollments ce ON ce.class_id = c.id
        WHERE ce.student_id = ?
        ORDER BY c.id ASC LIMIT 1
      `).get(user.id) as any;
      targetClassId = studentClass ? studentClass.id : 1;
    }
  }

  const rawGroups = db.prepare(`
    SELECT g.*, c.name as class_name, c.subject as subject_name
    FROM groups g
    JOIN classes c ON c.id = g.class_id
    WHERE (? IS NULL OR g.class_id = ?)
    ORDER BY g.id ASC
  `).all(targetClassId, targetClassId) as any[];

  const getMembers = db.prepare(`
    SELECT gm.id as membership_id, gm.role_name as role, gm.has_phone, gm.points as member_points,
           u.id as user_id, u.name, u.email, u.avatar_url, u.grade, u.intelligence_role, u.is_leader, u.points as user_points
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY gm.id ASC
  `);

  const groups = rawGroups.map((g) => {
    const rawMembers = getMembers.all(g.id) as any[];
    const formattedMembers = rawMembers.map((m) => {
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
        membershipId: m.membership_id,
        userId: m.user_id,
        name: m.name,
        email: m.email,
        avatar: m.avatar_url,
        grade: m.grade,
        role: m.role,
        roleIcon,
        roleColor,
        points: m.user_points || m.member_points || 0,
        hasPhone: Boolean(m.has_phone),
        isLeader: Boolean(m.is_leader),
        isCurrentDeviceHolder: g.current_device_holder_id === m.user_id
      };
    });

    return {
      id: g.id,
      classId: g.class_id,
      className: g.class_name,
      subjectName: g.subject_name,
      name: g.name,
      groupType: g.group_type,
      objective: g.objective,
      status: g.status,
      currentDeviceHolderId: g.current_device_holder_id,
      members: formattedMembers,
      memberCount: formattedMembers.length,
      createdAt: g.created_at
    };
  });

  const enrolledRows = targetClassId
    ? (db.prepare(`
        SELECT DISTINCT u.id as user_id, u.name, u.email, u.avatar_url, u.grade, u.intelligence_role, u.points, u.is_leader
        FROM users u
        LEFT JOIN class_enrollments ce ON ce.student_id = u.id
        WHERE u.role = 'student' AND (ce.class_id = ? OR ce.class_id IS NULL)
        ORDER BY u.name ASC
      `).all(targetClassId) as any[])
    : (db.prepare(`
        SELECT u.id as user_id, u.name, u.email, u.avatar_url, u.grade, u.intelligence_role, u.points, u.is_leader
        FROM users u
        WHERE u.role = 'student'
        ORDER BY u.name ASC
      `).all() as any[]);

  const studentGroupsMap = new Map<number, { groupId: number; groupName: string }[]>();
  for (const g of groups) {
    for (const m of g.members) {
      const list = studentGroupsMap.get(m.userId) || [];
      list.push({ groupId: g.id, groupName: g.name });
      studentGroupsMap.set(m.userId, list);
    }
  }

  const enrolledStudents = enrolledRows.map((s) => {
    const assigned = studentGroupsMap.get(s.user_id) || [];
    return {
      userId: s.user_id,
      name: s.name,
      email: s.email,
      avatar: s.avatar_url,
      grade: s.grade,
      role: s.intelligence_role || 'Curador',
      points: s.points || 0,
      isLeader: Boolean(s.is_leader),
      assignedGroups: assigned,
      isInGroup: assigned.length > 0
    };
  });

  const allocatedCount = enrolledStudents.filter((s) => s.isInGroup).length;
  const unallocatedCount = enrolledStudents.filter((s) => !s.isInGroup).length;

  return NextResponse.json({
    groups,
    totalGroups: groups.length,
    enrolledStudents,
    totalEnrolled: enrolledStudents.length,
    allocatedCount,
    unallocatedCount
  });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { classId, name, groupType, objective, memberIds, currentDeviceHolderId } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Nome do grupo é obrigatório' }, { status: 400 });
  }

  if (Array.isArray(memberIds) && memberIds.length > 4) {
    return NextResponse.json({ error: 'Um grupo suporta no máximo 4 alunos.' }, { status: 400 });
  }

  const targetClassId = classId ? Number(classId) : 1;
  const initialStatus = user.role === 'teacher' ? 'approved' : 'pending_approval';

  let initialHolderId: number | null = null;
  if (currentDeviceHolderId) {
    initialHolderId = Number(currentDeviceHolderId);
  } else if (Array.isArray(memberIds) && memberIds.length > 0) {
    initialHolderId = Number(memberIds[0]);
  } else if (user.role === 'student') {
    initialHolderId = user.id;
  }

  const result = db.prepare(`
    INSERT INTO groups (class_id, name, group_type, objective, status, current_device_holder_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    targetClassId,
    name.trim(),
    groupType || 'Oficial da Disciplina',
    objective ? objective.trim() : 'Estudo prático e colaborativo com materiais curriculares.',
    initialStatus,
    initialHolderId
  );

  const newGroupId = Number(result.lastInsertRowid);

  if (Array.isArray(memberIds) && memberIds.length > 0) {
    const insertMember = db.prepare(`
      INSERT OR IGNORE INTO group_members (group_id, user_id, role_name, has_phone, points)
      VALUES (?, ?, ?, ?, ?)
    `);

    const getUser = db.prepare('SELECT id, intelligence_role FROM users WHERE id = ?');
    for (const rawId of memberIds) {
      const mId = Number(rawId);
      const u = getUser.get(mId) as any;
      if (u) {
        const hasPhone = mId === initialHolderId ? 1 : 0;
        insertMember.run(newGroupId, mId, u.intelligence_role || 'Curador', hasPhone, 0);
      }
    }
  } else if (user.role === 'student') {
    db.prepare(`
      INSERT OR IGNORE INTO group_members (group_id, user_id, role_name, has_phone, points)
      VALUES (?, ?, ?, 1, 0)
    `).run(newGroupId, user.id, user.intelligence_role || 'Curador');
  }

  const createdGroup = db.prepare('SELECT * FROM groups WHERE id = ?').get(newGroupId) as any;
  const members = db.prepare(`
    SELECT gm.id as membership_id, gm.role_name as role, gm.has_phone,
           u.id as user_id, u.name, u.email, u.avatar_url, u.grade, u.points
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY gm.id ASC
  `).all(newGroupId);

  return NextResponse.json({
    success: true,
    message: initialStatus === 'approved' ? 'Grupo criado com sucesso' : 'Grupo criado e enviado para aprovação',
    group: {
      ...createdGroup,
      members,
      memberCount: members.length
    }
  }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { groupId, name, groupType, objective, status, currentDeviceHolderId } = body;

  const targetGroupId = Number(groupId);
  if (!targetGroupId) {
    return NextResponse.json({ error: 'ID do grupo é obrigatório' }, { status: 400 });
  }

  const existing = db.prepare('SELECT * FROM groups WHERE id = ?').get(targetGroupId) as any;
  if (!existing) {
    return NextResponse.json({ error: 'Grupo não encontrado' }, { status: 404 });
  }

  const updatedName = name !== undefined ? name.trim() : existing.name;
  const updatedType = groupType !== undefined ? groupType : existing.group_type;
  const updatedObjective = objective !== undefined ? objective.trim() : existing.objective;
  const updatedStatus = status !== undefined ? status : existing.status;
  const updatedHolderId = currentDeviceHolderId !== undefined ? Number(currentDeviceHolderId) : existing.current_device_holder_id;

  db.prepare(`
    UPDATE groups
    SET name = ?, group_type = ?, objective = ?, status = ?, current_device_holder_id = ?
    WHERE id = ?
  `).run(updatedName, updatedType, updatedObjective, updatedStatus, updatedHolderId, targetGroupId);

  if (currentDeviceHolderId !== undefined) {
    db.prepare('UPDATE group_members SET has_phone = 0 WHERE group_id = ?').run(targetGroupId);
    if (updatedHolderId) {
      db.prepare('UPDATE group_members SET has_phone = 1 WHERE group_id = ? AND user_id = ?').run(targetGroupId, updatedHolderId);
    }
  }

  const updated = db.prepare('SELECT * FROM groups WHERE id = ?').get(targetGroupId);

  return NextResponse.json({
    success: true,
    message: 'Grupo atualizado com sucesso',
    group: updated
  });
}

export async function DELETE(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  let groupId = url.searchParams.get('groupId');

  if (!groupId) {
    const body = await request.json().catch(() => ({}));
    groupId = body.groupId;
  }

  const targetGroupId = Number(groupId);
  if (!targetGroupId) {
    return NextResponse.json({ error: 'ID do grupo é obrigatório' }, { status: 400 });
  }

  const existing = db.prepare('SELECT * FROM groups WHERE id = ?').get(targetGroupId);
  if (!existing) {
    return NextResponse.json({ error: 'Grupo não encontrado' }, { status: 404 });
  }

  db.prepare('DELETE FROM group_members WHERE group_id = ?').run(targetGroupId);
  db.prepare('DELETE FROM groups WHERE id = ?').run(targetGroupId);

  return NextResponse.json({
    success: true,
    message: 'Grupo excluído com sucesso'
  });
}
