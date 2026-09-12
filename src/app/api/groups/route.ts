import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const groups = db.prepare(`
    SELECT g.*, c.name as class_name, c.subject as subject_name
    FROM groups g
    JOIN classes c ON c.id = g.class_id
    ORDER BY g.created_at DESC
  `).all();

  return NextResponse.json({ groups });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { classId, name, groupType, objective } = await request.json();

  if (!name) {
    return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
  }

  const initialStatus = user.role === 'teacher' ? 'approved' : 'pending_approval';

  const result = db.prepare(`
    INSERT INTO groups (class_id, name, group_type, objective, status, current_device_holder_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    classId || 1,
    name,
    groupType || 'Grupo de Estudo Livre (Foco ENEM)',
    objective || 'Grupo autônomo colaborativo de estudos.',
    initialStatus,
    user.id
  );

  const newGroupId = result.lastInsertRowid;
  db.prepare(`
    INSERT INTO group_members (group_id, user_id, role_name, has_phone, points)
    VALUES (?, ?, ?, 1, 0)
  `).run(newGroupId, user.id, user.intelligence_role || 'Curador');

  return NextResponse.json({
    group: db.prepare('SELECT * FROM groups WHERE id = ?').get(newGroupId),
    message: initialStatus === 'approved' ? 'Grupo criado com sucesso' : 'Grupo criado e enviado para aprovação do professor'
  }, { status: 201 });
}
