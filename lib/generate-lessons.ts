import Anthropic from "@anthropic-ai/sdk";
import { eq, sql, desc } from "drizzle-orm";
import db from "@/db/drizzle";
import {
  units,
  lessons,
  challenges,
  challengeOptions,
  userProgress,
  courses,
} from "@/db/schema";
import { detectWeakTags } from "@/lib/student-level";
import { cefrBand, floatToCefr } from "@/lib/cefr";

const anthropic = new Anthropic();

// ─── Types mirroring the expected Claude JSON output ──────────────────────
type AIOption = {
  text: string;
  correct: boolean;
  matchGroup?: number;
};

type AIChallenge = {
  type: "SELECT" | "ASSIST" | "SPEAK" | "TRANSLATE" | "FILL_IN_BLANK" | "LISTEN_AND_TYPE" | "MATCH";
  question: string;
  level: string;
  skill_type: string;
  tags: string[];
  estimatedTimeSeconds?: number;
  options?: AIOption[];
  choices?: AIOption[];
};

type AILesson = {
  title: string;
  subject: string;
  level: string;
  tags: string[];
  challenges: AIChallenge[];
};

type AIResponse = { lessons: AILesson[] };

// ─── Build the generation prompt ──────────────────────────────────────────
function buildPrompt(
  cefrLevel: string,
  unitTheme: string,
  weakTags: string[]
): string {
  const weakSection =
    weakTags.length > 0
      ? `Tags com maior dificuldade do aluno (reforce esses temas): ${weakTags.join(", ")}`
      : "Sem pontos fracos identificados ainda.";

  return `Você é um professor de inglês expert em pedagogia e no padrão CEFR.

Gere exatamente 4 lições de inglês para um aluno com nível atual ${cefrLevel}.
Cada lição deve ter um tema central coeso e conter exatamente 8 desafios nesta ordem:
SELECT, ASSIST, SPEAK, SELECT, TRANSLATE, FILL_IN_BLANK, SPEAK, MATCH

Contexto do aluno:
- Nível atual: ${cefrLevel}
- CRÍTICO: Use APENAS estes níveis exatos: A1.1, A1.2, A1.3, A2.1, A2.2, A2.3, B1.1, B1.2, B1.3, B2.1, B2.2, B2.3, C1.1, C1.2, C1.3. NUNCA invente outros como A1.4 ou A2.4.
- ${weakSection}
- Tema geral da unidade: ${unitTheme}

Regras de classificação do nível de cada desafio:
- SELECT e ASSIST: nível atual ± 0.1
- SPEAK e MATCH: nível atual + 0.1 a + 0.3 (levemente desafiador)
- FILL_IN_BLANK e TRANSLATE: nível atual (reforço)

Regras de idioma:
- Enunciados sempre em português
- Para níveis A1/A2: perguntas simples, vocabulário básico, frases curtas
- Para B1+: transicionar gradualmente para enunciados em inglês
- TRANSLATE: peça para traduzir DO português PARA o inglês
- FILL_IN_BLANK: sempre lacuna de palavra única
- SPEAK: palavra única ou frase curta (A1/A2), frases completas (B1+). OBRIGATÓRIO: inclua sempre uma option { "text": "resposta esperada", "correct": true }
- MATCH: sempre 4 pares (8 options total), matchGroup de 1 a 4

Para SELECT e ASSIST: sempre 4 options, a opção correta deve variar de posição (não sempre a primeira).

Retorne APENAS um JSON válido neste formato, sem texto adicional, sem markdown, sem backticks:
{
  "lessons": [
    {
      "title": "título da lição em português",
      "subject": "tema central em inglês (ex: Ordering food at a restaurant)",
      "level": "${cefrLevel}",
      "tags": ["tag1", "tag2", "tag3"],
      "challenges": [
        {
          "type": "SELECT",
          "question": "...",
          "level": "${cefrLevel}",
          "skill_type": "vocabulary",
          "tags": ["food"],
          "estimatedTimeSeconds": 20,
          "options": [
            { "text": "...", "correct": false },
            { "text": "...", "correct": true },
            { "text": "...", "correct": false },
            { "text": "...", "correct": false }
          ]
        }
      ]
    }
  ]
}`;
}

