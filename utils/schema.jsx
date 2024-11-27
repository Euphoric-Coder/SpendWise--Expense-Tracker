import {
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
  startDate: date("startDate"),
  endDate: date("endDate"), // Nullable for indefinite recurring transactions
  lastProcessed: date("lastProcessed"), // Tracks the last processed date
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

// export const Incomes = pgTable("incomes", {
//   id: serial("id").primaryKey(),
//   name: varchar("name").notNull(),
//   amount: varchar("amount").notNull(),
//   icon: varchar("icon"),
//   incomeType: varchar("incomeType"),
//   createdBy: varchar("createdBy").notNull(),
// });

// export const RecurringIncomes = pgTable("recurring_incomes", {
//   id: serial("id").primaryKey(),
//   name: varchar("name").notNull(),
//   amount: numeric("amount").notNull(),
//   frequency: varchar("frequency"), // 'daily', 'weekly', 'monthly', 'yearly'
//   startDate: date("startDate"),
//   endDate: date("endDate"), // Nullable for indefinite recurring transactions
//   lastProcessed: date("lastProcessed"), // Tracks the last processed date
//   incomeId: integer("incomeId").references(() => Incomes.id), // Links to `Incomes`
//   createdBy: varchar("createdBy").notNull(),
//   createdAt: timestamp("createdAt").defaultNow(),
// });

// export const RecurringTransactions = pgTable("recurring_transactions", {
//   id: serial("id").primaryKey(),
//   name: varchar("name").notNull(),
//   amount: numeric("amount").notNull(),
//   transactionType: varchar("transactionType").notNull(), // Only "income" for now
//   frequency: varchar("frequency").notNull(), // 'daily', 'weekly', 'monthly', 'yearly'
//   startDate: date("startDate").notNull(),
//   endDate: date("endDate"), // Nullable for indefinite recurring transactions
//   lastProcessed: date("lastProcessed"), // Tracks the last processed date
//   referenceId: integer("referenceId").references(() => Incomes.id), // Links to `Incomes`
//   createdBy: varchar("createdBy").notNull(),
//   createdAt: timestamp("createdAt").defaultNow(),
// });

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
