import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const machines = pgTable("machines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  status: text("status").notNull().default("idle"), // working, idle, emergency
  speed: integer("speed").notNull().default(0), // RPM or units per minute
  filesCompleted: integer("files_completed").notNull().default(0),
  lastUpdate: timestamp("last_update").default(sql`now()`),
});

export const productionPrograms = pgTable("production_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  machineId: varchar("machine_id").references(() => machines.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  workTimeSeconds: integer("work_time_seconds").notNull().default(0),
  idleTimeSeconds: integer("idle_time_seconds").notNull().default(0),
  emergencyTimeSeconds: integer("emergency_time_seconds").notNull().default(0),
  status: text("status").notNull().default("running"), // running, zakończono_pomyślnie, emergency
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMachineSchema = createInsertSchema(machines).omit({
  id: true,
  lastUpdate: true,
});

export const insertProductionProgramSchema = createInsertSchema(productionPrograms).omit({
  id: true,
  createdAt: true,
});

export const updateProductionProgramSchema = insertProductionProgramSchema.partial();
export const updateMachineSchema = insertMachineSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Machine = typeof machines.$inferSelect;
export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type UpdateMachine = z.infer<typeof updateMachineSchema>;
export type ProductionProgram = typeof productionPrograms.$inferSelect;
export type InsertProductionProgram = z.infer<typeof insertProductionProgramSchema>;
export type UpdateProductionProgram = z.infer<typeof updateProductionProgramSchema>;
