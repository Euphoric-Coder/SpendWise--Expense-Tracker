// utils/budget.js
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";

export const getBudgetInfo = async (createdBy) => {
  const budgets = await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql`coalesce(sum(${Expenses.amount}), 0)`.mapWith(Number),
      totalItem: sql`coalesce(count(${Expenses.id}), 0)`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, createdBy))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.createdAt));

  return budgets;
};
