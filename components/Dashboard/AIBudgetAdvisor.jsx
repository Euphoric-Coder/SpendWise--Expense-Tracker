import { GiveFinancialAdvice } from "@/utils/aiAdvisor";
import { Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";

const AIBudgetAdvisor = ({
  totalBudget,
  totalIncome,
  totalSpend,
  largestBudget,
  highestExpense,
  totalDebt,
  debtToIncomeRatio,
  budgetList,
  expenseList,
}) => {
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    if (budgetList.length > 0 || expenseList.length > 0) {
      console.log(expenseList);
      fetchFinancialAdvice();
    }
  }, []);

  const fetchFinancialAdvice = async () => {
    const advice = await GiveFinancialAdvice(
      totalBudget,
      totalIncome,
      totalSpend,
      largestBudget,
      highestExpense,
      totalDebt,
      debtToIncomeRatio,
      budgetList,
      expenseList
    );
    console.log(
      totalBudget,
      totalIncome,
      totalSpend,
      largestBudget,
      highestExpense,
      totalDebt,
      debtToIncomeRatio
    );
    console.log(advice);
    setFinancialAdvice(advice);
  };

  const refreshAdvice = () => {
    fetchFinancialAdvice();
  };

  return (
    <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-lg hover:shadow-xl transform bg-gradient-to-br from-white via-blue-50 to-blue-100 border-blue-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-teal-300 to-green-400 opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-radial from-blue-300 via-transparent to-transparent opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* Financial Advisor Section */}
      <div className="relative w-full z-10">
        <div className="flex mb-4 flex-row space-x-4 items-center">
          <h2 className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 animate-gradient">
            Finora AI
          </h2>
          <Sparkles className="rounded-full text-gray-200 w-14 h-14 p-3 bg-gradient-to-r from-teal-300 via-blue-400 to-purple-500 shadow-lg hover:shadow-teal-400/50 hover:scale-110 transition-all duration-300" />
          <p className="text-lg italic font-medium text-gray-500 animate-pulse">
            (Always evolving for your future...)
          </p>
        </div>

        <div className="p-6 rounded-3xl border bg-white bg-opacity-70 border-blue-200 shadow-inner backdrop-blur-lg hover:backdrop-blur-xl transition-all duration-300">
          {financialAdvice ? (
            <div className="text-lg text-gray-600 leading-relaxed p-5">
              {parse(financialAdvice)}
            </div>
          ) : (
            <p className="text-lg italic text-gray-500 animate-pulse">
              Loading financial advice...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBudgetAdvisor;
