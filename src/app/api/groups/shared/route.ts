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

  let group: any = null;

  const userGroup = db.prepare(`
    SELECT g.* FROM groups g
    JOIN group_members gm ON gm.group_id = g.id
    WHERE gm.user_id = ?
    ORDER BY g.id ASC LIMIT 1
  `).get(user.id);

  if (userGroup) {
    group = userGroup;
  } else {
    group = db.prepare('SELECT * FROM groups WHERE group_type = ? ORDER BY id ASC LIMIT 1').get('Oficial da Disciplina');
  }

  if (!group) {
    return NextResponse.json({ error: 'No study group found' }, { status: 404 });
  }

  const members = db.prepare(`
    SELECT gm.id as membership_id, gm.role_name as role, gm.has_phone, u.points as points,
           u.id as user_id, u.name, u.email, u.avatar_url, u.is_leader, u.grade
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY gm.id ASC
  `).all(group.id) as any[];

  const formattedMembers = members.map((m) => {
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
      email: m.email,
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

  const currentHolder = formattedMembers.find((m) => m.userId === group.current_device_holder_id) || formattedMembers[0];

  const availableStudents = db.prepare(`
    SELECT u.id as user_id, u.name, u.email, u.avatar_url, u.grade, u.intelligence_role as role, u.points
    FROM users u
    JOIN class_enrollments ce ON ce.student_id = u.id
    WHERE ce.class_id = ? AND u.id NOT IN (
      SELECT user_id FROM group_members WHERE group_id = ?
    )
    ORDER BY u.name ASC
  `).all(group.class_id, group.id) as any[];

  return NextResponse.json({
    group: {
      id: group.id,
      name: group.name,
      groupType: group.group_type,
      objective: group.objective,
      status: group.status,
      currentDeviceHolder: currentHolder ? currentHolder.name : 'Vez de Aluno',
      currentDeviceHolderId: group.current_device_holder_id,
      members: formattedMembers,
      availableStudents: availableStudents.map((s) => ({
        id: `usr_${s.user_id}`,
        userId: s.user_id,
        name: s.name,
        email: s.email,
        role: s.role || 'Curador',
        avatar: s.avatar_url,
        points: s.points
      }))
    }
  });
}
