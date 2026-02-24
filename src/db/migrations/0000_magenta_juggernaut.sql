CREATE TABLE `reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trainee_id` integer NOT NULL,
	`equipment_name` text NOT NULL,
	`simulation_data` text NOT NULL,
	`score` integer,
	`grade` text,
	`status` text DEFAULT 'submitted' NOT NULL,
	`submitted_at` integer,
	`graded_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`admission_number` text NOT NULL,
	`class_name` text NOT NULL,
	`role` text DEFAULT 'trainee' NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_admission_number_unique` ON `users` (`admission_number`);