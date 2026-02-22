import db from "@/db/drizzle";
import { courses, units, lessons, challenges, challengeOptions } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return new NextResponse("Unauthorized.", { status: 401 });
  }

  try {
    const { courseId, courseData } = await req.json();

    if (!courseData || !courseData.units || courseData.units.length === 0) {
      return NextResponse.json({ error: "JSON inválido ou sem unidades" }, { status: 400 });
    }

    let targetCourseId = courseId;

    await db.transaction(async (tx) => {
      // Criar novo curso
      if (!targetCourseId) {
        const [newCourse] = await tx.insert(courses).values({
          title: courseData.title || "Curso Importado por IA",
          imageSrc: courseData.imageSrc || "/course-default.png",
          isPublic: true,
        }).returning({ id: courses.id });

        targetCourseId = newCourse.id;
      }

      // Importar units
      for (const unitData of courseData.units) {
        const [newUnit] = await tx.insert(units).values({
          courseId: targetCourseId,
          title: unitData.title,
          description: unitData.description || "Unidade gerada por IA",
          order: unitData.order || 999,
        }).returning({ id: units.id });

        // Importar lessons
        for (const lessonData of unitData.lessons || []) {
          const [newLesson] = await tx.insert(lessons).values({
            unitId: newUnit.id,
            title: lessonData.title,
            order: lessonData.order || 999,
          }).returning({ id: lessons.id });

          // Importar challenges
          for (const chData of lessonData.challenges || []) {
            const [newChallenge] = await tx.insert(challenges).values({
              lessonId: newLesson.id,
              type: chData.type,
              question: chData.question,
              order: chData.order || 999,
            }).returning({ id: challenges.id });

            // Importar options
            for (const opt of chData.options || []) {
              await tx.insert(challengeOptions).values({
                challengeId: newChallenge.id,
                text: opt.text,
                correct: opt.correct,
              });
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `✅ Importação concluída com sucesso! Course ID: ${targetCourseId}`,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      error: "Erro na importação", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}