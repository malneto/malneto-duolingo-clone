import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { challenges, userProgress, user_challenge_history } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Busca ou cria progresso do usuário
  let userProgress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!userProgress) {
    [userProgress] = await db.insert(user_progress).values({
      userId,
      current_level: 1,
      daily_lessons_completed: 0,
      last_lesson_date: new Date().toISOString().split('T')[0],
    }).returning();
  }

  const currentLevel = userProgress.current_level || 1;
  const today = new Date().toISOString().split('T')[0];

  // Reset diário
  if (userProgress.last_lesson_date !== today) {
    await db.update(user_progress)
      .set({ daily_lessons_completed: 0, last_lesson_date: today })
      .where(eq(user_progress.userId, userId));
  }

  // Busca desafios adequados ao nível + evita repetição
  const availableChallenges = await db.select()
    .from(challenges)
    .where(
      and(
        sql`${challenges.level} BETWEEN ${currentLevel - 12} AND ${currentLevel + 10}`,
        sql`NOT EXISTS (
          SELECT 1 FROM user_challenge_history 
          WHERE user_challenge_history.challenge_id = challenges.id 
          AND user_challenge_history.user_id = ${userId}
        )`
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(8);

  // Embaralha para mais variedade
  const shuffled = [...availableChallenges].sort(() => Math.random() - 0.5);

  return NextResponse.json({
    lessonId: `dynamic-${Date.now()}`,
    title: `Nível ${currentLevel} - Lição Dinâmica`,
    challenges: shuffled,
    userLevel: currentLevel,
  });
}