import { NextRequest, NextResponse } from 'next/server';
import db from '@/backend/db';
import { ensureSeeded } from '@/backend/seed';

export async function GET(request: NextRequest) {
  ensureSeeded();

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();

  const schools = query
    ? db.prepare('SELECT id, name, city FROM schools WHERE name LIKE ? ORDER BY name ASC LIMIT 10').all(`%${query}%`)
    : db.prepare('SELECT id, name, city FROM schools ORDER BY name ASC LIMIT 10').all();

  return NextResponse.json({ schools });
}
