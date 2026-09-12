import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { intelligenceRole } = await request.json();
  if (!['Curador', 'Revisor', 'Comunicador'].includes(intelligenceRole)) {
    return NextResponse.json({ error: 'Invalid intelligence role' }, { status: 400 });
  }

  db.prepare('UPDATE users SET intelligence_role = ? WHERE id = ?').run(intelligenceRole, user.id);
  db.prepare('UPDATE group_members SET role_name = ? WHERE user_id = ?').run(intelligenceRole, user.id);

  return NextResponse.json({ success: true, intelligenceRole });
}
