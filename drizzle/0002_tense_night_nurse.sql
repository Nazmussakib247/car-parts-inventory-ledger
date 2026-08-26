CREATE TABLE `shop_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopName` varchar(180) NOT NULL DEFAULT 'Motive Ledger Auto Operations',
	`address` text,
	`phone` varchar(40),
	`logoUrl` text,
	`vatNumber` varchar(80),
	`defaultTaxRate` decimal(5,2) NOT NULL DEFAULT '0',
	`currency` varchar(10) NOT NULL DEFAULT 'BDT',
	`invoiceLanguage` varchar(20) NOT NULL DEFAULT 'bn',
	`updatedBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shop_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sales` ADD `taxRate` decimal(5,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `sales` ADD `taxAmount` decimal(12,2) DEFAULT '0' NOT NULL;