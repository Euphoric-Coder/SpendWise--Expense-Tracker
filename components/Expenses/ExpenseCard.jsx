import { formatCurrencyDashboard } from "@/utils/utilities";
import React from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const ExpenseCard = ({ budget, onOpen }) => {
  const progress = Math.min(
    (budget.totalSpend / budget.amount) * 100,
    100 // Cap progress at 100%
  );

  return (
    <div className="relative p-6 sm:p-8 border-2 rounded-3xl bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-950 dark:to-gray-900 shadow-xl overflow-hidden transform transition-transform hover:shadow-[0_10px_40px_rgba(100,150,255,0.3)]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-40 blur-3xl animate-spin-slow"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-indigo-300 via-purple-200 to-blue-200 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-20 blur-[80px]"></div>
      </div>

      {/* Card Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 rounded-full shadow-md text-indigo-700 dark:text-blue-400 text-3xl font-bold">
              {budget.icon || "💰"}
            </div>

            {/* Title and Items */}
            <div>
              <h2 className="font-extrabold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 dark:from-blue-400 dark:via-indigo-500 dark:to-purple-500">
                {budget.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {budget.totalItem} Item(s)
              </p>
            </div>
          </div>

          {/* Total Amount */}
          <h2 className="font-extrabold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 dark:from-blue-400 dark:via-indigo-500 dark:to-purple-500">
            {formatCurrencyDashboard(budget.amount)}
          </h2>
        </div>

        {/* Spending Overview */}
        <div className="mt-6">
          <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {formatCurrencyDashboard(budget.totalSpend || 0)}
              </span>{" "}
              Spent
            </p>
            <p>
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {formatCurrencyDashboard(budget.amount - budget.totalSpend)}
              </span>{" "}
              Remaining
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative mt-3 w-full h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner">
            <div
              className="h-3 sm:h-4 rounded-full bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 dark:from-blue-700 dark:via-indigo-800 dark:to-purple-800 shadow-md"
              style={{
                width: `${progress.toFixed(2)}%`,
              }}
            ></div>
          </div>

          {/* Percentage Below Progress Bar */}
          <p
            className={`mt-2 text-center text-sm sm:text-base font-semibold ${
              progress > 75
                ? "text-red-500 dark:text-pink-500"
                : progress > 50
                ? "text-orange-500 dark:text-purple-500"
                : "text-green-500 dark:text-blue-500"
            }`}
          >
            {progress.toFixed(1)}% of budget used
          </p>
        </div>

        {/* View Expenses Button */}
        <div className="mt-6 flex flex-wrap justify-center md:justify-end gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/budgets/${budget.id}`}>
                  <Button className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 dark:from-blue-700 dark:via-indigo-800 dark:to-purple-800 text-white font-medium text-sm sm:text-base rounded-full shadow-lg hover:opacity-90 transition-transform transform hover:scale-105">
                    Go to Dedicated Expense Tab
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="relative">
                <p>
                  Go to "<strong>{budget.name}</strong>" Expense Tab
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            onClick={onOpen}
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 dark:from-blue-700 dark:via-indigo-800 dark:to-purple-800 text-white font-medium text-sm sm:text-base rounded-full shadow-lg hover:opacity-90 transition-transform transform hover:scale-105"
          >
            View Expenses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
