"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { MAX_HEARTS } from "@/constants";
import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";

// ─── Streak decay table ────────────────────────────────────────────────────
// Returns how many integer streak points to subtract based on days inactive.
// Decay is percentage-based and applied to the CURRENT streak value.
//
//  1 day  →  -2%
//  2 days →  -4%
//  3 days →  -8%
//  4 days → -20%
//  5 days → -50%
// 10+ days → -100%
//
function calcStreakDecay(currentStreak: number, daysInactive: number): number {
  if (daysInactive <= 0) return 0;

  let pct: number;
  if      (daysInactive >= 10) pct = 1.00;
  else if (daysInactive >= 5)  pct = 0.50;
  else if (daysInactive >= 4)  pct = 0.20;
  else if (daysInactive >= 3)  pct = 0.08;
  else if (daysInactive >= 2)  pct = 0.04;
  else                         pct = 0.02;   // 1 day

  // Always subtract at least 1 streak point when there's any decay
  return Math.max(1, Math.round(currentStreak * pct));
}

// ─── Helper: days between two date strings (YYYY-MM-DD) ────────────────────
function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.round(Math.abs(a - b) / (1000 * 60 * 60 * 24));
}

// ─── Main action ───────────────────────────────────────────────────────────
export const upsertChallengeProgress = async (challengeId: number) => {
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

  // ── Streak calculation ──────────────────────────────────────────────────
  const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const lastDate = currentUserProgress.lastActivityDate as string | null;

  let newStreak = currentUserProgress.currentStreak ?? 0;

  if (!lastDate) {
    // First ever activity
    newStreak = 1;
  } else if (lastDate === todayStr) {
    // Already did something today — streak unchanged
    newStreak = currentUserProgress.currentStreak ?? 1;
  } else {
    const days = daysBetween(lastDate, todayStr);

    if (days === 1) {
      // Perfect — consecutive day, grow streak
      newStreak = (currentUserProgress.currentStreak ?? 0) + 1;
    } else {
      // Missed days — apply decay THEN add +1 for today's activity
      const decay = calcStreakDecay(currentUserProgress.currentStreak ?? 0, days - 1);
      newStreak = Math.max(0, (currentUserProgress.currentStreak ?? 0) - decay) + 1;
    }
  }

  const newLongestStreak = Math.max(
    currentUserProgress.longestStreak ?? 0,
    newStreak
  );
  // ────────────────────────────────────────────────────────────────────────

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

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};