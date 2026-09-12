import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { ModerationService } from '@/lib/moderationService';
import { ensureSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  ensureSeeded();

  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notebooks = db.prepare(`
    SELECT n.*, u.name as student_name
    FROM notebook_uploads n
    JOIN users u ON u.id = n.student_id
    WHERE n.status = 'published'
    ORDER BY n.id DESC
  `).all();

  return NextResponse.json({ notebooks });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { classId, title, type, imageUrl, badge } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const evaluation = ModerationService.evaluateContent({ title, url: imageUrl });

  const assignedBadge = badge || (type === 'MIND_MAP' ? 'Mapa Mental' : 'Print de Caderno');
  const defaultImage = imageUrl || (type === 'MIND_MAP'
    ? 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=400&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80');

  const initialStatus = evaluation.aiApproved ? 'published' : 'in_moderation';

  const result = db.prepare(`
    INSERT INTO notebook_uploads (class_id, student_id, author_name, title, type, image_url, badge, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    classId || 1,
    user.id,
    `${user.name} (${user.intelligence_role || 'Curador'})`,
    title,
    type || 'HANDWRITTEN_NOTEBOOK',
    defaultImage,
    assignedBadge,
    initialStatus
  );

  if (!evaluation.aiApproved) {
    db.prepare(`
      INSERT INTO moderation_queue (class_id, title, author, ai_status, human_status, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(
      classId || 1,
      title,
      user.name,
      evaluation.aiStatus,
      evaluation.humanStatus
    );
  }

  const newNotebook = db.prepare('SELECT * FROM notebook_uploads WHERE id = ?').get(result.lastInsertRowid);

  return NextResponse.json({
    notebook: newNotebook,
    moderation: evaluation,
    message: evaluation.aiApproved ? 'Material publicado no Hub de Conhecimento' : 'Material em análise pela moderação'
  }, { status: 201 });
}
