import { formatCurrency } from "@/utils/utilities";
import Link from "next/link";
import React from "react";

const BudgetCard = ({ isBudget, budget }) => (
  <>
    <div
      className={`p-5 sm:p-6 border-2 rounded-3xl shadow-2xl relative overflow-hidden transition-transform transform ${
        isBudget
          ? "bg-gradient-to-b from-blue-50 via-indigo-100 to-purple-100 hover:scale-105 hover:shadow-[0_4px_30px_rgba(0,200,255,0.5)] cursor-pointer"
          : "bg-gradient-to-b from-yellow-50 via-orange-100 to-red-100 hover:scale-105 hover:shadow-[0_4px_30px_rgba(255,200,0,0.5)] cursor-default"
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute -top-10 -left-10 w-40 h-40 ${
            isBudget
              ? "bg-gradient-to-r from-blue-300 via-teal-300 to-purple-400"
              : "bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400"
          } opacity-30 blur-3xl animate-spin-slow`}
        ></div>
        <div
          className={`absolute bottom-10 right-10 w-60 h-60 ${
            isBudget
              ? "bg-gradient-to-br from-purple-500 via-indigo-400 to-blue-300"
              : "bg-gradient-to-br from-orange-500 via-red-400 to-yellow-300"
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
                  ? "bg-gradient-to-r from-teal-300 via-blue-300 to-indigo-300 text-indigo-700"
                  : "bg-gradient-to-r from-orange-300 via-yellow-300 to-red-300 text-red-700"
              }`}
            >
              {budget?.icon}
            </h2>

            {/* Name and Item Count */}
            <div>
              <h2
                className={`font-bold text-lg sm:text-xl text-transparent bg-clip-text ${
                  isBudget
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    : "bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500"
                } animate-gradient-text`}
              >
                {budget.name}
              </h2>
              <h2 className="text-sm text-gray-600">
                {budget.totalItem} Item(s)
              </h2>
            </div>
          </div>

          {/* Amount */}
          <h2
            className={`font-bold text-lg sm:text-xl text-transparent bg-clip-text ${
              isBudget
                ? "bg-gradient-to-r from-blue-600 via-teal-500 to-purple-500"
                : "bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500"
            }`}
          >
            {formatCurrency(budget.amount)}
          </h2>
        </div>

        {/* Spending Overview */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-gray-500">
              {formatCurrency(budget.totalSpend ? budget.totalSpend : 0)} Spent
            </h2>
            <h2 className="text-xs text-gray-500">
              {formatCurrency(budget.amount - budget.totalSpend)} Remaining
            </h2>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-300 h-2 rounded-full shadow-inner">
            <div
              className={`h-2 rounded-full shadow-md ${
                isBudget
                  ? "bg-gradient-to-r from-purple-500 via-teal-500 to-blue-500"
                  : "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
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
        <Link href={`/dashboard/expenses/${budget?.id}`}>
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
