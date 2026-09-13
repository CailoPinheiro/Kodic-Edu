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
    targetClass = db.prepare(`
      SELECT c.* FROM classes c
      LEFT JOIN class_teachers ct ON ct.class_id = c.id
      WHERE c.teacher_id = ? OR ct.teacher_id = ?
      ORDER BY c.id ASC LIMIT 1
    `).get(user.id, user.id);
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

  const teachers = db.prepare(`
    SELECT DISTINCT
      u.id,
      u.name,
      u.email,
      COALESCE(ct.role_title, 'Professor Titular') as role_title,
      CASE WHEN ? = u.id THEN 1 ELSE 0 END as is_primary
    FROM users u
    LEFT JOIN class_teachers ct ON ct.teacher_id = u.id AND ct.class_id = ?
    WHERE ct.class_id = ? OR u.id = ?
    ORDER BY is_primary DESC, u.name ASC
  `).all(targetClass.teacher_id, targetClass.id, targetClass.id, targetClass.teacher_id) as any[];

  const students = db.prepare(`
    SELECT DISTINCT
      u.id,
      u.name,
      u.email,
      u.grade,
      u.intelligence_role,
      u.points
    FROM users u
    JOIN class_enrollments ce ON ce.student_id = u.id
    WHERE ce.class_id = ?
    ORDER BY u.name ASC
  `).all(targetClass.id) as any[];

  const teacher = teachers.find((t: any) => t.is_primary) || teachers[0];
  const studentCount = students.length;
  const percentage = Math.min(100, Math.round((targetClass.current_points / targetClass.goal_points) * 100));

  return NextResponse.json({
    class: {
      ...targetClass,
      teacherName: teacher ? teacher.name : 'Professor Responsável',
      teachers,
      students,
      studentCount,
      percentage
    }
  });
}
