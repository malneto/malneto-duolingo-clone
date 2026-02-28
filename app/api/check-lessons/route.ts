import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import db from '@/db/drizzle';
import { lessons, challenges, challengeOptions, user_progress, units, user_challenge_history } from '@/db/schema';

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

  // Count pending lessons
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
    // Get last unit
    const lastUnit = await db.query.units.findFirst({
      where: eq(units.courseId, activeCourseId),
      orderBy: sql`\"order\" DESC`,
    });

    if (!lastUnit) {
      return NextResponse.json({ lessonsPending: count, error: 'No unit' });
    }

    const unitId = lastUnit.id;

    // Lesson order
    const lessonOrderResult = await db.execute(sql`
      SELECT COALESCE(MAX(\"order\"), 0) + 1 as next_order FROM ${lessons} WHERE unit_id = ${unitId}
    `);
    const lessonOrder = Number(lessonOrderResult.rows[0].next_order);

    // xAI call
    const prompt = `Gere uma lição em inglês para criança de 10 anos. Tema variado. Formato JSON estrito sem texto extra: { "title": "Título da lição", "description": "Descrição curta", "challenges": [ { "type": "SELECT", "question": "Pergunta", "options": ["op1", "op2", "op3", "op4"], "correct": "op correta" }, { "type": "SPEAK", "question": "O que dizer", "options": [], "correct": "texto esperado" }, { "type": "ASSIST", "question": "Escute e selecione", "options": ["op1", "op2", "op3", "op4"], "correct": "op correta" } ] } com 4 SELECT, 1 SPEAK, 1 ASSIST. Varie a ordem em que aparecem os types de challenge e a ordem das challenges options corretas`;

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ lessonsPending: count, error: 'No XAI_API_KEY' });
    }

    const xaiRes = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-4-1-fast',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!xaiRes.ok) {
      const err = await xaiRes.text();
      console.error('[Fera xAI]', err);
      return NextResponse.json({ lessonsPending: count, error: 'xAI fail', details: err });
    }

    const data = await xaiRes.json();
    const content = data.choices[0].message.content;
    const lessonData = JSON.parse(content);

    // Insert lesson
    const [newLesson] = await db.insert(lessons).values({
      title: lessonData.title,
      unitId,
      subject: lessonData.description.slice(0,100),
      order: lessonOrder,
    }).returning();

    // Insert challenges & options
    for (let i = 0; i < lessonData.challenges.length; i++) {
      const ch = lessonData.challenges[i];
      const [newCh] = await db.insert(challenges).values({
        lessonId: newLesson.id,
        type: ch.type as any, // SPEAK added runtime
        question: ch.question,
        order: i + 1,
        level: Math.floor(Math.random() * 6) + 1,
      }).returning();

      // Shuffle options order
      const options = [...ch.options];
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }

      for (let j = 0; j < options.length; j++) {
        await db.insert(challengeOptions).values({
          challengeId: newCh.id,
          text: options[j],
          correct: options[j] === ch.correct,
          order: j,
        });
      }
    }

    return NextResponse.json({ lessonsPending: count, created: true, lessonId: newLesson.id });
  }

  return NextResponse.json({ lessonsPending: count });
};