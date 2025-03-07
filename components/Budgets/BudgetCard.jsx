import { formatCurrencyDashboard } from "@/utils/utilities";
import React from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Info, Repeat } from "lucide-react";
import { Badge } from "../ui/badge";
import EditBudget from "./EditBudget";

const ExpenseCard = ({ budget, onOpen, refreshData }) => {
  const progress = Math.min(
    (budget.totalSpend / budget.amount) * 100,
    100 // Cap progress at 100%
  );

  const RecurringBudgetInfo = () => {
    return (
      <Popover>
        <PopoverTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  size={18}
                  className="text-white hover:text-gray-700 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent className="rounded-full font-bold">
                <p>Recurring Budget Info</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="center"
          sideOffset={10}
          className="bg-white dark:bg-gray-800 text-sm shadow-lg rounded-2xl p-4 border border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-in-out"
        >
          <p className="mb-2 text-justify">
            A <strong>Recurring Budget</strong> allows you to manage expenses
            that occur on a regular basis, such as monthly subscriptions,
            utility bills, or rent payments. This feature is designed to provide
            a structured approach to tracking and controlling predictable
            expenses.
          </p>
          <p className="mb-2 text-justify">
            In SpendWise, you can easily set up a recurring budget to ensure
            that these expenses are accounted for and do not disrupt your
            overall financial planning.
          </p>
          <p className="mb-2">
            Here are some key features of recurring budgets:
          </p>
          <ul className="list-disc pl-5 mb-2">
            <li>
              Automatically renews based on the frequency you select (e.g.,
              weekly, monthly).
            </li>
            <li>
              Ensures better control over consistent expenses and reduces the
              risk of overspending.
            </li>
            <li>Allows you to visualize recurring trends in your spending.</li>
          </ul>
          <p>
            <strong>Pro Tip:</strong> Use the SpendWise insights feature to
            analyze your recurring expenses and identify potential areas for
            savings.
          </p>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="relative p-6 sm:p-8 border-2 rounded-3xl bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-gray-950 dark:to-gray-900 shadow-xl overflow-hidden transform transition-transform hover:shadow-[0_10px_40px_rgba(100,150,255,0.3)]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-40 blur-3xl animate-spin-slow"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-indigo-300 via-purple-200 to-blue-200 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-20 blur-[80px]"></div>
      </div>

      {/* Card Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 sm:gap-4 items-center">
            {/* Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 rounded-full shadow-md text-indigo-700 dark:text-blue-400 text-3xl font-bold">
              {budget.icon || "💰"}
            </div>

            {/* Title and Items */}
            <div>
              <h2 className="font-extrabold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 dark:from-blue-400 dark:via-indigo-500 dark:to-purple-500">
                {budget.name}
              </h2>
              {budget.budgetType === "recurring" && (
                <Badge className="inline-flex items-center gap-1 mt-2 mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-300 via-cyan-400 to-indigo-300 dark:from-blue-600 dark:via-cyan-600 dark:to-indigo-600 text-white font-medium text-xs sm:text-sm shadow-sm text-center">
                  <Repeat size={20} />
                  Recurring Budget
                  <RecurringBudgetInfo />
                </Badge>
              )}
              {budget.budgetType !== "recurring" && (
                <h2 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
                  Total Expenses: {budget.totalItem} Item(s)
                </h2>
              )}
            </div>
          </div>

          {/* Total Amount */}
          <h2 className="font-extrabold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 dark:from-blue-400 dark:via-indigo-500 dark:to-purple-500">
            {formatCurrencyDashboard(budget.amount)}
          </h2>
        </div>

        {/* Spending Overview */}
        <div className="mt-6">
          {budget.budgetType === "recurring" && (
            <div className="flex flex-col justify-center md:flex-row md:justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
                Total Expenses: {budget.totalItem} Item(s)
              </h2>
              <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
                Frequency: {budget.frequency}
              </h2>
            </div>
          )}
          <div className="flex flex-col justify-center md:flex-row md:justify-between items-center mb-2">
            <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
              {formatCurrencyDashboard(
                budget.totalSpend ? budget.totalSpend : 0
              )}{" "}
              Spent
            </h2>
            <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
              {formatCurrencyDashboard(budget.amount - budget.totalSpend)}{" "}
              Remaining
            </h2>
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
                  <Button className="budg-btn4">Manage Expenses</Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="relative">
                <p className="rounded-3xl text-bold">
                  Go to "<strong>{budget.name}</strong>" Expense Tab
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button onClick={onOpen} className="budg-btn4">
            View Expenses
          </Button>
          <EditBudget budgetInfo={budget} refreshData={refreshData} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
