"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { formatCurrencyDashboard } from "@/utils/utilities";
import ExpenseDialog from "@/components/Expenses/ExpenseDialog";
import { Skeleton } from "@/components/ui/skeleton";
import ExpenseCard from "@/components/Budgets/BudgetCard";
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
    const budg_response = await fetch(`/api/budgets`);
    const budgets = await budg_response.json();

    const exp_response = await fetch(`/api/expenses`);
    const expenses = await exp_response.json();

    const groupedExpenses = expenses.reduce((acc, expense) => {
      acc[expense.budgetId] = acc[expense.budgetId] || [];
      acc[expense.budgetId].push(expense);
      return acc;
    }, {});

    // console.log(groupedExpenses);

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
    <div className="p-10 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-30 blur-[80px]"></div>
      </div>

      {/* Header */}
      <h2 className="p-2 mb-10 font-extrabold text-xl md:text-4xl lg:text-3xl xl:text-5xl md:text-left text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-400 to-purple-500">
        My Budget List
      </h2>

      {/* Add New Budget & Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <CreateBudget refreshData={() => refreshData()} />

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
