import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyDashboard } from "@/utils/utilities";
import { DollarSign, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

const ExpenseDialog = ({ budget, expenses, onClose }) => {
  const allocatedBudget = budget.amount || 0;
  const totalSpend = budget.totalSpend || 0;
  const remainingBudget = allocatedBudget - totalSpend;
  const budgetUtilization = allocatedBudget
    ? Math.min((totalSpend / allocatedBudget) * 100, 100)
    : 0;

  return (
    <Dialog open={!!budget} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl border-2 border-blue-200 p-8 rounded-3xl bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial Glows Effect */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-25 blur-3xl animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-400 via-indigo-300 to-cyan-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-20 blur-[120px]"></div>
          {/* Floating Particles Effect */}
          <div className="absolute inset-0 flex space-x-4 animate-float">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-lg"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-lg"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg"></div>
          </div>
        </div>
        {/* Dialog Header */}
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl font-extrabold bg-gradient-to-tl from-blue-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-500">
            {budget.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 flex items-center justify-between">
            View detailed expenses for this budget.
            <Link href={`/dashboard/expenses/${budget.id}`}>
              <Button className="expense-btn1 rounded-3xl">
                Manage Expenses
              </Button>
            </Link>
          </DialogDescription>
        </DialogHeader>

        {/* Budget Overview with Glassmorphism */}
        <div className="relative bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-xl rounded-2xl p-6 space-y-6 backdrop-blur-xl bg-opacity-80 dark:bg-opacity-50 border border-blue-300 dark:border-gray-700">
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200">
            Budget Overview
          </h2>

          <div className="flex items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-6 h-6" />
              <span>Allocated Budget:</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              {allocatedBudget
                ? formatCurrencyDashboard(allocatedBudget)
                : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <TrendingUp className="w-6 h-6" />
              <span>Total Spend:</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              {totalSpend ? formatCurrencyDashboard(totalSpend) : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span>Remaining:</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              {remainingBudget >= 0
                ? formatCurrencyDashboard(remainingBudget)
                : "N/A"}
            </span>
          </div>

          {/* Animated Gradient Progress Bar */}
          <div className="mt-4 relative">
            <div className="w-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-lg h-3 relative overflow-hidden">
              <div
                className={`h-3 rounded-lg transition-all duration-[2000ms] ease-in-out ${
                  budgetUtilization >= 90
                    ? "bg-gradient-to-r from-red-600 to-pink-600 animate-pulse"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500"
                }`}
                style={{ width: `${budgetUtilization}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              {budgetUtilization.toFixed(2)}% of the budget utilized
            </p>
          </div>
        </div>

        {/* Expense List with Modern UI */}
        <div className="">
          <h2 className="mb-3 text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-500">
            Latest Expenses
          </h2>

          <div className="overflow-y-auto max-h-[300px] rounded-lg border border-gray-300 dark:border-gray-700 shadow-inner">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gradient-to-b from-gray-100 dark:from-gray-800 to-transparent">
                <tr className="text-gray-700 dark:text-gray-300 font-semibold">
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Amount</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((expense, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-300 dark:border-gray-700 transition-all duration-300 ${
                        index % 2 === 0
                          ? "bg-blue-50 dark:bg-gray-800"
                          : "bg-white dark:bg-gray-900"
                      } hover:bg-blue-100 dark:hover:bg-gray-700 scale-[1.01]`}
                    >
                      <td className="px-5 py-4 text-gray-900 dark:text-gray-200">
                        {index + 1}
                      </td>
                      <td className="px-5 py-4 text-gray-900 dark:text-gray-200">
                        {expense.name}
                      </td>
                      <td className="px-5 py-4 text-gray-900 dark:text-gray-200 font-bold">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-gray-900 dark:text-gray-200">
                        {expense.createdAt}
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400 italic">
                        {expense.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center px-5 py-6 text-gray-500 dark:text-gray-400"
                    >
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
