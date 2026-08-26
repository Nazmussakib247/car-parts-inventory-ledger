CREATE TABLE `due_reminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`channel` enum('whatsapp','sms','manual') NOT NULL,
	`phone` varchar(40),
	`amount` decimal(12,2) NOT NULL,
	`message` text NOT NULL,
	`status` enum('queued','sent','failed','manual') NOT NULL DEFAULT 'queued',
	`providerResponse` text,
	`sentAt` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `due_reminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reminder_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channel` enum('whatsapp','sms') NOT NULL,
	`providerName` varchar(80),
	`apiBaseUrl` text,
	`senderId` varchar(100),
	`messageTemplate` text NOT NULL DEFAULT ('প্রিয় {{customerName}}, আপনার {{amount}} টাকা বাকি আছে। অনুগ্রহ করে Motive Ledger-এর সাথে যোগাযোগ করুন।'),
	`enabled` enum('yes','no') NOT NULL DEFAULT 'no',
	`updatedBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reminder_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `reminder_customer_idx` ON `due_reminders` (`customerId`);--> statement-breakpoint
CREATE INDEX `reminder_status_idx` ON `due_reminders` (`status`);