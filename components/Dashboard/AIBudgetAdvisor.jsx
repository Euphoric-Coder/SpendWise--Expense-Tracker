import { GiveFinancialAdvice } from "@/utils/aiAdvisor";
import { RefreshCw, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Button } from "../ui/button";

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
    console.log("ran again!")
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
    setFinancialAdvice("");
    fetchFinancialAdvice();
  };

  return (
    <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-lg hover:shadow-xl transform bg-gradient-to-br from-white via-blue-50 to-blue-100 border-blue-300 relative overflow-hidden dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 dark:border-gray-700">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-teal-300 to-green-400 opacity-20 blur-3xl pointer-events-none dark:from-blue-800 dark:via-gray-800 dark:to-gray-700"></div>
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-radial from-blue-300 via-transparent to-transparent opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2 pointer-events-none dark:from-blue-700 dark:via-transparent dark:to-transparent"></div>

      {/* Financial Advisor Section */}
      <div className="relative w-full z-10">
        <div className="flex mb-4 flex-row space-x-4 items-center">
          <h2 className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 animate-gradient dark:from-blue-300 dark:via-cyan-400 dark:to-teal-300">
            Finora AI
          </h2>
          <Sparkles className="rounded-full text-gray-200 w-14 h-14 p-3 bg-gradient-to-r from-teal-300 via-blue-400 to-purple-500 shadow-lg hover:shadow-teal-400/50 hover:scale-110 transition-all duration-300 dark:from-teal-500 dark:via-blue-600 dark:to-purple-500" />
          <Button onClick={refreshAdvice}>
            <RefreshCw size={32} />
          </Button>
        </div>

        <div className="p-6 rounded-3xl border bg-white bg-opacity-70 border-blue-200 shadow-inner backdrop-blur-lg hover:backdrop-blur-xl transition-all duration-300 dark:bg-gray-800 dark:bg-opacity-90 dark:border-gray-700 dark:shadow-lg dark:hover:shadow-xl">
          {financialAdvice ? (
            <div className="text-lg text-gray-600 leading-relaxed p-5 dark:text-gray-300">
              {parse(financialAdvice)}
            </div>
          ) : (
            <p className="text-lg italic text-gray-500 animate-pulse dark:text-gray-400">
              Loading financial advice...
            </p>
          )}
          {financialAdvice === "refreshing" && (
            <p className="text-lg italic text-gray-500 animate-pulse dark:text-gray-400">
              Refreshing financial advice...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBudgetAdvisor;
