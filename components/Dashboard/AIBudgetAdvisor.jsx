import { GiveFinancialAdvice } from "@/utils/aiAdvisor";
import { RefreshCw, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Chatbot from "./ChatBot";

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
    setFinancialAdvice(advice);
  };

  const refreshAdvice = () => {
    setFinancialAdvice("refreshing");
    fetchFinancialAdvice();
  };

  return (
    <div className="relative p-7 border mt-4 rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-lg dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="relative w-full z-10">
        <div className="mb-5 flex gap-3 items-center flex-col md:flex-row md:justify-between">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 dark:from-blue-300 dark:via-cyan-400 dark:to-teal-300 flex items-center gap-3 md:gap-5">
            Finora AI
            <Sparkles className="rounded-full text-gray-200 w-14 h-14 p-3 bg-gradient-to-r from-teal-300 via-blue-400 to-purple-500 shadow-lg dark:from-teal-500 dark:via-blue-600 dark:to-purple-500 hover:scale-105 " />
          </h2>

          <div className="flex gap-4 items-center">
            {/* Refresh Button  */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={refreshAdvice}
                    className="flex items-center justify-center rounded-full p-4 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg hover:shadow-cyan-400/50 hover:scale-110 transition-transform duration-300 dark:from-blue-500 dark:to-teal-400"
                  >
                    <RefreshCw
                      size={32}
                      className="text-white dark:text-gray-200"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-slate-700 dark:text-slate-300 font-bold rounded-full">
                  <p>Refresh Advice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Chatbot Component */}
            <Chatbot
              totalBudget={totalBudget}
              totalIncome={totalIncome}
              totalSpend={totalSpend}
              largestBudget={largestBudget}
              highestExpense={highestExpense}
              totalDebt={totalDebt}
              debtToIncomeRatio={debtToIncomeRatio}
              budgetList={budgetList}
              expenseList={expenseList}
            />
          </div>
        </div>
        <div className="p-6 rounded-3xl border bg-white bg-opacity-70 shadow-inner dark:bg-gray-800 dark:bg-opacity-90">
          {financialAdvice ? (
            <div className="text-lg text-gray-600 dark:text-gray-300">
              {parse(financialAdvice)}
            </div>
          ) : (
            <p className="text-lg italic text-gray-500 animate-pulse dark:text-gray-400">
              Loading financial advice...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBudgetAdvisor;
