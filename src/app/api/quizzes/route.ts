import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  ensureSeeded();

  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const quizzes = db.prepare(`
    SELECT q.*, u.name as author_name
    FROM quizzes q
    JOIN users u ON u.id = q.author_id
    ORDER BY q.id DESC
  `).all() as any[];

  const formattedQuizzes = quizzes.map((q) => ({
    id: q.id,
    classId: q.class_id,
    subject: q.subject,
    bnccCode: q.bncc_code,
    question: q.question,
    options: JSON.parse(q.options_json || '[]'),
    correctIndex: q.correct_index,
    pointsReward: q.points_reward,
    isAiGenerated: Boolean(q.is_ai_generated),
    authorName: q.author_name,
    createdAt: q.created_at
  }));

  return NextResponse.json({ quizzes: formattedQuizzes });
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { classId, subject, bnccCode, question, options, correctIndex, pointsReward, isAiGenerated } = await request.json();

  if (!question || !options || options.length < 2 || correctIndex === undefined) {
    return NextResponse.json({ error: 'Question, options and correctIndex are required' }, { status: 400 });
  }

  const result = db.prepare(`
    INSERT INTO quizzes (class_id, author_id, subject, bncc_code, question, options_json, correct_index, points_reward, is_ai_generated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    classId || 1,
    user.id,
    subject || 'Geografia',
    bnccCode || 'EM13CHS202',
    question,
    JSON.stringify(options),
    correctIndex,
    pointsReward || 50,
    isAiGenerated ? 1 : 0
  );

  const newQuiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(result.lastInsertRowid) as any;
  newQuiz.options = JSON.parse(newQuiz.options_json);

  return NextResponse.json({ quiz: newQuiz }, { status: 201 });
}
