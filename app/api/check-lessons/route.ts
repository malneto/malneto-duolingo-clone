import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";

// ─── GET /api/check-lessons ───────────────────────────────────────────────
// Read-only: returns how many lessons are still pending for the active course.
// Lesson GENERATION is triggered server-side inside upsertChallengeProgress,
// never directly from the client.

export const GET = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const up = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, user.id),
    });

    if (!up?.activeCourseId) {
      return NextResponse.json({ lessonsPending: 0 });
    }

    const result = await db.execute(sql`
      SELECT COUNT(DISTINCT l.id) AS count
      FROM lessons l
      JOIN units u ON l.unit_id = u.id
      JOIN challenges c ON l.id = c.lesson_id
      LEFT JOIN challenge_progress cp
        ON c.id = cp.challenge_id
        AND cp.user_id = ${user.id}
        AND cp.completed = true
      WHERE u.course_id = ${up.activeCourseId}
        AND cp.id IS NULL
    `);

    const pending = Number(result.rows[0]?.count ?? 0);

    return NextResponse.json({
      lessonsPending: pending,
      cefrLevel: up.cefrLevel,
    });
  } catch (e: any) {
    console.error("[check-lessons GET error]", e);
    return NextResponse.json(
      { success: false, error: e.message ?? "Internal error" },
      { status: 500 }
    );
  }
};