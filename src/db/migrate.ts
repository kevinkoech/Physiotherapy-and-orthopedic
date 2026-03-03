import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./index";

// Run migrations
migrate(db, { migrationsFolder: "./src/db/migrations" });
console.log("Migrations completed successfully");
