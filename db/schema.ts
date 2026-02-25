import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  date,           // ← adicione esta vírgula e o "date"
} from "drizzle-orm/pg-core";

import { MAX_HEARTS } from "@/constants";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),   // ← adicione esta linha
});

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  sectionId: integer("section_id").references(() => sections.id, { onDelete: "cascade" }), // ← Novo
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, {
      onDelete: "cascade",
    })
    .notNull(),  
  subject: text("subject"), // ← NOVA COLUNA
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),

  // === CAMPOS NOVOS PARA SISTEMA DINÂMICO ===
  level: integer("level").default(1).notNull(),
  skill_type: text("skill_type"),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
  // Novo campo para MATCH
  matchGroup: integer("match_group"),
});

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull(),
  userImageSrc: text("user_image_src").notNull(),
  activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),

  // === NOVAS COLUNAS PARA O STREAK ===
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: date("last_activity_date"),

}, (table) => ({
  // índices se quiser (opcional)
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

// ==================== NOVAS TABELAS PARA SISTEMA DINÂMICO ====================

export const user_progress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),           // Clerk user ID
  current_level: integer("current_level").default(1).notNull(),
  daily_lessons_completed: integer("daily_lessons_completed").default(0).notNull(),
  last_lesson_date: date("last_lesson_date"),
  hearts: integer("hearts").default(5).notNull(),
  xp: integer("xp").default(0).notNull(),
});

export const user_challenge_history = pgTable("user_challenge_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user_progress.userId, { onDelete: "cascade" }),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at").defaultNow(),
  correct: boolean("correct").notNull(),
  xpEarned: integer("xp_earned").default(0),
});
