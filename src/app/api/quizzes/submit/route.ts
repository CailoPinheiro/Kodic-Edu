import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { quizId, selectedIndex, optionIndex } = await request.json();
  const chosenIndex = selectedIndex !== undefined ? selectedIndex : optionIndex;

  if (quizId === undefined || chosenIndex === undefined) {
    return NextResponse.json({ error: 'quizId and optionIndex/selectedIndex are required' }, { status: 400 });
  }

  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(quizId) as any;
  if (!quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  const isCorrect = Number(chosenIndex) === Number(quiz.correct_index);
  const pointsReward = isCorrect ? quiz.points_reward : 0;
  const holderBonus = isCorrect ? 10 : 0;

  const membership = db.prepare(`
    SELECT group_id FROM group_members WHERE user_id = ? ORDER BY id ASC LIMIT 1
  `).get(user.id) as any;

  const groupId = membership ? membership.group_id : null;

  db.prepare(`
    INSERT INTO quiz_submissions (quiz_id, student_id, group_id, selected_index, is_correct, points_awarded)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(quiz.id, user.id, groupId, chosenIndex, isCorrect ? 1 : 0, pointsReward);

  const distributedTo: number[] = [];
  let totalClassPointsAdded = 0;

  let isHolder = false;
  if (isCorrect) {
    if (groupId) {
      const group = db.prepare('SELECT current_device_holder_id FROM groups WHERE id = ?').get(groupId) as any;
      const currentHolderId = group?.current_device_holder_id || user.id;
      isHolder = currentHolderId === user.id;

      const members = db.prepare('SELECT user_id FROM group_members WHERE group_id = ?').all(groupId) as any[];

      const updateUser = db.prepare('UPDATE users SET points = points + ? WHERE id = ?');
      const updateMember = db.prepare('UPDATE group_members SET points = points + ? WHERE group_id = ? AND user_id = ?');

      for (const m of members) {
        updateUser.run(pointsReward, m.user_id);
        updateMember.run(pointsReward, groupId, m.user_id);
        distributedTo.push(m.user_id);
      }

      if (holderBonus > 0 && currentHolderId) {
        updateUser.run(holderBonus, currentHolderId);
        updateMember.run(holderBonus, groupId, currentHolderId);
      }

      totalClassPointsAdded = (pointsReward * members.length) + holderBonus;
    } else {
      isHolder = true;
      db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(pointsReward + holderBonus, user.id);
      distributedTo.push(user.id);
      totalClassPointsAdded = pointsReward + holderBonus;
    }

    db.prepare('UPDATE classes SET current_points = current_points + ? WHERE id = ?').run(totalClassPointsAdded, quiz.class_id);
  }

  const updatedClass = db.prepare('SELECT id, current_points, goal_points FROM classes WHERE id = ?').get(quiz.class_id) as any;
  const updatedUser = db.prepare('SELECT id, points FROM users WHERE id = ?').get(user.id) as any;

  return NextResponse.json({
    isCorrect,
    correctIndex: quiz.correct_index,
    pointsAwarded: pointsReward,
    holderBonus,
    isHolder,
    totalClassPointsAdded,
    classCurrentPoints: updatedClass ? updatedClass.current_points : 0,
    classGoalPoints: updatedClass ? updatedClass.goal_points : 0,
    classPercentage: updatedClass ? Math.min(100, Math.round((updatedClass.current_points / updatedClass.goal_points) * 100)) : 0,
    userPoints: updatedUser ? updatedUser.points : 0,
    fairSyncMembersCount: distributedTo.length
  });
}
