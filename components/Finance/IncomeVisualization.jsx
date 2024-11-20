"use client";

import React from "react";
import TotalIncomeExpenseBarChart from "./TotalIncomeExpenseBarChart";
import IncomePieChart from "./IncomePieChart";

const IncomeVisualization = ({ incomeList, totalIncome, totalExpense }) => {
  return (
    <div className="p-6">
      <h1 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-400 mb-8">
        Income Breakdown
      </h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 ">
        {/* Pie Chart */}
        <IncomePieChart incomeList={incomeList} totalIncome={totalIncome} />
        {/* Bar Chart */}
        <TotalIncomeExpenseBarChart totalIncome={totalIncome} totalExpense={totalExpense} />
      </div>
    </div>
  );
};

export default IncomeVisualization;
