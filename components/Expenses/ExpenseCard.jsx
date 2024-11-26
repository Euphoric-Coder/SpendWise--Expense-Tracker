import { formatCurrencyDashboard } from "@/utils/utilities";
import React from "react";

const BudgetCard = ({ budget, onOpen }) => {
  const progress = Math.min(
    (budget.totalSpend / budget.amount) * 100,
    100 // Cap progress at 100%
  );

  return (
    <div className="relative p-6 sm:p-8 border-2 rounded-3xl bg-gradient-to-b from-red-50 via-orange-100 to-yellow-100 shadow-xl overflow-hidden transform transition-transform hover:shadow-[0_10px_40px_rgba(255,150,50,0.3)]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 opacity-40 blur-3xl animate-spin-slow"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-yellow-300 via-orange-200 to-red-200 opacity-20 blur-[80px]"></div>
      </div>

      {/* Card Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 rounded-full shadow-md text-orange-700 text-3xl font-bold">
              {budget.icon || "💰"}
            </div>

            {/* Title and Items */}
            <div>
              <h2 className="font-extrabold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
                {budget.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {budget.totalItem} Item(s)
              </p>
            </div>
          </div>

          {/* Total Amount */}
          <h2 className="font-extrabold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400">
            {formatCurrencyDashboard(budget.amount)}
          </h2>
        </div>

        {/* Spending Overview */}
        <div className="mt-6">
          <div className="flex justify-between text-sm sm:text-base text-gray-600">
            <p>
              <span className="font-bold text-gray-700">
                {formatCurrencyDashboard(budget.totalSpend || 0)}
              </span>{" "}
              Spent
            </p>
            <p>
              <span className="font-bold text-gray-700">
                {formatCurrencyDashboard(budget.amount - budget.totalSpend)}
              </span>{" "}
              Remaining
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative mt-3 w-full h-3 sm:h-4 bg-gray-300 rounded-full shadow-inner">
            <div
              className="h-3 sm:h-4 rounded-full bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 shadow-md"
              style={{
                width: `${progress.toFixed(2)}%`,
              }}
            ></div>
          </div>

          {/* Percentage Below Progress Bar */}
          <p
            className={`mt-2 text-center text-sm sm:text-base font-semibold ${
              progress > 75
                ? "text-red-500"
                : progress > 50
                ? "text-orange-500"
                : "text-green-500"
            }`}
          >
            {progress.toFixed(1)}% of budget used
          </p>
        </div>

        {/* View Expenses Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onOpen}
            className="px-5 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 text-white font-medium text-sm sm:text-base rounded-full shadow-lg hover:opacity-90 transition-transform transform hover:scale-105"
          >
            View Expenses
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
