import { and, desc, eq, sql } from "drizzle-orm";
import db from "@/db/drizzle";
import {
  challenges,
  lessons,
  user_challenge_history,
  userProgress,
} from "@/db/schema";
import { clampCefr, floatToCefr, cefrToFloat } from "@/lib/cefr";

// ─── Constants ─────────────────────────────────────────────────────────────
// A micro-level advance (e.g. A1.2 → A1.3) requires:
const LESSONS_REQUIRED        = 60;  // completed lessons at current micro-level
const FAST_LESSONS_REQUIRED   = 20;  // of which at least 20 must be "fast"
const FAST_SECONDS_PER_CHALLENGE = 5; // avg seconds/challenge to be considered fast

// ─── checkAndAdvanceLevel ──────────────────────────────────────────────────
// Checks whether the student qualifies for a micro-level advance.
// Only called after saving a new history entry.

async function checkAndAdvanceLevel(
  userId: string,
  currentCefrLevel: string,
  currentFloat: number
): Promise<void> {
  // Count completed lessons at the current micro-level
  // A lesson is "at current level" if its level matches cefrLevel
  // A lesson is "completed" if all its challenges have been answered correctly at least once
  const completedAtLevel = await db.execute(sql`
    SELECT
      l.id,
      AVG(uch.time_spent_seconds::float / NULLIF(
        (SELECT COUNT(*) FROM challenges c2 WHERE c2.lesson_id = l.id), 0
      )) AS avg_seconds_per_challenge
    FROM lessons l
    JOIN challenges c ON c.lesson_id = l.id
    JOIN user_challenge_history uch
      ON uch.challenge_id = c.id
      AND uch.user_id = ${userId}
      AND uch.correct = true
    WHERE l.level = ${currentCefrLevel}
    GROUP BY l.id
    HAVING COUNT(DISTINCT c.id) = COUNT(DISTINCT CASE WHEN uch.correct THEN c.id END)
  `);

  const completedLessons = completedAtLevel.rows as {
    id: number;
    avg_seconds_per_challenge: number | null;
  }[];

  const totalCompleted = completedLessons.length;
  if (totalCompleted < LESSONS_REQUIRED) return; // not enough lessons yet

  const fastLessons = completedLessons.filter(
    (l) =>
      l.avg_seconds_per_challenge !== null &&
      l.avg_seconds_per_challenge < FAST_SECONDS_PER_CHALLENGE
  ).length;

  if (fastLessons < FAST_LESSONS_REQUIRED) return; // not fast enough yet

  // Advance one micro-level
  const nextFloat = clampCefr(currentFloat + 0.1);
  const nextCefr  = floatToCefr(nextFloat);

  if (nextCefr === currentCefrLevel) return; // already at max

  await db
    .update(userProgress)
    .set({ cefrLevel: nextCefr, cefrLevelFloat: nextFloat })
    .where(eq(userProgress.userId, userId));

  console.log(
    `[student-level] ${userId} advanced from ${currentCefrLevel} → ${nextCefr} ` +
    `(${totalCompleted} lessons completed, ${fastLessons} fast)`
  );
}

// ─── updateStudentLevel ────────────────────────────────────────────────────
// Called after each challenge answer.
// - Always saves history entry
// - Never adjusts level by delta anymore
// - Checks advancement conditions after saving

export async function updateStudentLevel(
  userId: string,
  challengeId: number,
  correct: boolean,
  timeSpentSeconds: number
): Promise<void> {
  const up = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
  if (!up) return;

  const currentCefrLevel = up.cefrLevel ?? "A1.1";
  const currentFloat     = up.cefrLevelFloat ?? cefrToFloat(currentCefrLevel);

  // Save history entry
  await db.insert(user_challenge_history).values({
    userId,
    challengeId,
    correct,
    timeSpentSeconds,
    xpEarned: correct ? 10 : 0,
  });

  // Only check for level advance on correct answers
  if (correct) {
    await checkAndAdvanceLevel(userId, currentCefrLevel, currentFloat);
  }
}

// ─── detectWeakTags ────────────────────────────────────────────────────────
// Analyses user_challenge_history for the last 30 tagged challenges and
// returns tags where error rate > 40%.

export async function detectWeakTags(userId: string): Promise<string[]> {
  const history = await db
    .select({
      correct: user_challenge_history.correct,
      tags: challenges.tags,
    })
    .from(user_challenge_history)
    .innerJoin(challenges, eq(user_challenge_history.challengeId, challenges.id))
    .where(eq(user_challenge_history.userId, userId))
    .orderBy(desc(user_challenge_history.completedAt))
    .limit(30);

  const tagStats: Record<string, { correct: number; wrong: number }> = {};

  for (const row of history) {
    const tags = row.tags ?? [];
    for (const tag of tags) {
      if (!tagStats[tag]) tagStats[tag] = { correct: 0, wrong: 0 };
      if (row.correct) tagStats[tag].correct++;
      else             tagStats[tag].wrong++;
    }
  }

  return Object.entries(tagStats)
    .filter(([, s]) => {
      const total = s.correct + s.wrong;
      return total >= 2 && s.wrong / total > 0.4;
    })
    .map(([tag]) => tag);
}