// utils/budget.js
import { db } from "@/utils/dbConfig";
import { asc, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes, Transactions, Users } from "@/utils/schema";
import {
  parse,
  format,
  isValid,
  startOfMonth,
  getDaysInMonth,
  differenceInDays,
} from "date-fns";

export const getUsers = async () => {
  const users = await db
    .select()
    .from(Users)
    .groupBy(Users.id)
    .orderBy(asc(Users.email));
  return users;
};

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

export const getTransactionInfo = async (createdBy) => {
  const transactions = await db
    .select()
    .from(Transactions)
    .where(eq(Transactions.createdBy, createdBy))
    .orderBy(desc(Transactions.createdAt));

  return transactions;
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

export const budgetTrends = async (createdBy) => {
  // Fetch all budget data from DB
  const budgets = await db.select().from(Budgets).where(eq(Budgets.createdBy, createdBy));

  // Function to parse `createdAt` correctly
  const parseDate = (dateString) => {
    let parsedDate;

    // Try parsing as `YYYY-MM-DD HH:mm:ss`
    parsedDate = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
    if (isValid(parsedDate)) return parsedDate;

    // Try parsing as `DD/MM/YY HH:mm`
    parsedDate = parse(dateString, "dd/MM/yy HH:mm", new Date());
    if (isValid(parsedDate)) return parsedDate;

    return null; // Invalid date
  };

  // Process budgets
  const monthlyTrendsMap = new Map();

  for (const budget of budgets) {
    const createdAt = parseDate(budget.createdAt);
    if (!createdAt) continue; // Skip invalid dates

    // Get start of the creation month
    const monthStart = format(startOfMonth(createdAt), "yyyy-MM-dd");

    // Convert amount to a number
    const amount = parseFloat(budget.amount) || 0;

    if (budget.frequency === "weekly") {
      // Calculate how many full weeks the budget applies to in the creation month
      const totalDaysInMonth = getDaysInMonth(createdAt);
      const remainingDays = totalDaysInMonth - createdAt.getDate() + 1;
      const applicableWeeks = Math.ceil(remainingDays / 7);

      let recurringMonth = createdAt;
      while (recurringMonth <= new Date()) {
        const recurringMonthStart = format(
          startOfMonth(recurringMonth),
          "yyyy-MM-dd"
        );

        // For the first month (createdAt month), only count from its creation date onward
        if (recurringMonthStart === monthStart) {
          monthlyTrendsMap.set(
            recurringMonthStart,
            (monthlyTrendsMap.get(recurringMonthStart) || 0) +
              amount * applicableWeeks
          );
        } else {
          // For future months, add full 4 weeks of budget
          monthlyTrendsMap.set(
            recurringMonthStart,
            (monthlyTrendsMap.get(recurringMonthStart) || 0) + amount * 4
          );
        }

        // Move to the next month
        recurringMonth.setMonth(recurringMonth.getMonth() + 1);
      }
    } else if (budget.frequency === "monthly") {
      // Monthly budgets → Start from `createdAt` month and continue monthly
      let recurringMonth = createdAt;
      while (recurringMonth <= new Date()) {
        const recurringMonthStart = format(
          startOfMonth(recurringMonth),
          "yyyy-MM-dd"
        );

        monthlyTrendsMap.set(
          recurringMonthStart,
          (monthlyTrendsMap.get(recurringMonthStart) || 0) + amount
        );

        recurringMonth.setMonth(recurringMonth.getMonth() + 1);
      }
    } else if (budget.frequency === "daily") {
      // Daily budgets → Calculate how many remaining days in the first month
      const totalDaysInMonth = getDaysInMonth(createdAt);
      const remainingDays = differenceInDays(
        new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 1),
        createdAt
      );

      let recurringMonth = createdAt;
      while (recurringMonth <= new Date()) {
        const recurringMonthStart = format(
          startOfMonth(recurringMonth),
          "yyyy-MM-dd"
        );

        // For the first month, only count from creation date
        if (recurringMonthStart === monthStart) {
          monthlyTrendsMap.set(
            recurringMonthStart,
            (monthlyTrendsMap.get(recurringMonthStart) || 0) +
              amount * remainingDays
          );
        } else {
          // For full months, add the amount for all days
          monthlyTrendsMap.set(
            recurringMonthStart,
            (monthlyTrendsMap.get(recurringMonthStart) || 0) +
              amount * getDaysInMonth(recurringMonth)
          );
        }

        recurringMonth.setMonth(recurringMonth.getMonth() + 1);
      }
    } else if (budget.frequency === "yearly") {
      // Yearly budgets → Start from `createdAt` year and repeat annually
      let recurringYear = createdAt;
      while (recurringYear <= new Date()) {
        const recurringYearStart = format(
          startOfMonth(recurringYear),
          "yyyy-MM-dd"
        );

        monthlyTrendsMap.set(
          recurringYearStart,
          (monthlyTrendsMap.get(recurringYearStart) || 0) + amount / 12 // Spread across 12 months
        );

        recurringYear.setFullYear(recurringYear.getFullYear() + 1);
      }
    } else {
      // One-time budgets → Only counted in the `createdAt` month
      monthlyTrendsMap.set(
        monthStart,
        (monthlyTrendsMap.get(monthStart) || 0) + amount
      );
    }
  }

  // Convert to sorted array
  const monthlyTrends = Array.from(monthlyTrendsMap)
    .sort(([a], [b]) => new Date(a) - new Date(b)) // Sort by month
    .map(([month, totalBudget]) => ({
      month,
      totalBudget: Math.round(totalBudget), // Convert to integer
    }));

  return { monthlyTrends };
};

