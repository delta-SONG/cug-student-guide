import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role", { enum: ["student", "admin"] }).notNull().default("student"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_users_email").on(table.email)]);

export const sources = sqliteTable("sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  baseUrl: text("base_url").notNull(),
  kind: text("kind", { enum: ["official", "campus_org"] }).notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  lastCheckedAt: text("last_checked_at"),
}, (table) => [uniqueIndex("idx_sources_base_url").on(table.baseUrl)]);

export const contentItems = sqliteTable("content_items", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull().default(""),
  college: text("college"),
  campus: text("campus"),
  audience: text("audience").notNull().default("全体学生"),
  sourceType: text("source_type", { enum: ["official", "campus_org", "student"] }).notNull(),
  sourceName: text("source_name"),
  sourceUrl: text("source_url"),
  sourcePublishedAt: text("source_published_at"),
  checkedAt: text("checked_at"),
  deadlineAt: text("deadline_at"),
  validity: text("validity", { enum: ["active", "expired", "possibly_invalid"] }).notNull().default("active"),
  status: text("status", { enum: ["draft", "pending", "published", "rejected", "archived"] }).notNull().default("pending"),
  authorId: text("author_id").references(() => users.id),
  rejectionReason: text("rejection_reason"),
  canonicalUrl: text("canonical_url"),
  contentHash: text("content_hash"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_content_status_category").on(table.status, table.category),
  index("idx_content_deadline").on(table.deadlineAt),
  uniqueIndex("idx_content_canonical_url").on(table.canonicalUrl),
]);

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  code: text("code"),
  name: text("name").notNull(),
  college: text("college"),
  description: text("description"),
}, (table) => [index("idx_courses_name").on(table.name)]);

export const teachers = sqliteTable("teachers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  college: text("college"),
}, (table) => [index("idx_teachers_name").on(table.name)]);

export const courseReviews = sqliteTable("course_reviews", {
  id: text("id").primaryKey(),
  courseId: text("course_id").references(() => courses.id),
  courseName: text("course_name").notNull(),
  teacherId: text("teacher_id").references(() => teachers.id),
  teacherName: text("teacher_name"),
  term: text("term").notNull(),
  clarity: integer("clarity").notNull(),
  workload: integer("workload").notNull(),
  assessmentPressure: integer("assessment_pressure").notNull(),
  gain: integer("gain").notNull(),
  shortReview: text("short_review").notNull().default(""),
  authorId: text("author_id").notNull().references(() => users.id),
  status: text("status", { enum: ["pending", "published", "rejected"] }).notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_reviews_author_course_term").on(table.authorId, table.courseName, table.term),
  index("idx_reviews_status_course").on(table.status, table.courseName),
]);

export const reports = sqliteTable("reports", {
  id: text("id").primaryKey(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  reason: text("reason").notNull(),
  reporterId: text("reporter_id").notNull().references(() => users.id),
  status: text("status").notNull().default("open"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_reports_status").on(table.status)]);

export const moderationLogs = sqliteTable("moderation_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  action: text("action").notNull(),
  moderatorId: text("moderator_id").notNull(),
  note: text("note"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_moderation_target").on(table.targetType, table.targetId)]);

export const ingestionRuns = sqliteTable("ingestion_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  finishedAt: text("finished_at"),
  status: text("status").notNull(),
  itemCount: integer("item_count").notNull().default(0),
  error: text("error"),
}, (table) => [index("idx_ingestion_started_at").on(table.startedAt)]);
