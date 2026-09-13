import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/backend/auth';
import { BnccService } from '@/backend/services/bnccService';

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const skills = BnccService.getAllSkills();
  return NextResponse.json({ skills });
}
