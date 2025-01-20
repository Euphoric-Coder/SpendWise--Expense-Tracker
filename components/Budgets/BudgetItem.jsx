// "use client";

import { formatCurrency } from "@/utils/utilities";
import { Repeat, Info } from "lucide-react";
import Link from "next/link";
import React from "react";
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
import { Badge } from "@/components/ui/badge";

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
          A <strong>Recurring Budget</strong> allows you to manage expenses that
          occur on a regular basis, such as monthly subscriptions, utility
          bills, or rent payments. This feature is designed to provide a
          structured approach to tracking and controlling predictable expenses.
        </p>
        <p className="mb-2 text-justify">
          In SpendWise, you can easily set up a recurring budget to ensure that
          these expenses are accounted for and do not disrupt your overall
          financial planning.
        </p>
        <p className="mb-2">Here are some key features of recurring budgets:</p>
        <ul className="list-disc pl-5 mb-2">
          <li>
            Automatically renews based on the frequency you select (e.g.,
            weekly, monthly).
          </li>
          <li>
            Ensures better control over consistent expenses and reduces the risk
            of overspending.
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

const BudgetCard = ({ isBudget, budget }) => (
  <>
    <div
      className={`p-5 sm:p-6 border-2 rounded-3xl shadow-2xl relative overflow-hidden transition-transform transform ${
        isBudget
          ? "bg-gradient-to-b from-blue-50 via-indigo-100 to-purple-100 hover:scale-105 hover:shadow-[0_4px_30px_rgba(0,200,255,0.5)] cursor-pointer dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-700"
          : "bg-gradient-to-b from-cyan-50 via-blue-100 to-indigo-100 cursor-default dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-700"
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute -top-10 -left-10 w-40 h-40 ${
            isBudget
              ? "bg-gradient-to-r from-blue-300 via-teal-300 to-purple-400 dark:from-indigo-800 dark:via-purple-700 dark:to-blue-700"
              : "bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-400 dark:from-indigo-800 dark:via-blue-700 dark:to-cyan-700"
          } opacity-30 blur-3xl animate-spin-slow`}
        ></div>
        <div
          className={`absolute bottom-10 right-10 w-60 h-60 ${
            isBudget
              ? "bg-gradient-to-br from-purple-500 via-indigo-400 to-blue-300 dark:from-indigo-900 dark:via-purple-800 dark:to-blue-800"
              : "bg-gradient-to-br from-indigo-500 via-blue-400 to-cyan-300 dark:from-indigo-800 dark:via-blue-700 dark:to-cyan-700"
          } opacity-20 blur-[80px]`}
        ></div>
      </div>

      {/* Card Content */}
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 sm:gap-4 items-center">
            {/* Icon */}
            <h2
              className={`text-2xl sm:text-3xl p-4 sm:p-5 px-5 sm:px-6 rounded-full shadow-md ${
                isBudget
                  ? "bg-gradient-to-r from-teal-300 via-blue-300 to-indigo-300 text-indigo-700 dark:bg-gradient-to-r dark:from-indigo-700 dark:via-purple-700 dark:to-blue-700 dark:text-indigo-300"
                  : "bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 text-blue-700 dark:bg-gradient-to-r dark:from-indigo-700 dark:via-blue-700 dark:to-cyan-700 dark:text-blue-300"
              }`}
            >
              {budget?.icon}
            </h2>

            {/* Name and Item Count */}
            <div>
              <h2
                className={`font-bold text-lg sm:text-xl text-transparent bg-clip-text ${
                  isBudget
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:bg-gradient-to-r dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400"
                    : "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:bg-gradient-to-r dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400"
                } animate-gradient-text`}
              >
                {budget.name}
              </h2>
              {budget.budgetType === "recurring" && (
                <Badge className="inline-flex items-center gap-1 mt-2 mb-2  px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 dark:from-blue-800 dark:via-cyan-800 dark:to-indigo-800 text-white font-medium text-xs sm:text-sm shadow-sm text-center">
                  <Repeat size={20} />
                  Recurring Budget
                  <RecurringBudgetInfo />
                </Badge>
                // <h2 className="inline-flex items-center gap-1 mt-2 mb-2  px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 dark:from-blue-800 dark:via-cyan-800 dark:to-indigo-800 text-white font-medium text-xs sm:text-sm shadow-sm text-center">
                //   <Repeat size={20} /> Recurring Budget <RecurringBudgetInfo />
                // </h2>
              )}
              {budget.budgetType !== "recurring" && (
                <h2 className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
                  Total Expenses: {budget.totalItem} Item(s)
                </h2>
              )}
            </div>
          </div>

          {/* Amount */}
          <h2
            className={`font-bold text-lg sm:text-xl text-transparent bg-clip-text ${
              isBudget
                ? "bg-gradient-to-r from-blue-600 via-teal-500 to-purple-500 dark:bg-gradient-to-r dark:from-indigo-500 dark:via-purple-500 dark:to-teal-500"
                : "bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-500 dark:bg-gradient-to-r dark:from-indigo-500 dark:via-blue-500 dark:to-cyan-500"
            }`}
          >
            {formatCurrency(budget.amount)}
          </h2>
        </div>

        {/* Spending Overview */}
        <div className="mt-6">
          {budget.budgetType === "recurring" && (
            <div className="flex flex-col justify-center md:flex-row md:justify-between items-center mb-2">
              <h2 className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
                Total Expenses: {budget.totalItem} Item(s)
              </h2>
              <h2 className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
                Frequency: {budget.frequency}
              </h2>
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
              {formatCurrency(budget.totalSpend ? budget.totalSpend : 0)} Spent
            </h2>
            <h2 className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
              {formatCurrency(budget.amount - budget.totalSpend)} Remaining
            </h2>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-300 dark:bg-gray-500 h-2 rounded-full shadow-inner">
            <div
              className={`h-2 rounded-full shadow-md ${
                isBudget
                  ? "bg-gradient-to-r from-purple-500 via-teal-500 to-blue-500 dark:bg-gradient-to-r dark:from-indigo-500 dark:via-purple-500 dark:to-teal-500"
                  : "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 dark:bg-gradient-to-r dark:from-indigo-500 dark:via-blue-500 dark:to-cyan-500"
              }`}
              style={{
                width: `${((budget.totalSpend / budget.amount) * 100).toFixed(
                  2
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </>
);

const BudgetItem = ({ budget, isBudget }) => {
  return (
    <>
      {isBudget ? (
        <Link href={`/dashboard/budgets/${budget?.id}`}>
          <div>
            <BudgetCard isBudget={isBudget} budget={budget} />
          </div>
        </Link>
      ) : (
        <div>
          <BudgetCard isBudget={isBudget} budget={budget} />
        </div>
      )}
    </>
  );
};

export default BudgetItem;
