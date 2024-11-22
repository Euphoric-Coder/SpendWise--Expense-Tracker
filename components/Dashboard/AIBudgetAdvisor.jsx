import { GiveFinancialAdvice } from "@/utils/aiAdvisor";
import { Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

const AIBudgetAdvisor = ({
  totalBudget,
  totalIncome,
  totalSpend,
  largestBudget,
  highestExpense,
  totalDebt,
  debtToIncomeRatio,
}) => {
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    fetchFinancialAdvice();
  }, []);

  const fetchFinancialAdvice = async () => {
    const advice = await GiveFinancialAdvice(
      totalBudget,
      totalIncome,
      totalSpend,
      largestBudget,
      highestExpense,
      totalDebt,
      debtToIncomeRatio
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
    <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
      {/* Financial Advisor Section */}
      <div className="">
        <div className="flex mb-2 flex-row space-x-1 items-center">
          <h2 className="text-md">Finora AI</h2>
          <Sparkles
            className="rounded-full text-white w-10 h-10 p-2
      bg-gradient-to-r
      from-pink-500
      via-red-500
      to-yellow-500
      background-animate"
          />
          <p className="text-lg text-gray-600 font-semibold animate-pulse">
            (Still Working on this feature...)
          </p>
        </div>
        <h2
          className="text-md"
          dangerouslySetInnerHTML={{
            __html: financialAdvice || "Loading financial advice...",
          }}
        ></h2>
      </div>
    </div>
  );
};

export default AIBudgetAdvisor;