export const dashboardData = async (createdBy) => {
  const budgetList = await getBudgetInfo(createdBy);
  const incomeList = await getIncomeInfo(createdBy);
  const expenseList = await getExpensesInfo(createdBy);
  const budgetTrends = await budgetTrends(createdBy);

  const budgetTrendPercentage = Math.round(
    (budgetTrends.monthlyTrends[budgetTrends.monthlyTrends.length - 1].totalBudget -
      budgetTrends.monthlyTrends[budgetTrends.monthlyTrends.length - 2].totalBudget) /
      budgetTrends.monthlyTrends[budgetTrends.monthlyTrends.length - 2].totalBudget *
      100
  );

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
    totalIncome += Number(element.amount); // Parse income as a number
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
    budgetTrendPercentage: budgetTrendPercentage,
  };
};

export const getMonthlyStats = async (createdBy) => {
  const budgetList = await getBudgetInfo(createdBy);
  const incomeList = await getIncomeInfo(createdBy);
  const expenseList = await getExpensesInfo(createdBy);

  // Get last month's date details
  const today = new Date();
  const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1; // Handle January
  const lastMonthYear =
    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

  // Convert month number to full month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedMonth = `${monthNames[lastMonth]} ${lastMonthYear}`;

  // Filter last month's budgets
  const monthlyBudgetList = budgetList.filter((budget) => {
    const budgetDate = new Date(budget.createdAt.split(" ")[0]);
    return (
      budgetDate.getMonth() === lastMonth &&
      budgetDate.getFullYear() === lastMonthYear
    );
  });

  // Filter last month's incomes
  const monthlyIncomeList = incomeList.filter((income) => {
    const incomeDate = new Date(income.createdAt.split(" ")[0]);
    return (
      incomeDate.getMonth() === lastMonth &&
      incomeDate.getFullYear() === lastMonthYear
    );
  });

  // Filter last month's expenses and attach the related budget name
  const monthlyExpenseList = expenseList
    .filter((expense) => {
      const expenseDate = new Date(expense.createdAt.split(" ")[0]);
      return (
        expenseDate.getMonth() === lastMonth &&
        expenseDate.getFullYear() === lastMonthYear
      );
    })
    .map((expense) => {
      const budget = budgetList.find(
        (budget) => budget.id === expense.budgetId
      );
      return {
        amount: expense.amount,
        category: expense.category ? expense.category : "NA",
        budgetName: budget ? budget.name : "Uncategorized",
        description: expense.description ? expense.description : "NA",
        date: expense.createdAt,
      };
    });

  console.log("Last Month Budgets:", monthlyBudgetList);
  console.log("Last Month Incomes:", monthlyIncomeList);
  console.log("Last Month Expenses:", monthlyExpenseList);

  let totalBudget = 0;
  let totalSpend = 0;
  let totalIncome = 0;
  let largestBudget = 0;
  let highestExpense = 0;

  // Calculate last month's stats
  monthlyBudgetList.forEach((budget) => {
    const budgetAmount = Number(budget.amount);
    totalBudget += budgetAmount;
    if (budgetAmount > largestBudget) largestBudget = budgetAmount;
  });

  monthlyIncomeList.forEach((income) => {
    totalIncome += Number(income.amount);
  });

  monthlyExpenseList.forEach((expense) => {
    const expenseAmount = Number(expense.amount);
    totalSpend += expenseAmount;
    if (expenseAmount > highestExpense) highestExpense = expenseAmount;
  });

  // Additional financial metrics for last month
  const unusedBudget = Math.max(totalBudget - totalSpend, 0);
  const totalDebt = Math.max(totalSpend - totalIncome, 0);
  const debtToIncomeRatio =
    totalIncome > 0 ? ((totalDebt / totalIncome) * 100).toFixed(1) : 0;
  const savings = Math.max(totalIncome - totalSpend, 0);
  const incomeSavedPercentage =
    totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  return {
    month: formattedMonth, // Returns "February 2025" instead of "2-2025"
    totalBudgets: monthlyBudgetList.length,
    totalBudgetAmount: totalBudget,
    totalIncomes: monthlyIncomeList.length,
    totalIncomeAmount: totalIncome,
    totalExpenses: monthlyExpenseList.length,
    totalExpenseAmount: totalSpend,
    largestBudget,
    highestExpense,
    unusedBudget,
    totalDebt,
    debtToIncomeRatio,
    savings,
    incomeSavedPercentage,
    expensesList: monthlyExpenseList, // Expense list with formatted details
  };
};



