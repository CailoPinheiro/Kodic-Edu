import { NextRequest, NextResponse } from 'next/server';
import db from '@/backend/db';
import { getAuthUser } from '@/backend/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(request);
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Requires teacher role' }, { status: 403 });
  }

  const { level } = await request.json();
  const classId = params.id;

  if (![1, 2, 3].includes(Number(level))) {
    return NextResponse.json({ error: 'Level must be 1, 2 or 3' }, { status: 400 });
  }

  db.prepare('UPDATE classes SET onboarding_level = ? WHERE id = ? AND teacher_id = ?').run(level, classId, user.id);
  return NextResponse.json({ success: true, onboarding_level: level });
}
