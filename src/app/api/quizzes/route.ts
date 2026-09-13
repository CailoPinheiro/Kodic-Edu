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

  const membership = db.prepare(`
    SELECT g.id, g.name FROM groups g
    JOIN group_members gm ON gm.group_id = g.id
    WHERE gm.user_id = ?
    ORDER BY g.id ASC LIMIT 1
  `).get(user.id) as any;

  const groupId = membership ? membership.id : null;
  const groupName = membership ? membership.name : null;

  const quizzes = db.prepare(`
    SELECT q.*, u.name as author_name
    FROM quizzes q
    JOIN users u ON u.id = q.author_id
    ORDER BY q.id DESC
  `).all() as any[];

  const submissions = groupId
    ? (db.prepare(`
        SELECT quiz_id, student_id, selected_index, is_correct, points_awarded
        FROM quiz_submissions
        WHERE group_id = ? OR student_id = ?
      `).all(groupId, user.id) as any[])
    : (db.prepare(`
        SELECT quiz_id, student_id, selected_index, is_correct, points_awarded
        FROM quiz_submissions
        WHERE student_id = ?
      `).all(user.id) as any[]);

  const submissionMap = new Map<number, any>();
  for (const s of submissions) {
    if (!submissionMap.has(s.quiz_id) || s.is_correct) {
      submissionMap.set(s.quiz_id, s);
    }
  }

  const groupsAnsweredRows = db.prepare(`
    SELECT qs.quiz_id, COUNT(DISTINCT COALESCE(qs.group_id, gm.group_id)) as count
    FROM quiz_submissions qs
    LEFT JOIN group_members gm ON gm.user_id = qs.student_id
    GROUP BY qs.quiz_id
  `).all() as any[];

  const groupsCountMap = new Map<number, number>();
  for (const row of groupsAnsweredRows) {
    groupsCountMap.set(row.quiz_id, row.count);
  }

  const totalGroupsRow = db.prepare('SELECT count(*) as total FROM groups').get() as any;
  const totalGroupsCount = totalGroupsRow?.total || 0;

  const formattedQuizzes = quizzes.map((q) => {
    const sub = submissionMap.get(q.id);
    return {
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
      createdAt: q.created_at,
      completed: Boolean(sub),
      isCorrect: sub ? Boolean(sub.is_correct) : null,
      selectedOption: sub ? sub.selected_index : null,
      groupsAnswered: groupsCountMap.get(q.id) || 0,
      totalGroups: totalGroupsCount
    };
  });

  const completedCount = formattedQuizzes.filter((q) => q.completed).length;
  const totalCount = formattedQuizzes.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return NextResponse.json({
    quizzes: formattedQuizzes,
    group: membership ? { id: groupId, name: groupName } : null,
    stats: {
      total: totalCount,
      completed: completedCount,
      pending: totalCount - completedCount,
      allCompleted
    }
  });
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
