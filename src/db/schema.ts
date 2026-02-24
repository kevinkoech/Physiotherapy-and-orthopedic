import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  admissionNumber: text("admission_number").notNull().unique(),
  className: text("class_name").notNull(),
  role: text("role").notNull().default("trainee"), // trainee or admin
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  traineeId: integer("trainee_id").notNull(),
  equipmentName: text("equipment_name").notNull(),
  simulationData: text("simulation_data").notNull(),
  score: integer("score"),
  grade: text("grade"),
  status: text("status").notNull().default("submitted"), // submitted, graded, archived
  submittedAt: integer("submitted_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  gradedAt: integer("graded_at", { mode: "timestamp" }),
});