// ─── Parse and validate Claude's response ────────────────────────────────
function parseAIResponse(raw: string): AIResponse {
  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean) as AIResponse;

  if (!parsed.lessons || !Array.isArray(parsed.lessons)) {
    throw new Error("Invalid AI response: missing lessons array");
  }
  if (parsed.lessons.length !== 4) {
    throw new Error(`Expected 4 lessons, got ${parsed.lessons.length}`);
  }

  return parsed;
}

// ─── Save AI-generated lessons to DB ─────────────────────────────────────
async function saveLessons(
  unitId: number,
  aiLessons: AILesson[],
  startOrder: number
): Promise<void> {
  for (let i = 0; i < aiLessons.length; i++) {
    const al = aiLessons[i];

    const [newLesson] = await db
      .insert(lessons)
      .values({
        title: al.title,
        unitId,
        subject: al.subject,
        order: startOrder + i,
        level: al.level,
        tags: al.tags ?? [],
      })
      .returning();

    for (let j = 0; j < al.challenges.length; j++) {
      const ac = al.challenges[j];

      const [newChallenge] = await db
        .insert(challenges)
        .values({
          lessonId: newLesson.id,
          type: ac.type,
          question: ac.question,
          order: j + 1,
          level: ac.level,
          skill_type: ac.skill_type,
          tags: ac.tags ?? [],
          estimatedTimeSeconds: ac.estimatedTimeSeconds ?? 30,
        })
        .returning();

      const rawOpts = ac.options ?? ac.choices ?? [];
      const safeOpts = rawOpts.length === 0
        ? [{ text: ac.question, correct: true, matchGroup: undefined }]
        : rawOpts;
      for (const opt of safeOpts) {
        await db.insert(challengeOptions).values({
          challengeId: newChallenge.id,
          text: opt.text,
          correct: opt.correct ?? false,
          matchGroup: opt.matchGroup ?? null,
        });
      }
    }
  }
}

// ─── Create a new unit when needed ───────────────────────────────────────
async function createNewUnit(
  courseId: number,
  cefrLevel: string,
  currentUnitOrder: number
): Promise<number> {
  const band = cefrBand(cefrLevel);
  const [newUnit] = await db
    .insert(units)
    .values({
      courseId,
      title: `Nível ${band} — Unidade ${currentUnitOrder + 1}`,
      description: `Conteúdo gerado para o nível ${cefrLevel}`,
      order: currentUnitOrder + 1,
      cefrLevel,
    })
    .returning();

  return newUnit.id;
}

// ─── Main export: generateLessons ─────────────────────────────────────────
// Generates 4 new lessons for the given unit using Claude.
// Handles unit creation if needed.

