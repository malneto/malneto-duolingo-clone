import { and, desc, eq, gte, sql } from "drizzle-orm";
import db from "@/db/drizzle";
import {
  challenges,
  user_challenge_history,
  userProgress,
} from "@/db/schema";
import { clampCefr, floatToCefr } from "@/lib/cefr";

// ─── updateStudentLevel ────────────────────────────────────────────────────
// Called after each challenge answer. Adjusts cefrLevelFloat based on
// correctness and time spent vs estimated time.
//
// Deltas:
//   correct + fast   → +0.3  (comfortable, time to push harder)
//   correct + slow   → +0.1  (got it but struggled)
//   wrong (1st time) → -0.1
//   wrong (repeated) → -0.3  (schedule for revision)

export async function updateStudentLevel(
  userId: string,
  challengeId: number,
  correct: boolean,
  timeSpentSeconds: number
): Promise<void> {
  // Get current user progress
  const up = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
  if (!up) return;

  // Get challenge estimated time
  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
    columns: { estimatedTimeSeconds: true, tags: true },
  });

  const estimated = challenge?.estimatedTimeSeconds ?? 30;
  const currentFloat = up.cefrLevelFloat ?? 1.1;

  // Count previous wrong attempts for this challenge
  const prevAttempts = await db.query.user_challenge_history.findMany({
    where: and(
      eq(user_challenge_history.userId, userId),
      eq(user_challenge_history.challengeId, challengeId),
      eq(user_challenge_history.correct, false)
    ),
    columns: { id: true },
  });
  const isRepeatedWrong = !correct && prevAttempts.length > 0;

  // Calculate delta
  let delta = 0;
  if (correct && timeSpentSeconds <= estimated)      delta = +0.3;
  else if (correct && timeSpentSeconds > estimated)  delta = +0.1;
  else if (isRepeatedWrong)                          delta = -0.3;
  else                                               delta = -0.1;

  const newFloat = clampCefr(currentFloat + delta);
  const newCefr  = floatToCefr(newFloat);

  // Save history entry
  await db.insert(user_challenge_history).values({
    userId,
    challengeId,
    correct,
    timeSpentSeconds,
    xpEarned: correct ? 10 : 0,
  });

  // Update user progress
  await db
    .update(userProgress)
    .set({ cefrLevelFloat: newFloat, cefrLevel: newCefr })
    .where(eq(userProgress.userId, userId));
}

// ─── detectWeakTags ────────────────────────────────────────────────────────
// Analyses user_challenge_history for the last 30 tagged challenges and
// returns tags where error rate > 40%.

export async function detectWeakTags(userId: string): Promise<string[]> {
  // Fetch last 30 challenge history entries with their challenge tags
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

  // Tally correct/wrong per tag
  const tagStats: Record<string, { correct: number; wrong: number }> = {};

  for (const row of history) {
    const tags = row.tags ?? [];
    for (const tag of tags) {
      if (!tagStats[tag]) tagStats[tag] = { correct: 0, wrong: 0 };
      if (row.correct) tagStats[tag].correct++;
      else             tagStats[tag].wrong++;
    }
  }

  // Return tags with error rate > 40%
  return Object.entries(tagStats)
    .filter(([, s]) => {
      const total = s.correct + s.wrong;
      return total >= 2 && s.wrong / total > 0.4;
    })
    .map(([tag]) => tag);
}