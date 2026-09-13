import { NextRequest, NextResponse } from 'next/server';
import db from '@/backend/db';
import { getAuthUser } from '@/backend/auth';
import { ensureSeeded } from '@/backend/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  ensureSeeded();

  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const announcements = db.prepare('SELECT * FROM announcements ORDER BY id DESC').all();
  return NextResponse.json({ announcements });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Requires teacher role' }, { status: 403 });
  }

  const { classId, tag, title, desc, color } = await request.json();

  if (!title || !desc) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

  const result = db.prepare(`
    INSERT INTO announcements (class_id, tag, title, desc, color)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    classId || 1,
    tag || 'COMUNICADO DOCENTE',
    title,
    desc,
    color || 'var(--kodic-fuchsia)'
  );

  const newAnn = db.prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json({ announcement: newAnn }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Requires teacher role' }, { status: 403 });
  }

  const { id, title, desc, tag } = await request.json();

  if (!desc) {
    return NextResponse.json({ error: 'Description is required' }, { status: 400 });
  }

  if (id) {
    db.prepare(`
      UPDATE announcements
      SET title = ?, desc = ?, tag = COALESCE(?, tag)
      WHERE id = ?
    `).run(title || 'Aviso da Coordenação & Professores', desc, tag || 'COMUNICADO DOCENTE', id);

    const updated = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    return NextResponse.json({ announcement: updated });
  } else {
    const result = db.prepare(`
      INSERT INTO announcements (class_id, tag, title, desc, color)
      VALUES (1, ?, ?, ?, 'var(--kodic-fuchsia)')
    `).run(tag || 'COMUNICADO DOCENTE', title || 'Aviso da Coordenação & Professores', desc);

    const newAnn = db.prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ announcement: newAnn });
  }
}
