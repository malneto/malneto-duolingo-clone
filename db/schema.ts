import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

import { MAX_HEARTS } from "@/constants";

// ─── Courses ───────────────────────────────────────────────────────────────
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

// ─── Sections ─────────────────────────────────────────────────────────────
export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sectionsRelations = relations(sections, ({ many }) => ({
  units: many(units),
}));

// ─── Units ────────────────────────────────────────────────────────────────
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  sectionId: integer("section_id").references(() => sections.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  // NEW: subject and CEFR level for the whole unit
  subject: text("subject"),
  cefrLevel: text("cefr_level"),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  section: one(sections, {
    fields: [units.sectionId],
    references: [sections.id],
  }),
  lessons: many(lessons),
}));

// ─── Lessons ──────────────────────────────────────────────────────────────
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  subject: text("subject"),
  order: integer("order").notNull(),
  // NEW
  level: text("level"),           // e.g. "B1.2"
  tags: text("tags").array(),     // e.g. ["restaurant","food"]
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

// ─── Challenges ───────────────────────────────────────────────────────────
// Expanded enum with all supported challenge types
export const challengesEnum = pgEnum("type", [
  "SELECT",
  "ASSIST",
  "SPEAK",
  "TRANSLATE",
  "FILL_IN_BLANK",
  "LISTEN_AND_TYPE",
  "MATCH",
]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
  // Changed from integer to text for CEFR strings like "B1.2"
  level: text("level"),
  skill_type: text("skill_type"),
  // NEW
  tags: text("tags").array(),
  estimatedTimeSeconds: integer("estimated_time_seconds").default(30),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
  history: many(user_challenge_history),
}));

// ─── Challenge Options ────────────────────────────────────────────────────
export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
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

// ─── Challenge Progress ───────────────────────────────────────────────────
export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
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

// ─── User Progress ────────────────────────────────────────────────────────
export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull(),
  userImageSrc: text("user_image_src").notNull(),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  hearts: integer("hearts").notNull().default(MAX_HEARTS),
  points: integer("points").notNull().default(0),
  // Streak fields
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: date("last_activity_date"),
  // NEW: CEFR adaptive level
  cefrLevel: text("cefr_level").default("A1.1"),
  cefrLevelFloat: real("cefr_level_float").default(1.1),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

// ─── User Subscription ────────────────────────────────────────────────────
export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

// ─── User Challenge History ───────────────────────────────────────────────
export const user_challenge_history = pgTable("user_challenge_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userProgress.userId, { onDelete: "cascade" }),
  challengeId: integer("challenge_id")
    .notNull()
    .references(() => challenges.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at").defaultNow(),
  correct: boolean("correct").notNull(),
  xpEarned: integer("xp_earned").default(0),
  // NEW: for adaptive level calculation
  timeSpentSeconds: integer("time_spent_seconds"),
});

export const userChallengeHistoryRelations = relations(
  user_challenge_history,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [user_challenge_history.challengeId],
      references: [challenges.id],
    }),
    user: one(userProgress, {
      fields: [user_challenge_history.userId],
      references: [userProgress.userId],
    }),
  })
);