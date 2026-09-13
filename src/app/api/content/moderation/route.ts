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

  const queue = db.prepare("SELECT * FROM moderation_queue WHERE status = 'pending' ORDER BY id DESC").all();
  return NextResponse.json({ queue });
}
