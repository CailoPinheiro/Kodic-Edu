import { NextRequest, NextResponse } from 'next/server';
import db from '@/backend/db';
import { getAuthUser } from '@/backend/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.role !== 'teacher' && user.is_leader !== 1) {
    return NextResponse.json({ error: 'Requires class leader or teacher privileges' }, { status: 403 });
  }

  const itemId = params.id;
  const item = db.prepare('SELECT * FROM moderation_queue WHERE id = ?').get(itemId);
  if (!item) {
    return NextResponse.json({ error: 'Moderation item not found' }, { status: 404 });
  }

  db.prepare("UPDATE moderation_queue SET status = 'approved', approved_by_id = ? WHERE id = ?").run(user.id, itemId);

  return NextResponse.json({
    success: true,
    message: `Item aprovado com sucesso por ${user.name}`
  });
}
