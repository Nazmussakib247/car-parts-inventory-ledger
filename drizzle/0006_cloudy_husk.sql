ALTER TABLE `reminder_settings` MODIFY COLUMN `messageTemplate` text NOT NULL;--> statement-breakpoint
ALTER TABLE `due_reminders` ADD `optIn` boolean DEFAULT false NOT NULL;