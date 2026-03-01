import { and, desc, eq, sql } from "drizzle-orm";
import db from "@/db/drizzle";
import {
  challenges,
  user_challenge_history,
  userProgress,
} from "@/db/schema";
import { clampCefr, floatToCefr, cefrToFloat } from "@/lib/cefr";

// ─── Constants ─────────────────────────────────────────────────────────────
const LESSONS_REQUIRED           = 60; // lessons at current micro-level with 100% accuracy
const FAST_LESSONS_REQUIRED      = 20; // of which at least 20 must be "fast"
const FAST_SECONDS_PER_CHALLENGE = 5;  // avg seconds/challenge threshold

// ─── checkAndAdvanceLevel ──────────────────────────────────────────────────
// A lesson counts only if:
//   - its level matches the student's current micro-level
//   - ALL its challenges were answered correctly (100% accuracy)
//     meaning no wrong answer exists in user_challenge_history for that lesson
// Of those, at least 20 must have avg time < 5s per challenge.

async function checkAndAdvanceLevel(
  userId: string,
  currentCefrLevel: string,
  currentFloat: number
): Promise<void> {
  // Fetch lessons at current level where:
  //   - every challenge has at least one correct answer from this user
  //   - the user has ZERO wrong answers for any challenge in this lesson
  const result = await db.execute(sql`
    SELECT
      l.id,
      COUNT(DISTINCT c.id) AS total_challenges,
      -- avg seconds per challenge across all correct attempts
      AVG(
        uch_correct.time_spent_seconds::float
      ) AS avg_seconds_per_challenge
    FROM lessons l
    JOIN challenges c ON c.lesson_id = l.id
    -- must have at least one correct answer per challenge
    JOIN user_challenge_history uch_correct
      ON uch_correct.challenge_id = c.id
      AND uch_correct.user_id = ${userId}
      AND uch_correct.correct = true
    WHERE
      l.level = ${currentCefrLevel}
      -- exclude lessons where ANY challenge has a wrong answer
      AND l.id NOT IN (
        SELECT DISTINCT c2.lesson_id
        FROM challenges c2
        JOIN user_challenge_history uch_wrong
          ON uch_wrong.challenge_id = c2.id
          AND uch_wrong.user_id = ${userId}
          AND uch_wrong.correct = false
      )
    GROUP BY l.id
    -- only count lessons where ALL challenges were answered correctly
    HAVING COUNT(DISTINCT c.id) = COUNT(DISTINCT uch_correct.challenge_id)
  `);

  const lessons = result.rows as {
    id: number;
    total_challenges: number;
    avg_seconds_per_challenge: number | null;
  }[];

  const totalCompleted = lessons.length;
  if (totalCompleted < LESSONS_REQUIRED) return;

  const fastLessons = lessons.filter(
    (l) =>
      l.avg_seconds_per_challenge !== null &&
      l.avg_seconds_per_challenge < FAST_SECONDS_PER_CHALLENGE
  ).length;

  if (fastLessons < FAST_LESSONS_REQUIRED) return;

  // Advance one micro-level
  const nextFloat = clampCefr(currentFloat + 0.1);
  const nextCefr  = floatToCefr(nextFloat);

  if (nextCefr === currentCefrLevel) return; // already at max

  await db
    .update(userProgress)
    .set({ cefrLevel: nextCefr, cefrLevelFloat: nextFloat })
    .where(eq(userProgress.userId, userId));

  console.log(
    `[student-level] ${userId} advanced ${currentCefrLevel} → ${nextCefr} ` +
    `(${totalCompleted} perfect lessons, ${fastLessons} fast)`
  );
}

// ─── updateStudentLevel ────────────────────────────────────────────────────
// Called after each correct challenge answer.
// Saves history and checks if level advance conditions are met.

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
// Analyses the last 30 challenge history entries and returns tags
// where error rate > 40%.

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