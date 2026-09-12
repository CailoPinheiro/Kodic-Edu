import jwt from 'jsonwebtoken';
import db from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'kodic_edu_secret_jwt_key_2026';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getAuthUser(request: Request): any {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) return null;

  const user: any = db.prepare('SELECT id, name, email, role, grade, intelligence_role, is_leader, points, avatar_url, badges_json FROM users WHERE id = ?').get(decoded.id);
  if (!user) return null;

  user.badges = JSON.parse(user.badges_json || '[]');
  delete user.badges_json;

  return user;
}
