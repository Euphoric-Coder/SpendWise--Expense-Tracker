import {
  boolean,
  date,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
});

export const PrimaryIncome = pgTable("primaryIncome", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  basicPay: numeric("basicPay").notNull(),
  grossIncome: numeric("grossIncome").notNull(),
  netIncome: numeric("netIncome").notNull(),
  da: numeric("da").notNull(), // Dearness Allowance
  hra: numeric("hra").notNull(), // House Rent Allowance
  otherAllowances: numeric("otherAllowances").notNull(),
  taxDeductions: numeric("taxDeductions").notNull(),
  isNewRegime: boolean("isNewRegime").notNull().default(false),
  monthlyPay: numeric("monthlyPay").notNull(),
  lastUpdated: varchar("lastUpdated"),
  createdBy: varchar("createdBy").notNull().unique(), // Ensures only one entry per user
});

export const Budgets = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  ninetyPercent: boolean("ninetyPercent").default(false),
  mailed: boolean("mailed").default(false),
  notified: boolean("notified").default(false),
  icon: varchar("icon"),
  category: varchar("category").notNull().default("housing"), // Category of either expenses or incomes
  subCategory: varchar("subCategory"),
  budgetType: varchar("budgetType"), // 'recurring' or 'non-recurring'
  frequency: varchar("frequency"), // 'daily', 'weekly', 'monthly', 'yearly'
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"), //.notNull()
});

export const BudgetsHistory = pgTable("budgetHistory", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  category: varchar("category").notNull().default("travel"), // Category of either expenses or incomes
  subCategory: varchar("subCategory"),
  budgetType: varchar("budgetType"),
  frequency: varchar("frequency"), // 'daily', 'weekly', 'monthly', 'yearly'
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"), //.notNull()
});

export const Expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: uuid("budgetId").references(() => Budgets.id),
  description: varchar("description"), //.notNull(),
  createdAt: varchar("createdAt").notNull(),
});

export const SaveForLaterExpenses = pgTable("saveForLaterExpenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  description: varchar("description"),
  createdAt: varchar("createdAt").notNull(),
});

export const Incomes = pgTable("incomes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  incomeType: varchar("incomeType"), // 'recurring' or 'non-recurring'
  frequency: varchar("frequency"), // 'daily', 'weekly', 'monthly', 'yearly'
  category: varchar("category").notNull().default("salary"), // Category of either expenses or incomes
  status: varchar("status"), // 'upcoming', 'current'
  startDate: date("startDate"),
  endDate: date("endDate"), // Nullable for indefinite recurring transactions
  lastProcessed: date("lastProcessed"), // Tracks the last processed date
  lastUpdated: date("lastUpdated"),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
});

export const Transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type").notNull(), // 'expense' or 'income'
  category: varchar("category").notNull(), // Category of either expenses or incomes
  subCategory: varchar("subCategory"),
  description: varchar("description"),
  isRecurring: boolean("isRecurring").notNull().default(false),
  frequency: varchar("frequency"), // 'daily', 'weekly', 'monthly', 'yearly'
  nextRecurringDate: varchar("nextRecurringDate"),
  lastProcessed: varchar("lastProcessed"),
  lastUpdated: varchar("lastUpdated"),
  status: varchar("status"), // 'active', 'deleted', 'expired', 'upcoming'
  deletionRemark: varchar("deletionRemark"),
  deletedAt: varchar("deletedAt"),
  referenceId: varchar("referenceId"), //.notNull(),
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
  primaryIncomeAddDate: varchar("primaryIncomeAddDate").default("first"),
});

export const Notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdFor: varchar("createdFor").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  type: varchar("type").notNull().default("regular"),
  message: varchar("message").notNull(),
  title: varchar("title").default("Notification Title"),
  read: boolean("read").notNull().default(false),
});

export const Feedback = pgTable("feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username").notNull(),
  avatar: varchar("avatar"),
  rating: numeric("rating").notNull(),
  comments: varchar("comments"),
  createdBy: varchar("createdBy").notNull(),
});
