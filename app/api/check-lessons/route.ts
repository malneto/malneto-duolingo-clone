import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import db from '@/db/drizzle';
import { lessons, challenges, user_challenge_history, user_progress, units } from '@/db/schema';

export const GET = async () => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = user.id;

  // Get active course
  const up = await db.query.user_progress.findFirst({
    where: eq(user_progress.userId, userId),
  });

  if (!up || !up.activeCourseId) {
    return NextResponse.json({ lessonsPending: 0 });
  }

  const activeCourseId = up.activeCourseId;

  // Count pending lessons: lessons with unfinished challenges
  const result = await db.execute(sql`
    SELECT COUNT(DISTINCT l.id) as count
    FROM ${lessons} l
    JOIN ${units} u ON l.unit_id = u.id
    JOIN ${challenges} c ON l.id = c.lesson_id
    LEFT JOIN ${user_challenge_history} h ON c.id = h.challenge_id AND h.user_id = ${userId} AND h.correct = true
    WHERE u.course_id = ${activeCourseId} AND h.id IS NULL
  `);

  const count = Number(result.rows[0]?.count || 0);

  if (count < 2) {
    console.log('[Fera] Trigger xAI: pending lessons:', count);
    // Commit 2+: call xAI generate/insert
  }

  return NextResponse.json({ lessonsPending: count });
};