ALTER TABLE `hobbies` MODIFY COLUMN `icon` varchar(40) NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `about_headline` varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `portrait_path` varchar(255);--> statement-breakpoint
ALTER TABLE `travel_destinations` ADD `code` varchar(8) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `travel_destinations` ADD `description` text;