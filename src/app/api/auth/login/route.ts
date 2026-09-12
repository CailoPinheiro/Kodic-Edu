import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { signToken } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    ensureSeeded();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role, is_leader: user.is_leader });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      grade: user.grade,
      intelligence_role: user.intelligence_role,
      is_leader: user.is_leader,
      points: user.points,
      avatar_url: user.avatar_url,
      badges: JSON.parse(user.badges_json || '[]')
    };

    return NextResponse.json({ token, user: safeUser });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
