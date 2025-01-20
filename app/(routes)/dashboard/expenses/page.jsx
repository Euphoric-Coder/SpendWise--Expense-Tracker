"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { formatCurrencyDashboard } from "@/utils/utilities";
import ExpenseDialog from "@/components/Expenses/ExpenseDialog";
import { Skeleton } from "@/components/ui/skeleton";
import ExpenseCard from "@/components/Expenses/ExpenseCard";
import { Button } from "@/components/ui/button";
import CreateBudget from "@/components/Budgets/CreateBudget";

const ExpenseDashboard = () => {
  const [budgetList, setBudgetList] = useState([]);
  const [expensesByBudget, setExpensesByBudget] = useState({});
  const [selectedBudget, setSelectedBudget] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) fetchBudgetsAndExpenses();
  }, [user]);

  const fetchBudgetsAndExpenses = async () => {
    const budgets = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    const expenses = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetId: Expenses.budgetId,
      })
      .from(Expenses)
      .innerJoin(Budgets, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id));

    const groupedExpenses = expenses.reduce((acc, expense) => {
      acc[expense.budgetId] = acc[expense.budgetId] || [];
      acc[expense.budgetId].push(expense);
      return acc;
    }, {});

    setBudgetList(budgets);
    setExpensesByBudget(groupedExpenses);
  };

  const calculateStats = () => {
    const totalBudgets = budgetList.reduce(
      (acc, budget) => acc + parseFloat(budget.amount),
      0
    );
    const totalExpenses = budgetList.reduce(
      (acc, budget) => acc + parseFloat(budget.totalSpend || 0),
      0
    );
    return {
      totalBudgets,
      totalExpenses,
      remaining: totalBudgets - totalExpenses,
    };
  };

  const refreshData = () => {
    fetchBudgetsAndExpenses();
  };

  const { totalBudgets, totalExpenses, remaining } = calculateStats();

  return (
    <div className="p-10 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-950 dark:to-gray-900 rounded-3xl shadow-2xl relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-30 blur-[80px]"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-12">
          Expense Dashboard
        </h1>
        <Button onClick={refreshData}>Refresh</Button>
      </div>
      <CreateBudget refreshData={() => refreshData()} />

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="relative bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 shadow-xl rounded-3xl p-8 text-center hover:scale-105 transition-transform">
          <h2 className="mb-2 text-2xl font-bold text-gray-100 dark:text-gray-300">
            Total Budgets
          </h2>
          <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            {formatCurrencyDashboard(totalBudgets)}
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-indigo-200 via-purple-300 to-blue-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 shadow-xl rounded-3xl p-8 text-center hover:scale-105 transition-transform">
          <h2 className="mb-2 text-2xl font-bold text-gray-100 dark:text-gray-300">
            Total Expenses
          </h2>
          <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">
            {formatCurrencyDashboard(totalExpenses)}
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-purple-200 via-blue-300 to-indigo-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 shadow-xl rounded-3xl p-8 text-center hover:scale-105 transition-transform">
          <h2 className="mb-2 text-2xl font-bold text-gray-100 dark:text-gray-300">
            Remaining Balance
          </h2>
          <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400">
            {formatCurrencyDashboard(remaining)}
          </p>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {budgetList.length === 0
          ? [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index}>
                <Skeleton className="h-[145px] rounded-3xl bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 shadow-lg" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 bg-slate-300 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-[75%] bg-slate-300 dark:bg-gray-700" />
                </div>
              </div>
            ))
          : budgetList.map((budget) => (
              <div className="p-2" key={budget.id}>
                <ExpenseCard
                  budget={budget}
                  expenses={expensesByBudget[budget.id] || []}
                  onOpen={() => setSelectedBudget(budget)} // Open dialog for selected budget
                />
              </div>
            ))}
      </div>

      {/* Dialog */}
      {selectedBudget && (
        <ExpenseDialog
          budget={selectedBudget}
          expenses={expensesByBudget[selectedBudget.id] || []}
          onClose={() => setSelectedBudget(null)} // Close dialog
        />
      )}
    </div>
  );
};

export default ExpenseDashboard;
