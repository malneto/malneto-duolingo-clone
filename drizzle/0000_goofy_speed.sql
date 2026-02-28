-- Apenas colunas novas que ainda não existem no banco

-- challenges: adicionar tags e estimated_time_seconds
ALTER TABLE "challenges" ADD COLUMN IF NOT EXISTS "tags" text[];
ALTER TABLE "challenges" ADD COLUMN IF NOT EXISTS "estimated_time_seconds" integer DEFAULT 30;

-- lessons: adicionar level e tags
ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "level" text;
ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "tags" text[];

-- units: adicionar subject e cefr_level
ALTER TABLE "units" ADD COLUMN IF NOT EXISTS "subject" text;
ALTER TABLE "units" ADD COLUMN IF NOT EXISTS "cefr_level" text;

-- user_progress: adicionar cefr_level e cefr_level_float
ALTER TABLE "user_progress" ADD COLUMN IF NOT EXISTS "cefr_level" text DEFAULT 'A1.1';
ALTER TABLE "user_progress" ADD COLUMN IF NOT EXISTS "cefr_level_float" real DEFAULT 1.1;
ALTER TABLE "user_progress" ADD COLUMN IF NOT EXISTS "current_streak" integer DEFAULT 0;
ALTER TABLE "user_progress" ADD COLUMN IF NOT EXISTS "longest_streak" integer DEFAULT 0;
ALTER TABLE "user_progress" ADD COLUMN IF NOT EXISTS "last_activity_date" date;

-- user_challenge_history: adicionar time_spent_seconds
ALTER TABLE "user_challenge_history" ADD COLUMN IF NOT EXISTS "time_spent_seconds" integer;
