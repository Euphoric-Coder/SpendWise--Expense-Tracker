import { db } from "./dbConfig";
import { and, asc, desc, eq, getTableColumns, sql } from "drizzle-orm";
import {
  Budgets,
  Expenses,
  Incomes,
  Notifications,
  Transactions,
} from "./schema";
import { getISTDate } from "./utilities";

export const incomeExpiration = async () => {
  const today = getISTDate();

  try {
    // Fetch all non-recurring incomes that have expired
    const expiredIncomes = await db
      .select()
      .from(Incomes)
      .where(
        and(
          sql`AGE(${Incomes.endDate}, ${today}) <= interval '0 days'`,
          eq(Incomes.incomeType, "non-recurring")
        )
      );

    for (const income of expiredIncomes) {
      const expirationDateTime = `${income.endDate} 23:59:00`;

      // Ensure deletion only happens if the current time is past 23:59:00 of the end date
      // if (getISTDateTime() >= expirationDateTime) {
      // Delete income from the database
      await db.delete(Incomes).where(eq(Incomes.id, income.id)).returning();
      await db
        .update(Transactions)
        .set({
          lastUpdated: getISTDate(),
          status: "expired",
          deletionRemark: `Income ${income.name} has expired on ${income.endDate}`,
        })
        .where(eq(Transactions.referenceId, income.id))
        .returning();
      // }
    }
  } catch {
    console.error("Error processing deletion of expired incomes!");
  }
};

export const budgetPercentage = async () => {
  const budgets = await db
    .select({
      id: Budgets.id,
      totalSpend: sql`coalesce(sum(${Expenses.amount}), 0)`.mapWith(Number),
      totalItem: sql`coalesce(count(${Expenses.id}), 0)`.mapWith(Number),
      amount: Budgets.amount,
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .groupBy(Budgets.id, Budgets.amount)
    .orderBy(asc(Budgets.createdAt));

  const percentages = budgets.map((budget) => ({
    id: budget.id,
    percentage:
      budget.totalItem > 0
        ? ((budget.totalSpend / budget.amount) * 100).toFixed(2)
        : "0",
  }));

  for (const budget of percentages) {
    const updateFields = {
      ninetyPercent: budget.percentage >= 90, // Ensures true if >=90, false if below 90
    };

    // Only update `mailed` to `false` if percentage < 90
    if (budget.percentage < 90) {
      updateFields.mailed = false;
    }

    await db
      .update(Budgets)
      .set(updateFields)
      .where(eq(Budgets.id, budget.id))
      .returning();
  }
};

export const notifyBudgetLimit = async () => {
  const budgets = await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql`coalesce(sum(${Expenses.amount}), 0)`.mapWith(Number),
      totalItem: sql`coalesce(count(${Expenses.id}), 0)`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.createdAt));

  console.log(budgets);

  for (const budget of budgets) {
    if (
      budget.ninetyPercent &&
      budget.mailed === false &&
      budget.notified === false
    ) {
      {
        try {
          await db.insert(Notifications).values({
            createdFor: budget.createdBy,
            type: "alert",
            title: "Nearing Budget Limit!",
            message: `Budget "${budget.name}" has reached 90% or above of its limit!`,
          });
        } catch (error) {
          console.error("Error inserting notification:", error);
        } finally {
          await db
            .update(Budgets)
            .set({ notified: true })
            .where(eq(Budgets.id, budget.id))
            .returning();
        }
      }
    }
  }
};
