import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

// Initialize SQLite database
const sqlite = new Database("physiomaint.db");
export const db = drizzle(sqlite, { schema });
