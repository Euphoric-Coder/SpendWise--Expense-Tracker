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
      <DialogContent className="w-full max-w-4xl xl:max-w-6xl border-2 border-blue-200 p-6 md:p-8 rounded-3xl bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-25 blur-3xl animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-400 via-indigo-300 to-cyan-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-20 blur-[120px]"></div>
        </div>

        {/* Dialog Header */}
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-tl from-blue-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-500">
            {budget.name}
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base text-gray-600 dark:text-gray-300 flex items-center justify-between mt-2">
            View detailed expenses for this budget.
            <Link href={`/dashboard/expenses/${budget.id}`}>
              <Button className="rounded-3xl text-sm md:text-base px-4 py-2">
                Manage Expenses
              </Button>
            </Link>
          </DialogDescription>
        </DialogHeader>

        {/* Budget Overview */}
        <div className="relative z-10 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-xl rounded-2xl p-4 md:p-6 space-y-6 backdrop-blur-xl bg-opacity-80 dark:bg-opacity-50 border border-blue-300 dark:border-gray-700">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-gray-200">
            Budget Overview
          </h2>
          <div className="flex items-center justify-between text-sm md:text-lg font-semibold">
            <div className="flex items-center gap-2 md:gap-3 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
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

          {/* Remaining fields and progress bar */}
          <div className="mt-4 relative">
            <div className="w-full bg-gradient-to-r from-blue-200 via-blue-300 to-gray-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-lg h-3 relative overflow-hidden">
              <div
                className={`h-3 rounded-lg transition-all duration-[2000ms] ease-in-out ${
                  budgetUtilization >= 90
                    ? "bg-gradient-to-r from-red-600 to-pink-600 animate-pulse"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500"
                }`}
                style={{ width: `${budgetUtilization}%` }}
              ></div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              {budgetUtilization.toFixed(2)}% of the budget utilized
            </p>
          </div>
        </div>

        {/* Expense List */}
        <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-gray-800 dark:text-gray-200">
          Latest Expenses ({expenses.length})
        </h2>
        <div className="overflow-hidden hidden md:block rounded-xl border border-gray-300 dark:border-gray-700 shadow-lg">
          <div className="overflow-x-auto max-h-[300px] md:max-h-[400px]">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead className="sticky top-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 shadow-md">
                <tr>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left font-bold uppercase">
                    #
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left font-bold uppercase">
                    Name
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left font-bold uppercase">
                    Amount
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left font-bold uppercase">
                    Date
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-3 text-left font-bold uppercase">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((expense, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-300 dark:border-gray-700 transition-all duration-300 ${
                        index % 2 === 0
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "bg-white dark:bg-gray-900"
                      } hover:bg-blue-100 dark:hover:bg-gray-700`}
                    >
                      <td className="px-4 md:px-6 py-3 text-gray-900 dark:text-gray-200">
                        {index + 1}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-900 dark:text-gray-200">
                        {expense.name}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-blue-600 dark:text-blue-400 font-bold">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">
                        {expense.createdAt}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-600 dark:text-gray-400">
                        {expense.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-xl font-bold px-6 py-6 text-gray-500 dark:text-gray-400 animate-pulse"
                    >
                      No expenses found.
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
