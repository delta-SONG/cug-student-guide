CREATE TABLE `content_items` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`college` text,
	`campus` text,
	`audience` text DEFAULT '全体学生' NOT NULL,
	`source_type` text NOT NULL,
	`source_name` text,
	`source_url` text,
	`source_published_at` text,
	`checked_at` text,
	`deadline_at` text,
	`validity` text DEFAULT 'active' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`author_id` text,
	`rejection_reason` text,
	`canonical_url` text,
	`content_hash` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_content_status_category` ON `content_items` (`status`,`category`);--> statement-breakpoint
CREATE INDEX `idx_content_deadline` ON `content_items` (`deadline_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_canonical_url` ON `content_items` (`canonical_url`);--> statement-breakpoint
CREATE TABLE `course_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text,
	`course_name` text NOT NULL,
	`teacher_id` text,
	`teacher_name` text,
	`term` text NOT NULL,
	`clarity` integer NOT NULL,
	`workload` integer NOT NULL,
	`assessment_pressure` integer NOT NULL,
	`gain` integer NOT NULL,
	`short_review` text DEFAULT '' NOT NULL,
	`author_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_reviews_author_course_term` ON `course_reviews` (`author_id`,`course_name`,`term`);--> statement-breakpoint
CREATE INDEX `idx_reviews_status_course` ON `course_reviews` (`status`,`course_name`);--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text,
	`name` text NOT NULL,
	`college` text,
	`description` text
);
--> statement-breakpoint
CREATE INDEX `idx_courses_name` ON `courses` (`name`);--> statement-breakpoint
CREATE TABLE `ingestion_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`finished_at` text,
	`status` text NOT NULL,
	`item_count` integer DEFAULT 0 NOT NULL,
	`error` text
);
--> statement-breakpoint
CREATE INDEX `idx_ingestion_started_at` ON `ingestion_runs` (`started_at`);--> statement-breakpoint
CREATE TABLE `moderation_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`action` text NOT NULL,
	`moderator_id` text NOT NULL,
	`note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_moderation_target` ON `moderation_logs` (`target_type`,`target_id`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`reason` text NOT NULL,
	`reporter_id` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_reports_status` ON `reports` (`status`);--> statement-breakpoint
CREATE TABLE `sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`base_url` text NOT NULL,
	`kind` text NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`last_checked_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sources_base_url` ON `sources` (`base_url`);--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`college` text
);
--> statement-breakpoint
CREATE INDEX `idx_teachers_name` ON `teachers` (`name`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`role` text DEFAULT 'student' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_email` ON `users` (`email`);