import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/backend/db';
import { signToken } from '@/backend/auth';
import { ensureSeeded } from '@/backend/seed';

export async function POST(request: NextRequest) {
  try {
    ensureSeeded();

    const { name, email, password, role, grade, intelligenceRole, schoolId } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password and role are required' }, { status: 400 });
    }

    const userRole = role === 'teacher' ? 'teacher' : 'student';

    if (userRole === 'teacher' && !schoolId) {
      return NextResponse.json({ error: 'School is required for teachers' }, { status: 400 });
    }

    const school = userRole === 'teacher'
      ? (db.prepare('SELECT id FROM schools WHERE id = ?').get(schoolId) as any)
      : null;
    if (userRole === 'teacher' && !school) {
      return NextResponse.json({ error: 'School not found' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const assignedGrade = grade || '1º Ano A — Ensino Médio';
    const assignedIntelRole = intelligenceRole || 'Curador';

    const defaultBadges = userRole === 'student'
      ? JSON.stringify([{ id: 'b_new', title: 'Novo Explorador', desc: 'Iniciou a jornada Kodic', icon: 'zap', color: 'var(--kodic-purple)' }])
      : JSON.stringify([{ id: 'b_t_new', title: 'Docente Conectado', desc: 'Educação Ativa', icon: 'award', color: 'var(--kodic-fuchsia)' }]);

    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, grade, intelligence_role, points, badges_json, lgpd_consent, school_id)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1, ?)
    `).run(name, email, passwordHash, userRole, assignedGrade, assignedIntelRole, defaultBadges, school ? school.id : null);

    const userId = result.lastInsertRowid;

    if (userRole === 'student') {
      const activeClass = db.prepare('SELECT id FROM classes ORDER BY id ASC LIMIT 1').get() as any;
      if (activeClass) {
        db.prepare('INSERT OR IGNORE INTO class_enrollments (class_id, student_id) VALUES (?, ?)').run(activeClass.id, userId);
      }
    }

    const user = db.prepare('SELECT id, name, email, role, grade, intelligence_role, is_leader, points, avatar_url, badges_json FROM users WHERE id = ?').get(userId) as any;
    user.badges = JSON.parse(user.badges_json || '[]');
    delete user.badges_json;

    const token = signToken({ id: user.id, email: user.email, role: user.role, is_leader: user.is_leader });

    return NextResponse.json({ token, user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
