"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { MAX_HEARTS } from "@/constants";
import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import {
  challengeProgress,
  challenges,
  userProgress,
  units,
  lessons,
} from "@/db/schema";
import { cefrBand } from "@/lib/cefr";
import { updateStudentLevel } from "@/lib/student-level";
import { generateLessons, getOrCreateActiveUnit } from "@/lib/generate-lessons";

// ─── Constants ─────────────────────────────────────────────────────────────
// Minimum pending lessons before we trigger generation
const GENERATION_THRESHOLD = 2;

// ─── Streak decay ──────────────────────────────────────────────────────────
function calcStreakDecay(currentStreak: number, daysInactive: number): number {
  if (daysInactive <= 0) return 0;
  let pct: number;
  if      (daysInactive >= 10) pct = 1.00;
  else if (daysInactive >= 5)  pct = 0.50;
  else if (daysInactive >= 4)  pct = 0.20;
  else if (daysInactive >= 3)  pct = 0.08;
  else if (daysInactive >= 2)  pct = 0.04;
  else                         pct = 0.02;
  return Math.max(1, Math.round(currentStreak * pct));
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.round(Math.abs(a - b) / (1000 * 60 * 60 * 24));
}

// ─── Count pending lessons for the active course ───────────────────────────
async function countPendingLessons(
  userId: string,
  courseId: number
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(DISTINCT l.id) AS count
    FROM lessons l
    JOIN units u ON l.unit_id = u.id
    JOIN challenges c ON l.id = c.lesson_id
    LEFT JOIN challenge_progress cp
      ON c.id = cp.challenge_id
      AND cp.user_id = ${userId}
      AND cp.completed = true
    WHERE u.course_id = ${courseId}
      AND cp.id IS NULL
  `);
  return Number(result.rows[0]?.count ?? 0);
}

// ─── Trigger lesson generation if needed (non-blocking) ───────────────────
// Runs in background — does NOT await so it doesn't slow down the response.
function triggerLessonGenerationIfNeeded(
  userId: string,
  courseId: number,
  cefrLevel: string
): void {
  // Fire and forget — errors are logged but don't affect the user
  (async () => {
    try {
      const pending = await countPendingLessons(userId, courseId);
      if (pending >= GENERATION_THRESHOLD) return;

      const currentBand = cefrBand(cefrLevel);
      const unitId = await getOrCreateActiveUnit(userId, courseId, currentBand);
      await generateLessons(userId, unitId);

      // Revalidate so new lessons appear immediately on next navigation
      revalidatePath("/learn");
    } catch (err) {
      console.error("[lesson-generation] background error:", err);
    }
  })();
}

// ─── Main action ───────────────────────────────────────────────────────────
export const upsertChallengeProgress = async (
  challengeId: number,
  timeSpentSeconds?: number
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  if (!currentUserProgress) throw new Error("User progress not found.");

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });
  if (!challenge) throw new Error("Challenge not found.");

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });
  const isPractice = !!existingChallengeProgress;

  if (
    currentUserProgress.hearts === 0 &&
    !isPractice &&
    !userSubscription?.isActive
  ) return { error: "hearts" };

  // ── Streak calculation ────────────────────────────────────────────────────
  const todayStr = new Date().toISOString().split("T")[0];
  const lastDate = currentUserProgress.lastActivityDate as string | null;

  let newStreak = currentUserProgress.currentStreak ?? 0;

  if (!lastDate) {
    newStreak = 1;
  } else if (lastDate === todayStr) {
    newStreak = currentUserProgress.currentStreak ?? 1;
  } else {
    const days = daysBetween(lastDate, todayStr);
    if (days === 1) {
      newStreak = (currentUserProgress.currentStreak ?? 0) + 1;
    } else {
      const decay = calcStreakDecay(currentUserProgress.currentStreak ?? 0, days - 1);
      newStreak = Math.max(0, (currentUserProgress.currentStreak ?? 0) - decay) + 1;
    }
  }

  const newLongestStreak = Math.max(
    currentUserProgress.longestStreak ?? 0,
    newStreak
  );

  // ── Save challenge progress ───────────────────────────────────────────────
  if (isPractice) {
    await db
      .update(challengeProgress)
      .set({ completed: true })
      .where(eq(challengeProgress.id, existingChallengeProgress.id));

    await db
      .update(userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1, MAX_HEARTS),
        points: currentUserProgress.points + 10,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: todayStr,
      })
      .where(eq(userProgress.userId, userId));
  } else {
    await db.insert(challengeProgress).values({
      challengeId,
      userId,
      completed: true,
    });

    await db
      .update(userProgress)
      .set({
        points: currentUserProgress.points + 10,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: todayStr,
      })
      .where(eq(userProgress.userId, userId));
  }

  // ── Update adaptive CEFR level ────────────────────────────────────────────
  // Always correct here (wrong answers go through reduceHearts, not here)
  if (currentUserProgress.activeCourseId) {
    await updateStudentLevel(
      userId,
      challengeId,
      true, // correct answer
      timeSpentSeconds ?? 30
    );

    // ── Trigger lesson generation in background ─────────────────────────────
    triggerLessonGenerationIfNeeded(
      userId,
      currentUserProgress.activeCourseId,
      currentUserProgress.cefrLevel ?? "A1.1"
    );
  }

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};