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

  const { searchParams } = new URL(request.url);
  const classId = Number(searchParams.get('classId')) || 1;

  const realStats = db.prepare(`
    SELECT 
      q.bncc_code as skill_code,
      COALESCE(b.skill_desc, MAX(q.subject)) as skill_desc,
      MAX(q.subject) as subject,
      COUNT(qs.id) as total_submissions,
      SUM(CASE WHEN qs.is_correct = 1 THEN 1 ELSE 0 END) as correct_submissions,
      COUNT(DISTINCT qs.student_id) as students_count,
      COUNT(DISTINCT COALESCE(qs.group_id, gm.group_id)) as groups_count
    FROM quizzes q
    LEFT JOIN quiz_submissions qs ON qs.quiz_id = q.id
    LEFT JOIN group_members gm ON gm.user_id = qs.student_id
    LEFT JOIN bncc_skills_mastery b ON b.skill_code = q.bncc_code AND b.class_id = q.class_id
    WHERE q.class_id = ?
    GROUP BY q.bncc_code
  `).all(classId) as any[];

  const existingSkills = new Set(realStats.map((r: any) => r.skill_code));

  const extraMastery = db.prepare(`
    SELECT skill_code, skill_desc, skill_desc as subject, 0 as total_submissions, 0 as correct_submissions, 0 as students_count, 0 as groups_count
    FROM bncc_skills_mastery
    WHERE class_id = ?
  `).all(classId) as any[];

  for (const extra of extraMastery) {
    if (!existingSkills.has(extra.skill_code)) {
      realStats.push(extra);
    }
  }

  const heatmap = realStats.map((row: any) => {
    const total = row.total_submissions || 0;
    const correct = row.correct_submissions || 0;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const level = pct >= 80 ? 'lvl-high' : pct >= 60 ? 'lvl-mid' : 'lvl-low';

    const existingRow = db.prepare('SELECT id FROM bncc_skills_mastery WHERE class_id = ? AND skill_code = ?').get(classId, row.skill_code) as any;
    if (existingRow) {
      db.prepare('UPDATE bncc_skills_mastery SET mastery_percentage = ?, level = ? WHERE id = ?').run(pct, level, existingRow.id);
    } else {
      db.prepare(`
        INSERT INTO bncc_skills_mastery (class_id, skill_code, skill_desc, mastery_percentage, level)
        VALUES (?, ?, ?, ?, ?)
      `).run(classId, row.skill_code, row.skill_desc || row.subject, pct, level);
    }

    return {
      id: row.skill_code,
      skill_code: row.skill_code,
      skill_desc: row.skill_desc || row.subject,
      subject: row.subject,
      mastery_percentage: pct,
      total_submissions: total,
      correct_submissions: correct,
      students_count: row.students_count || 0,
      groups_count: row.groups_count || 0,
      level
    };
  });

  heatmap.sort((a: any, b: any) => b.mastery_percentage - a.mastery_percentage || b.total_submissions - a.total_submissions);

  return NextResponse.json({ heatmap });
}
