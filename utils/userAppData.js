// utils/budget.js
import { db } from "@/utils/dbConfig";
import { asc, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/utils/schema";

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

export const getIncomeInfo = async (createdBy) => {
  const incomes = await db
    .select()
    .from(Incomes)
    .where(eq(Incomes.createdBy, createdBy))
    .groupBy(Incomes.id)
    .orderBy(desc(Incomes.createdAt));

  return incomes;
};

export const getExpensesInfo = async (createdBy) => {
  const expenses = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          description: Expenses.description,
          createdAt: Expenses.createdAt,
          budgetId: Expenses.budgetId,
          budgetName: Budgets.name,
        })
        .from(Expenses)
        .innerJoin(Budgets, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, createdBy))
        .orderBy(asc(Expenses.createdAt));
        
  // await db
  //   .select({
  //     id: Expenses.id,
  //     name: Expenses.name,
  //     amount: Expenses.amount,
  //     createdAt: Expenses.createdAt,
  //   })
  //   .from(Budgets)
  //   .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
  //   .where(eq(Budgets.createdBy, createdBy))
  //   .orderBy(desc(Expenses.id));

  return expenses;
};

export const dashboardData = async (createdBy) => {
  const budgetList = await getBudgetInfo(createdBy);
  const incomeList = await getIncomeInfo(createdBy);
  const expenseList = await getExpensesInfo(createdBy);

  let totalBudget = 0;
  let totalSpend = 0;
  let totalIncome = 0;
  let largestBudget = 0;
  let highestExpense = 0;

  // Calculate total budgets and spending
  budgetList.forEach((element) => {
    const budgetAmount = Number(element.amount); // Ensure amount is parsed as a number
    const budgetSpend = Number(element.totalSpend); // Parse spend as well

    totalBudget += budgetAmount;
    totalSpend += budgetSpend;

    // Track largest budget
    if (budgetAmount > largestBudget) {
      largestBudget = budgetAmount;
    }

    // Track highest expense
    if (budgetSpend > highestExpense) {
      highestExpense = budgetSpend;
    }
  });

  // Calculate total incomes
  incomeList.forEach((element) => {
    totalIncome += Number(element.totalAmount); // Parse income as a number
  });

  // Calculate additional metrics
  const unusedBudget = Math.max(totalBudget - totalSpend, 0);
  const totalDebt = Math.max(totalSpend - totalIncome, 0);
  const debtToIncomeRatio =
    totalIncome > 0 ? ((totalDebt / totalIncome) * 100).toFixed(1) : 0;
  const savings = Math.max(totalIncome - totalSpend, 0);
  const incomeSavedPercentage =
    totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  return {
    totalBudget: totalBudget,
    totalSpend: totalSpend,
    totalIncome: totalIncome,
    unusedBudget: unusedBudget,
    totalDebt: totalDebt,
    debtToIncomeRatio: debtToIncomeRatio,
    largestBudget: largestBudget,
    highestExpense: highestExpense,
    savings: savings,
    incomeSavedPercentage: incomeSavedPercentage,
  };
};
