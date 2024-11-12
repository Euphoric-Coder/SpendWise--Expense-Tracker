import Link from "next/link";
import React from "react";

const BudgetItem = ({ budget, isBudget }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Link href={`/dashboard/expenses/${budget?.id}`}>
      <div className={`p-5 border-2 rounded-3xl bg-gradient-to-b from-white via-blue-50 to-indigo-50 shadow-lg transition-transform transform ${(isBudget)? "hover:scale-105 hover:shadow-xl cursor-pointer": "cursor-default"}`}>
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <h2 className="text-3xl p-4 px-5 bg-gradient-to-r from-teal-200 via-blue-200 to-indigo-200 rounded-full text-indigo-600">
              {budget?.icon}
            </h2>
            <div>
              <h2 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                {budget.name}
              </h2>
              <h2 className="text-sm text-gray-600">
                {budget.totalItem} Item(s)
              </h2>
            </div>
          </div>
          <h2 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-purple-500">
            {formatCurrency(budget.amount)}
          </h2>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-gray-500">
              {formatCurrency(budget.totalSpend ? budget.totalSpend : 0)} Spent
            </h2>
            <h2 className="text-xs text-gray-500">
              {formatCurrency(budget.amount - budget.totalSpend)} Remaining
            </h2>
          </div>
          <div className="w-full bg-gray-300 h-2 rounded-full">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
              style={{ width: `${((budget.totalSpend / budget.amount) * 100).toFixed(2)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BudgetItem;
