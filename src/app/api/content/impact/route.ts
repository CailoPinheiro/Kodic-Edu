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

  const notifications = db.prepare('SELECT * FROM gratitude_notifications WHERE user_id = ? ORDER BY id DESC').all(user.id);

  return NextResponse.json({
    notifications,
    summary: {
      totalImpacts: notifications.length,
      privateOnly: true,
      description: 'Impacto Silencioso: Reconhecimento pedagógico focado em utilidade real e cooperação, sem contagem pública de curtidas.'
    }
  });
}
