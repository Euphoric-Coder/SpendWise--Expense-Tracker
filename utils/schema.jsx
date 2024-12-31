import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const { v4: uuidv4 } = require("uuid");

export const Users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
});

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  icon: varchar("icon"),
  budgetType: varchar("budgetType"),
  frequency: varchar("frequency"), // 'daily', 'weekly', 'monthly', 'yearly'
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"), //.notNull()
});

export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: integer("budgetId").references(() => Budgets.id),
  description: varchar("description"), //.notNull(),
  createdAt: varchar("createdAt").notNull(),
});

export const Incomes = pgTable("incomes", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  incomeType: varchar("incomeType"),
  frequency: varchar("frequency"), // 'daily', 'weekly', 'monthly', 'yearly'
  status: varchar("status"), // 'upcoming', 'current'
  startDate: date("startDate"),
  endDate: date("endDate"), // Nullable for indefinite recurring transactions
  lastProcessed: date("lastProcessed"), // Tracks the last processed date
  lastUpdated: date("lastUpdated"),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
});

export const Transactions = pgTable("transactions", {
  id: varchar("id", { length: 191 }).primaryKey(), 
  category: varchar("category").notNull(), // 'expense' or 'income'
  referenceId: varchar("referenceId"),//.notNull(),
  name: varchar("name").notNull(), // Transaction name
  amount: numeric("amount").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
});

export const Settings = pgTable("settings", {
  id: varchar("id", { length: 191 }).primaryKey(),
  createdBy: varchar("createdBy").notNull().unique(),
  showcsvimport: boolean("showcsvimport").notNull().default(true), // True or False
  showrecieptimport: boolean("showrecieptimport").notNull().default(true),
});

export const Notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdFor: varchar("createdFor").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  message: varchar("message").notNull(),
  title: varchar("title").default("Notification Title"),
  read: boolean("read").notNull().default(false),
});

export const Feedback = pgTable("feedback", {
  id: varchar("id", { length: 191 }).primaryKey().default(uuidv4()),
  username: varchar("username").notNull(),
  avatar: varchar("avatar"),
  rating: numeric("rating").notNull(),
  comments: varchar("comments"),
  createdBy: varchar("createdBy").notNull(),
});