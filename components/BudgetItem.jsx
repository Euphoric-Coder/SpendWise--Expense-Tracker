import React from "react";
import CountUp from "react-countup";

const BudgetItem = ({ budget }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2, // Adjust as needed
    }).format(amount);
  };

  return (
    <div className="p-5 border-2 rounded-3xl bg-gradient-to-b from-white via-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer">
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
            style={{ width: `${(2000 / budget.amount) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetItem;
