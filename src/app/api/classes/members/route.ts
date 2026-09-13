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

  const { searchParams } = new URL(request.url);
  let classId = Number(searchParams.get('classId'));

  if (!classId) {
    const defaultClass = db.prepare('SELECT id FROM classes ORDER BY id ASC LIMIT 1').get() as any;
    classId = defaultClass?.id || 1;
  }

  const targetClass = db.prepare('SELECT * FROM classes WHERE id = ?').get(classId) as any;
  if (!targetClass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
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
  `).all(targetClass.teacher_id, classId, classId, targetClass.teacher_id);

  const students = db.prepare(`
    SELECT DISTINCT
      u.id,
      u.name,
      u.email,
      u.grade,
      u.intelligence_role,
      u.points,
      COALESCE(g.name, 'Sem Mesa') as group_name
    FROM users u
    JOIN class_enrollments ce ON ce.student_id = u.id
    LEFT JOIN group_members gm ON gm.user_id = u.id
    LEFT JOIN groups g ON g.id = gm.group_id
    WHERE ce.class_id = ?
    ORDER BY u.name ASC
  `).all(classId);

  const teacherIds = teachers.map((t: any) => t.id);
  const studentIds = students.map((s: any) => s.id);

  const availableTeachers = db.prepare(`
    SELECT id, name, email
    FROM users
    WHERE role = 'teacher'
    ${teacherIds.length > 0 ? `AND id NOT IN (${teacherIds.join(',')})` : ''}
    ORDER BY name ASC
  `).all();

  const availableStudents = db.prepare(`
    SELECT id, name, email, grade, intelligence_role, points
    FROM users
    WHERE role = 'student'
    ${studentIds.length > 0 ? `AND id NOT IN (${studentIds.join(',')})` : ''}
    ORDER BY name ASC
  `).all();

  return NextResponse.json({
    classId,
    className: targetClass.name,
    classCode: targetClass.code,
    teachers,
    students,
    availableTeachers,
    availableStudents
  });
}

export async function POST(request: NextRequest) {
  ensureSeeded();

  const user = getAuthUser(request);
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Requires teacher role' }, { status: 403 });
  }

  const body = await request.json();
  const { action, classId, teacherId, studentId, roleTitle } = body;

  const targetClassId = classId || 1;

  if (action === 'add_teacher') {
    if (!teacherId) {
      return NextResponse.json({ error: 'teacherId is required' }, { status: 400 });
    }
    db.prepare(`
      INSERT OR REPLACE INTO class_teachers (class_id, teacher_id, role_title)
      VALUES (?, ?, ?)
    `).run(targetClassId, teacherId, roleTitle || 'Professor Co-docente');
    return NextResponse.json({ success: true, message: 'Professor associado à sala com sucesso.' });
  }

  if (action === 'remove_teacher') {
    if (!teacherId) {
      return NextResponse.json({ error: 'teacherId is required' }, { status: 400 });
    }
    const targetClass = db.prepare('SELECT teacher_id FROM classes WHERE id = ?').get(targetClassId) as any;
    if (targetClass && targetClass.teacher_id === Number(teacherId)) {
      return NextResponse.json({ error: 'Não é possível remover o professor titular responsável.' }, { status: 400 });
    }
    db.prepare('DELETE FROM class_teachers WHERE class_id = ? AND teacher_id = ?').run(targetClassId, teacherId);
    return NextResponse.json({ success: true, message: 'Professor desvinculado da sala.' });
  }

  if (action === 'add_student') {
    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }
    db.prepare(`
      INSERT OR IGNORE INTO class_enrollments (class_id, student_id)
      VALUES (?, ?)
    `).run(targetClassId, studentId);
    return NextResponse.json({ success: true, message: 'Estudante matriculado na sala com sucesso.' });
  }

  if (action === 'remove_student') {
    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }
    db.prepare('DELETE FROM class_enrollments WHERE class_id = ? AND student_id = ?').run(targetClassId, studentId);
    db.prepare(`
      DELETE FROM group_members
      WHERE user_id = ? AND group_id IN (SELECT id FROM groups WHERE class_id = ?)
    `).run(studentId, targetClassId);
    return NextResponse.json({ success: true, message: 'Estudante desvinculado da sala.' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
