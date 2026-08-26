CREATE TABLE `accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('cash','bank','mobile','card') NOT NULL,
	`balance` decimal(12,2) NOT NULL DEFAULT '0',
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `accounts_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(80) NOT NULL,
	`entity` varchar(80) NOT NULL,
	`entityId` int,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `brands_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`phone` varchar(40),
	`email` varchar(180),
	`address` text,
	`customerType` varchar(40) NOT NULL DEFAULT 'Retail',
	`openingBalance` decimal(12,2) NOT NULL DEFAULT '0',
	`creditLimit` decimal(12,2) NOT NULL DEFAULT '0',
	`vehicleInfo` text,
	`notes` text,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(80) NOT NULL,
	`description` text,
	`amount` decimal(12,2) NOT NULL,
	`accountId` int NOT NULL,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ledger_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partyType` enum('customer','supplier') NOT NULL,
	`partyId` int NOT NULL,
	`referenceType` varchar(30) NOT NULL,
	`referenceId` int,
	`debit` decimal(12,2) NOT NULL DEFAULT '0',
	`credit` decimal(12,2) NOT NULL DEFAULT '0',
	`description` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ledger_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partyType` enum('customer','supplier','expense') NOT NULL,
	`partyId` int,
	`accountId` int NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`method` varchar(30) NOT NULL,
	`reference` varchar(100),
	`notes` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sku` varchar(64) NOT NULL,
	`barcode` varchar(80),
	`name` varchar(180) NOT NULL,
	`partNumber` varchar(120),
	`categoryId` int,
	`brandId` int,
	`vehicleCompatibility` text,
	`purchasePrice` decimal(12,2) NOT NULL DEFAULT '0',
	`sellingPrice` decimal(12,2) NOT NULL DEFAULT '0',
	`wholesalePrice` decimal(12,2) DEFAULT '0',
	`minStock` int NOT NULL DEFAULT 0,
	`stockQty` int NOT NULL DEFAULT 0,
	`rackLocation` varchar(80),
	`unit` varchar(30) NOT NULL DEFAULT 'Piece',
	`warranty` varchar(80),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`),
	CONSTRAINT `products_barcode_unique` UNIQUE(`barcode`)
);
--> statement-breakpoint
CREATE TABLE `purchase_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purchaseId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`unitCost` decimal(12,2) NOT NULL,
	`lineTotal` decimal(12,2) NOT NULL,
	CONSTRAINT `purchase_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`billNo` varchar(40) NOT NULL,
	`supplierId` int NOT NULL,
	`total` decimal(12,2) NOT NULL DEFAULT '0',
	`discount` decimal(12,2) NOT NULL DEFAULT '0',
	`paid` decimal(12,2) NOT NULL DEFAULT '0',
	`paymentMethod` varchar(30),
	`status` enum('received','partial','paid','cancelled') NOT NULL DEFAULT 'received',
	`notes` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchases_billNo_unique` UNIQUE(`billNo`)
);
--> statement-breakpoint
CREATE TABLE `sale_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`saleId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`unitPrice` decimal(12,2) NOT NULL,
	`unitCost` decimal(12,2) NOT NULL DEFAULT '0',
	`lineTotal` decimal(12,2) NOT NULL,
	CONSTRAINT `sale_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceNo` varchar(40) NOT NULL,
	`customerId` int,
	`subtotal` decimal(12,2) NOT NULL DEFAULT '0',
	`discount` decimal(12,2) NOT NULL DEFAULT '0',
	`total` decimal(12,2) NOT NULL DEFAULT '0',
	`paid` decimal(12,2) NOT NULL DEFAULT '0',
	`paymentMethod` varchar(30),
	`status` enum('completed','partial','paid','returned','cancelled') NOT NULL DEFAULT 'completed',
	`notes` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sales_id` PRIMARY KEY(`id`),
	CONSTRAINT `sales_invoiceNo_unique` UNIQUE(`invoiceNo`)
);
--> statement-breakpoint
CREATE TABLE `stock_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`transactionType` varchar(30) NOT NULL,
	`quantity` int NOT NULL,
	`referenceType` varchar(30),
	`referenceId` int,
	`reason` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stock_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`contactPerson` varchar(120),
	`phone` varchar(40),
	`email` varchar(180),
	`address` text,
	`openingBalance` decimal(12,2) NOT NULL DEFAULT '0',
	`paymentTerms` varchar(100),
	`notes` text,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('owner','manager','sales','storekeeper','accountant','admin','user') NOT NULL DEFAULT 'sales';--> statement-breakpoint
CREATE INDEX `ledger_party_idx` ON `ledger_entries` (`partyType`,`partyId`);--> statement-breakpoint
CREATE INDEX `ledger_date_idx` ON `ledger_entries` (`createdAt`);--> statement-breakpoint
CREATE INDEX `product_name_idx` ON `products` (`name`);--> statement-breakpoint
CREATE INDEX `product_stock_idx` ON `products` (`stockQty`);--> statement-breakpoint
CREATE INDEX `purchase_supplier_idx` ON `purchases` (`supplierId`);--> statement-breakpoint
CREATE INDEX `purchase_date_idx` ON `purchases` (`createdAt`);--> statement-breakpoint
CREATE INDEX `sale_customer_idx` ON `sales` (`customerId`);--> statement-breakpoint
CREATE INDEX `sale_date_idx` ON `sales` (`createdAt`);--> statement-breakpoint
CREATE INDEX `stock_product_idx` ON `stock_transactions` (`productId`);--> statement-breakpoint
CREATE INDEX `stock_date_idx` ON `stock_transactions` (`createdAt`);