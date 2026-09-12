import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Requires teacher role' }, { status: 403 });
  }

  const { name, school, subject, goalPoints, rewardTitle, code } = await request.json();

  if (!name || !school || !subject) {
    return NextResponse.json({ error: 'Name, school and subject are required' }, { status: 400 });
  }

  const classCode = code || `KODIC-${Math.floor(100 + Math.random() * 900)}`;

  const result = db.prepare(`
    INSERT INTO classes (teacher_id, code, name, school, subject, goal_points, current_points, reward_title, onboarding_level)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1)
  `).run(
    user.id,
    classCode,
    name,
    school,
    subject,
    goalPoints || 8500,
    rewardTitle || 'Passeio Cultural Virtual 🏛️'
  );

  const newClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json({ class: newClass }, { status: 201 });
}
