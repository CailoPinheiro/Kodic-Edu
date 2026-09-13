import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/backend/auth';
import { BnccService } from '@/backend/services/bnccService';

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Requires teacher role' }, { status: 403 });
  }

  const { bnccCode, subject } = await request.json().catch(() => ({}));
  const generated = BnccService.generateQuiz({ bnccCode, subject });
  return NextResponse.json({ quiz: generated });
}
