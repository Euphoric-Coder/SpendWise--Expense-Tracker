import { formatCurrency } from "@/utils/utilities";
import Link from "next/link";
import React from "react";

const BudgetItem = ({ budget, isBudget }) => {

  return (
    <Link href={`/dashboard/expenses/${budget?.id}`}>
      <div
        className={`p-5 sm:p-6 border-2 rounded-3xl bg-gradient-to-b from-blue-50 via-indigo-100 to-purple-100 shadow-2xl relative overflow-hidden transition-transform transform ${
          isBudget
            ? "hover:scale-105 hover:shadow-[0_4px_30px_rgba(0,200,255,0.5)] cursor-pointer"
            : "cursor-default"
        }`}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-300 via-teal-300 to-purple-400 opacity-30 blur-3xl animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-purple-500 via-indigo-400 to-blue-300 opacity-20 blur-[80px]"></div>
        </div>

        {/* Card Content */}
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 sm:gap-4 items-center">
              {/* Icon */}
              <h2 className="text-2xl sm:text-3xl p-4 sm:p-5 px-5 sm:px-6 bg-gradient-to-r from-teal-300 via-blue-300 to-indigo-300 rounded-full text-indigo-700 shadow-md">
                {budget?.icon}
              </h2>

              {/* Name and Item Count */}
              <div>
                <h2 className="font-bold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-text">
                  {budget.name}
                </h2>
                <h2 className="text-sm text-gray-600">
                  {budget.totalItem} Item(s)
                </h2>
              </div>
            </div>

            {/* Amount */}
            <h2 className="font-bold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-purple-500">
              {formatCurrency(budget.amount)}
            </h2>
          </div>

          {/* Spending Overview */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs text-gray-500">
                {formatCurrency(budget.totalSpend ? budget.totalSpend : 0)}{" "}
                Spent
              </h2>
              <h2 className="text-xs text-gray-500">
                {formatCurrency(budget.amount - budget.totalSpend)} Remaining
              </h2>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-300 h-2 rounded-full shadow-inner">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 via-teal-500 to-blue-500 shadow-md"
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
    </Link>
  );
};

export default BudgetItem;
