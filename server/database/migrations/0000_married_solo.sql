CREATE TABLE `diary_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`status` enum('draft','sealed','revealed') NOT NULL DEFAULT 'draft',
	`reveal_at` datetime,
	`notify_email` varchar(255),
	`sent_at` timestamp,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `diary_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `diary_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`diary_entry_id` int NOT NULL,
	`path` varchar(255) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `diary_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hobbies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`icon` varchar(16) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `hobbies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` int NOT NULL,
	`hero_title` varchar(255) NOT NULL,
	`hero_subtitle` varchar(255) NOT NULL,
	`about_text` text NOT NULL,
	`contact_email` varchar(255) NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `travel_destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`flag_emoji` varchar(16) NOT NULL DEFAULT '',
	`label` varchar(255) NOT NULL,
	`photo_path` varchar(255),
	`is_dream` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `travel_destinations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
