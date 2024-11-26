import { formatCurrencyDashboard } from "@/utils/utilities";
import {
  PiggyBank,
  ReceiptText,
  Wallet,
  Sparkles,
  CircleDollarSign,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import AIBudgetAdvisor from "./AIBudgetAdvisor";

function DashboardCard({ budgetList, incomeList, expenseList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(0);
  const [unusedBudget, setUnusedBudget] = useState(0);
  const [largestBudget, setLargestBudget] = useState(0);
  const [highestExpense, setHighestExpense] = useState(0);
  const [savings, setSavings] = useState(0);
  const [incomeSavedPercentage, setIncomeSavedPercentage] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0 || expenseList.length > 0) {
      CalculateCardInfo();
    }
  }, [budgetList,incomeList, expenseList]);

  const CalculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;
    let largestBudget_ = 0;
    let highestExpense_ = 0;

    // Calculate total budgets and spending
    budgetList.forEach((element) => {
      const budgetAmount = Number(element.amount); // Ensure amount is parsed as a number
      const budgetSpend = Number(element.totalSpend); // Parse spend as well

      totalBudget_ += budgetAmount;
      totalSpend_ += budgetSpend;

      // Track largest budget
      if (budgetAmount > largestBudget_) {
        largestBudget_ = budgetAmount;
      }

      // Track highest expense
      if (budgetSpend > highestExpense_) {
        highestExpense_ = budgetSpend;
      }
    });

    // Calculate total incomes
    incomeList.forEach((element) => {
      totalIncome_ += Number(element.totalAmount); // Parse income as a number
    });

    // Calculate additional metrics
    const unusedBudget_ = Math.max(totalBudget_ - totalSpend_, 0);
    const totalDebt_ = Math.max(totalSpend_ - totalIncome_, 0);
    const debtToIncomeRatio_ =
      totalIncome_ > 0 ? ((totalDebt_ / totalIncome_) * 100).toFixed(1) : 0;
    const savings_ = Math.max(totalIncome_ - totalSpend_, 0);
    const incomeSavedPercentage_ =
      totalIncome_ > 0 ? ((savings_ / totalIncome_) * 100).toFixed(1) : 0;

    // Update states
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
    setTotalIncome(totalIncome_);
    setUnusedBudget(unusedBudget_);
    setTotalDebt(totalDebt_);
    setDebtToIncomeRatio(debtToIncomeRatio_);
    setLargestBudget(largestBudget_);
    setHighestExpense(highestExpense_);
    setSavings(savings_);
    setIncomeSavedPercentage(incomeSavedPercentage_);
  };


  return (
    <div>
      {/* Financial Advisor Section */}
      {totalIncome > 0 && (
          <AIBudgetAdvisor
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
        )}

      {/* Card Section  */}
      <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Budget Summary */}
        <DetailedCard
          title="Budget Summary"
          details={[
            {
              label: "Total Budget",
              value: formatCurrencyDashboard(totalBudget),
            },
            {
              label: "Unused Budget",
              value: formatCurrencyDashboard(unusedBudget),
            },
            {
              label: "Largest Budget",
              value: formatCurrencyDashboard(largestBudget),
            },
          ]}
          icon={<PiggyBank />}
        />

        {/* Expense Summary */}
        <DetailedCard
          title="Expense Summary"
          details={[
            {
              label: "Total Spend",
              value: formatCurrencyDashboard(totalSpend),
            },
            {
              label: "Highest Expense",
              value: formatCurrencyDashboard(highestExpense),
            },
          ]}
          icon={<ReceiptText />}
        />

        {/* Income Summary */}
        <DetailedCard
          title="Income Summary"
          details={[
            {
              label: "Total Income",
              value: formatCurrencyDashboard(totalIncome),
            },
            { label: "Savings", value: formatCurrencyDashboard(savings) },
            { label: "% Income Saved", value: `${incomeSavedPercentage}%` },
          ]}
          icon={<CircleDollarSign />}
        />

        {/* Debt Summary */}
        <DetailedCard
          title="Debt Summary"
          details={[
            { label: "Total Debt", value: formatCurrencyDashboard(totalDebt) },
            {
              label: "Debt-to-Income Ratio",
              value: `${debtToIncomeRatio}%`,
              color: debtToIncomeRatio > 50 ? "text-red-600" : "text-green-600",
            },
            {
              label: "Exceeds Income?",
              value: totalDebt > 0 ? "Yes" : "No",
              color: totalDebt > 0 ? "text-red-600" : "text-green-600",
            },
          ]}
          icon={<Wallet />}
        />
      </div>
    </div>
  );
}

const DetailedCard = ({ title, details, icon }) => (
  <div className="p-8 border-2 border-indigo-200 rounded-3xl shadow-xl flex flex-col space-y-8 bg-gradient-to-b from-white via-blue-50 to-indigo-100 relative overflow-hidden">
    {/* Background Effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 via-teal-400 to-purple-600 opacity-30 blur-3xl"></div>
      <div className="absolute top-20 right-10 w-60 h-60 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-400 opacity-20 blur-[100px]"></div>
    </div>

    {/* Card Header */}
    <div className="flex items-center space-x-6 relative z-10">
      <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-purple-700 p-5 h-20 w-20 rounded-full text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-gradient-text">
        {title}
      </h2>
    </div>

    {/* Card Content */}
    <div className="space-y-6 relative z-10">
      {details.map((detail, index) => (
        <div
          key={index}
          className="flex justify-between items-center text-sm bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-4 rounded-xl shadow-lg hover:shadow-[0px_0px_30px_10px_rgba(0,200,255,0.5)] hover:bg-gradient-to-br hover:from-teal-100 hover:to-blue-200 transition-all duration-300"
        >
          <span className="text-gray-600 font-medium">{detail.label}</span>
          <span
            className={`font-semibold ${
              detail.color ? detail.color : "text-gray-800"
            }`}
          >
            {detail.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardCard;




