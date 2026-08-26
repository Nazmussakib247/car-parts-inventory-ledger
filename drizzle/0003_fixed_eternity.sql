ALTER TABLE `sales` ADD `taxMode` enum('exclusive','inclusive') DEFAULT 'exclusive' NOT NULL;--> statement-breakpoint
ALTER TABLE `shop_settings` ADD `copyrightFooter` varchar(180) DEFAULT 'All rights Reserve by Nazmus Sakib' NOT NULL;--> statement-breakpoint
ALTER TABLE `shop_settings` ADD `taxMode` enum('exclusive','inclusive') DEFAULT 'exclusive' NOT NULL;