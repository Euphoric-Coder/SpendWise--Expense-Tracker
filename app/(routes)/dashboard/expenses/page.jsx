"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { formatCurrencyDashboard } from "@/utils/utilities";

const ExpenseDashboard = () => {
  const [expensesList, setExpensesList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  const [expandedBudget, setExpandedBudget] = useState(null); // For dropdown state

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

    const getBudgetList = async () => {
      const result = await db
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
      setBudgetList(result);
      getAllExpenses();
    };

  /**
   * Fetch all expenses belonging to the user.
   */
  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetId: Expenses.budgetId,
        budgetName: Budgets.name, // Associated budget name
        budgetAmount: Budgets.amount,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
    console.log(result);
  };

  /**
   * Toggle dropdown for a budget.
   * @param {number} budgetId - ID of the budget.
   */
  const toggleDropdown = (budgetId) => {
    setExpandedBudget((prev) => (prev === budgetId ? null : budgetId));
  };

  /**
   * Calculate overall statistics.
   */
  const calculateStats = () => {
    const totalBudgets = expensesList.reduce(
      (acc, expense) => acc + (parseFloat(expense.budgetAmount) || 0),
      0
    );
    const totalExpenses = expensesList.reduce(
      (acc, expense) => acc + parseFloat(expense.amount),
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
    <div className="p-8">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-12">
        Expense Dashboard
      </h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 shadow-lg rounded-lg p-6 text-center text-white">
          <h2 className="text-lg font-bold">Total Budgets</h2>
          <p className="text-2xl font-extrabold">
            {formatCurrencyDashboard(totalBudgets)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-900 to-pink-900 shadow-lg rounded-lg p-6 text-center text-white">
          <h2 className="text-lg font-bold">Total Expenses</h2>
          <p className="text-2xl font-extrabold">
            ₹{totalExpenses}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-900 to-teal-900 shadow-lg rounded-lg p-6 text-center text-white">
          <h2 className="text-lg font-bold">Remaining Balance</h2>
          <p className="text-2xl font-extrabold">
            ₹{remaining}
          </p>
        </div>
      </div>

      {/* Expense Cards */}
      {expensesList.length === 0 ? (
        <div className="text-center text-2xl font-semibold text-gray-500">
          No expenses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {expensesList
            .reduce((budgets, expense) => {
              const budget = budgets.find((b) => b.id === expense.budgetId);
              if (budget) {
                budget.expenses.push(expense);
              } else {
                budgets.push({
                  id: expense.budgetId,
                  name: expense.budgetName,
                  amount: expense.budgetAmount,
                  expenses: [expense],
                });
              }
              return budgets;
            }, [])
            .map((budget) => (
              <div
                key={budget.id}
                className="relative bg-gray-800 bg-opacity-80 shadow-lg rounded-lg p-5 border border-gray-600 hover:border-purple-500 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-md opacity-20 rounded-lg"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">
                      {budget.name}
                    </h2>
                    <button
                      onClick={() => toggleDropdown(budget.id)}
                      className="flex items-center text-sm font-medium text-gray-300 hover:text-purple-400"
                    >
                      {expandedBudget === budget.id
                        ? "Hide Expenses"
                        : "View Expenses"}
                      {expandedBudget === budget.id ? (
                        <ChevronUp className="ml-2 w-4 h-4" />
                      ) : (
                        <ChevronDown className="ml-2 w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="relative w-full bg-gray-600 rounded-full h-3">
                      <div
                        className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500"
                        style={{
                          width: `${
                            (budget.expenses.reduce(
                              (acc, exp) => acc + parseFloat(exp.amount),
                              0
                            ) /
                              budget.amount) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {expandedBudget === budget.id && (
                    <div
                      className="mt-4 space-y-3 overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: expandedBudget === budget.id ? "500px" : "0",
                      }}
                    >
                      <ul className="space-y-3">
                        {budget.expenses.map((expense) => (
                          <li
                            key={expense.id}
                            className="bg-gray-700 text-gray-300 rounded-lg p-4 shadow-md flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium text-white">
                                {expense.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                ₹{expense.amount.toLocaleString()} -{" "}
                                {expense.createdAt}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    href={`/dashboard/expenses/${budget.id}`}
                    className="block mt-4 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition rounded-lg py-2 font-medium shadow-md"
                  >
                    More Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseDashboard;
