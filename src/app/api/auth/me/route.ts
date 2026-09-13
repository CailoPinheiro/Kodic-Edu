import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/backend/auth';
import { ensureSeeded } from '@/backend/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  ensureSeeded();

  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ user });
}
