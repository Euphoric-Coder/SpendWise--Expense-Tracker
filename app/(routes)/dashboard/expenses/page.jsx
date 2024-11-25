"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { formatCurrencyDashboard } from "@/utils/utilities";
import BudgetCard from "@/components/Expenses/ExpenseCard";
import BudgetDialog from "@/components/Expenses/ExpenseDialog";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { totalBudgets, totalExpenses, remaining } = calculateStats();

  return (
    <div className="p-10 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-25 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 opacity-30 blur-[100px]"></div>
      </div>

      {/* Header */}
      <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-12">
        Expense Dashboard
      </h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="relative bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 shadow-2xl rounded-3xl p-8 text-center text-white hover:scale-105 transition-transform">
          {/* Background Effect */}
          <div className="absolute -top-5 -left-5 w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 opacity-40 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-300">Total Budgets</h2>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
              {formatCurrencyDashboard(totalBudgets)}
            </p>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-red-700 via-pink-800 to-purple-900 shadow-2xl rounded-3xl p-8 text-center text-white hover:scale-105 transition-transform">
          {/* Background Effect */}
          <div className="absolute -top-5 -left-5 w-20 h-20 bg-gradient-to-br from-pink-500 via-red-500 to-purple-500 opacity-40 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-300">Total Expenses</h2>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400">
              {formatCurrencyDashboard(totalExpenses)}
            </p>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-green-700 via-teal-800 to-blue-900 shadow-2xl rounded-3xl p-8 text-center text-white hover:scale-105 transition-transform">
          {/* Background Effect */}
          <div className="absolute -top-5 -left-5 w-20 h-20 bg-gradient-to-br from-teal-500 via-green-500 to-blue-500 opacity-40 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-300">
              Remaining Balance
            </h2>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-400">
              {formatCurrencyDashboard(remaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {budgetList.length === 0
          ? [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index}>
                <Skeleton className="h-[145px] rounded-3xl bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 shadow-lg" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 bg-slate-300" />
                  <Skeleton className="h-4 w-[75%] bg-slate-300" />
                </div>
              </div>
            ))
          : budgetList.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                expenses={expensesByBudget[budget.id] || []}
                onOpen={() => setSelectedBudget(budget)} // Open dialog for selected budget
              />
            ))}
      </div>

      {/* Dialog */}
      {selectedBudget && (
        <BudgetDialog
          budget={selectedBudget}
          expenses={expensesByBudget[selectedBudget.id] || []}
          onClose={() => setSelectedBudget(null)} // Close dialog
        />
      )}
    </div>
  );
};

export default ExpenseDashboard;
