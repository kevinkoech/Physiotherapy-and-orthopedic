import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./index";

// Run migrations
migrate(db, { migrationsFolder: "./src/db/migrations" });
console.log("Migrations completed successfully");
