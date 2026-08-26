CREATE TABLE `daily_closings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessDate` date NOT NULL,
	`grossSales` decimal(12,2) NOT NULL DEFAULT '0',
	`refunds` decimal(12,2) NOT NULL DEFAULT '0',
	`netSales` decimal(12,2) NOT NULL DEFAULT '0',
	`collections` decimal(12,2) NOT NULL DEFAULT '0',
	`totalOut` decimal(12,2) NOT NULL DEFAULT '0',
	`expectedNet` decimal(12,2) NOT NULL DEFAULT '0',
	`countedCash` decimal(12,2) NOT NULL DEFAULT '0',
	`variance` decimal(12,2) NOT NULL DEFAULT '0',
	`notes` text,
	`closedBy` int NOT NULL,
	`closedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_closings_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_closings_businessDate_unique` UNIQUE(`businessDate`)
);
