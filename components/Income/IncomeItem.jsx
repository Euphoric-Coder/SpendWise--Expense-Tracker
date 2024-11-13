import { formatCurrency } from "@/utils/utilities";
import React from "react";

function IncomeItem({ budget, isBudget }) {

  return (
    <div
      className={`p-4 sm:p-5 border-2 rounded-3xl bg-gradient-to-b from-white via-blue-50 to-indigo-50 shadow-lg transition-transform transform ${
        isBudget
          ? "hover:scale-105 hover:shadow-xl cursor-pointer"
          : "cursor-default"
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-3 sm:gap-4 items-center">
          <h2 className="text-2xl sm:text-3xl p-3 sm:p-4 px-4 sm:px-5 bg-gradient-to-r from-teal-200 via-blue-200 to-indigo-200 rounded-full text-indigo-600">
            {budget?.icon}
          </h2>
          <div>
            <h2 className="font-bold text-md sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              {budget.name}
            </h2>
          </div>
        </div>
        <h2 className="font-bold text-md sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-purple-500">
          {formatCurrency(budget.amount)}
        </h2>
      </div>
    </div>
  );
}

export default IncomeItem;
