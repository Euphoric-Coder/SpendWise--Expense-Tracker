import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(), 
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0), 
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: varchar("createdAt").notNull(),
});

export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
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
  createdAt: timestamp("createdAt").defaultNow(),
});

export const Settings = pgTable(
  "settings",
  {
    id: serial("id").primaryKey(),
    createdBy: varchar("createdBy").notNull(),
    showcsvimport: boolean("showcsvimport").notNull().default(true), // True or False
  },
  (settings) => ({
    uniqueCreatedBy: uniqueIndex("unique_settings_created_by").on(
      settings.createdBy
    ),
  })
);

export const Feedback = pgTable(
  "feedback",
  {
    id: serial("id").primaryKey(),
    username: varchar("username").notNull(),
    avatar: varchar("avatar"),
    rating: integer("rating").notNull(),
    comments: varchar("comments"),
    createdBy: varchar("createdBy").notNull(),
  },
  (feedback) => ({
    uniqueCreatedBy: uniqueIndex("unique_created_by").on(feedback.createdBy),
  })
);
