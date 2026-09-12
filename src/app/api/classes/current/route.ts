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

  let targetClass: any = null;

  if (user.role === 'teacher') {
    targetClass = db.prepare('SELECT * FROM classes WHERE teacher_id = ? ORDER BY id ASC LIMIT 1').get(user.id);
  } else {
    targetClass = db.prepare(`
      SELECT c.* FROM classes c
      JOIN class_enrollments ce ON ce.class_id = c.id
      WHERE ce.student_id = ?
      ORDER BY c.id ASC LIMIT 1
    `).get(user.id);
  }

  if (!targetClass) {
    targetClass = db.prepare('SELECT * FROM classes ORDER BY id ASC LIMIT 1').get();
  }

  if (!targetClass) {
    return NextResponse.json({ error: 'No class found' }, { status: 404 });
  }

  const teacher = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(targetClass.teacher_id) as any;
  const studentCount = (db.prepare('SELECT count(*) as count FROM class_enrollments WHERE class_id = ?').get(targetClass.id) as any).count;
  const percentage = Math.min(100, Math.round((targetClass.current_points / targetClass.goal_points) * 100));

  return NextResponse.json({
    class: {
      ...targetClass,
      teacherName: teacher ? teacher.name : 'Professor Responsável',
      studentCount,
      percentage
    }
  });
}