export async function generateLessons(
  userId: string,
  unitId: number
): Promise<{ lessonIds: number[] }> {
  // Load context
  const up = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: { activeCourse: true },
  });
  if (!up) throw new Error("User progress not found");

  const unit = await db.query.units.findFirst({
    where: eq(units.id, unitId),
  });
  if (!unit) throw new Error("Unit not found");

  const cefrLevel = up.cefrLevel ?? "A1.1";
  const unitTheme = unit.subject ?? unit.title ?? "General English";
  const weakTags  = await detectWeakTags(userId);

  // Reset sequences to prevent duplicate key conflicts
  await db.execute(sql`SELECT setval('units_id_seq', (SELECT COALESCE(MAX(id), 1) FROM units))`);
  await db.execute(sql`SELECT setval('lessons_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lessons))`);
  await db.execute(sql`SELECT setval('challenges_id_seq', (SELECT COALESCE(MAX(id), 1) FROM challenges))`);
  await db.execute(sql`SELECT setval('challenge_options_id_seq', (SELECT COALESCE(MAX(id), 1) FROM challenge_options))`);

  // Reset sequences to prevent duplicate key conflicts
  await db.execute(sql`SELECT setval('units_id_seq', (SELECT COALESCE(MAX(id), 1) FROM units))`);
  await db.execute(sql`SELECT setval('lessons_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lessons))`);
  await db.execute(sql`SELECT setval('challenges_id_seq', (SELECT COALESCE(MAX(id), 1) FROM challenges))`);
  await db.execute(sql`SELECT setval('challenge_options_id_seq', (SELECT COALESCE(MAX(id), 1) FROM challenge_options))`);

  // Get current max lesson order in this unit
  const lessonOrderResult = await db.execute(
    sql`SELECT COALESCE(MAX("order"), 0) + 1 AS next_order FROM lessons WHERE unit_id = ${unitId}`
  );
  const startOrder = Number(lessonOrderResult.rows[0]?.next_order ?? 1);

  // Call Claude
  const prompt = buildPrompt(cefrLevel, unitTheme, weakTags);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const aiData = parseAIResponse(raw);

  // Save to DB and collect new lesson IDs
  // We do this inline to return IDs
  const lessonIds: number[] = [];

  for (let i = 0; i < aiData.lessons.length; i++) {
    const al = aiData.lessons[i];

    const [newLesson] = await db
      .insert(lessons)
      .values({
        title: al.title,
        unitId,
        subject: al.subject,
        order: startOrder + i,
        level: al.level,
        tags: al.tags ?? [],
      })
      .returning();

    lessonIds.push(newLesson.id);

    for (let j = 0; j < al.challenges.length; j++) {
      const ac = al.challenges[j];

      const [newChallenge] = await db
        .insert(challenges)
        .values({
          lessonId: newLesson.id,
          type: ac.type,
          question: ac.question,
          order: j + 1,
          level: ac.level,
          skill_type: ac.skill_type,
          tags: ac.tags ?? [],
          estimatedTimeSeconds: ac.estimatedTimeSeconds ?? 30,
        })
        .returning();

      const rawOpts = ac.options ?? ac.choices ?? [];
      const safeOpts = rawOpts.length === 0
        ? [{ text: ac.question, correct: true, matchGroup: undefined }]
        : rawOpts;
      for (const opt of safeOpts) {
        await db.insert(challengeOptions).values({
          challengeId: newChallenge.id,
          text: opt.text,
          correct: opt.correct ?? false,
          matchGroup: opt.matchGroup ?? null,
        });
      }
    }
  }

  return { lessonIds };
}

// ─── shouldCreateNewUnit ──────────────────────────────────────────────────
// Returns true if conditions for a new unit are met:
//   - student completed 60+ total lessons, OR
//   - student crossed a CEFR band boundary (e.g. A2 → B1)

export async function shouldCreateNewUnit(
  userId: string,
  courseId: number,
  previousCefrBand: string
): Promise<boolean> {
  const up = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
  if (!up) return false;

  const currentBand = cefrBand(up.cefrLevel ?? "A1.1");

  // Condition 1: CEFR band changed
  if (currentBand !== previousCefrBand) return true;

  // Condition 2: 60+ completed lessons in course
  const result = await db.execute(sql`
    SELECT COUNT(DISTINCT l.id) AS completed_count
    FROM lessons l
    JOIN units u ON l.unit_id = u.id
    JOIN challenges c ON l.id = c.lesson_id
    JOIN challenge_progress cp ON c.id = cp.challenge_id
    WHERE u.course_id = ${courseId}
      AND cp.user_id = ${userId}
      AND cp.completed = true
  `);
  const count = Number(result.rows[0]?.completed_count ?? 0);
  return count >= 60 && count % 60 === 0; // every 60 lessons
}

// ─── getOrCreateActiveUnit ────────────────────────────────────────────────
// Always creates a brand new unit for each generation batch.

export async function getOrCreateActiveUnit(
  userId: string,
  courseId: number,
  previousCefrBand: string
): Promise<number> {
  const lastUnit = await db.query.units.findFirst({
    where: eq(units.courseId, courseId),
    orderBy: (u, { desc }) => [desc(u.order)],
  });

  const up = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
  const cefrLevel = up?.cefrLevel ?? "A1.1";
  const currentOrder = lastUnit?.order ?? 0;

  // Always create a new unit for each generation batch
  return createNewUnit(courseId, cefrLevel, currentOrder);
}