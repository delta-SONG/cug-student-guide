ALTER TABLE `content_items` ADD `student_level` text DEFAULT 'both' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_content_status_level` ON `content_items` (`status`,`student_level`);