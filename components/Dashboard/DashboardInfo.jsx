import { formatCurrencyDashboard } from "@/utils/utilities";
import {
  PiggyBank,
  ReceiptText,
  Wallet,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import AIBudgetAdvisor from "./AIBudgetAdvisor";

function DashboardCard({ budgetList, incomeList, expenseList }) {
  const [dashboardData, setdashboardData] = useState({});
  const dummyData = [
    {
      title: "Total Budget",
      amount: formatCurrencyDashboard(12000),
      weeklyTrend: -3,
      monthlyTrend: 8,
      icon: <Wallet size={30} />,
      alert: {
        type: "warning",
        message: "Higher than usual spending this week!",
      },
    },
    {
      title: "Total Expenses",
      amount: formatCurrencyDashboard(4500),
      weeklyTrend: -3,
      monthlyTrend: 8,
      icon: <TrendingDown size={30} />,
      alert: {
        type: "warning",
        message: "Higher than usual spending this week!",
      },
    },
    {
      title: "Income",
      amount: formatCurrencyDashboard(150000),
      weeklyTrend: 2,
      monthlyTrend: 10,
      icon: <DollarSign size={30} />,
    },
    {
      title: "Total Savings",
      amount: formatCurrencyDashboard(50000),
      weeklyTrend: 5,
      monthlyTrend: 15,
      icon: <PiggyBank size={30} />,
      alert: { type: "stable", message: "Excellent saving habits this month!" },
    },
  ];

  useEffect(() => {
    if (
      budgetList.length > 0 ||
      incomeList.length > 0 ||
      expenseList.length > 0
    ) {
      CalculateCardInfo();
    }
  }, [budgetList, incomeList, expenseList]);

  const CalculateCardInfo = async () => {
    const resp = await fetch("/api/dashboard-stats");
    const dashboardStats = await resp.json();

    setdashboardData(dashboardStats);
  };

  return (
    <div>
      {/* Financial Advisor Section */}
      {/* {dashboardData.totalIncome > 0 && (
        <AIBudgetAdvisor
          totalBudget={dashboardData.totalBudget}
          totalIncome={dashboardData.totalIncome}
          totalSpend={dashboardData.totalSpend}
          largestBudget={dashboardData.largestBudget}
          highestExpense={dashboardData.highestExpense}
          totalDebt={dashboardData.totalDebt}
          debtToIncomeRatio={dashboardData.debtToIncomeRatio}
          budgetList={budgetList}
          expenseList={expenseList}
        />
      )} */}

      {/* Card Section  */}
      <div className="space-y-6 min-h-screen">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#1e3a8a]">
          BudgetEase Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
          {dummyData.map((data, index) => (
            <DashboardStats key={index} {...data} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FinancialHealthCard />
          <AlertsCard />
        </div>
      </div>
    </div>
  );
}

const DashboardStats = ({
  title,
  amount,
  weeklyTrend,
  monthlyTrend,
  icon,
  alert,
  className = "",
}) => (
  <div
    className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-100 via-white backdrop-blur-lg border border-blue-300 dark:border-gray-600 dark:from-gray-800 dark:to-gray-900 dark:via-gray-700 transform transition-transform duration-300 hover:scale-105 ${className}`}
  >
    <div className="flex justify-between items-start">
      {/* Left Section */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-300 mb-2">
          {title}
        </p>
        <h3 className="text-4xl lg:text-5xl font-extrabold text-blue-900 dark:text-blue-400">
          {amount}
        </h3>
        <div className="mt-6 space-y-3">
          {weeklyTrend !== undefined && (
            <p
              className={`flex items-center gap-2 text-base font-medium ${
                weeklyTrend > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {weeklyTrend > 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              Weekly: {weeklyTrend}%
            </p>
          )}
          {monthlyTrend !== undefined && (
            <p
              className={`flex items-center gap-2 text-base font-medium ${
                monthlyTrend > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {monthlyTrend > 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              Monthly: {monthlyTrend}%
            </p>
          )}
        </div>
        {alert && (
          <p
            className={`mt-6 text-md font-semibold ${
              alert.type === "warning"
                ? "text-red-600 dark:text-red-400"
                : alert.type === "stable"
                  ? "text-green-600 dark:text-green-400"
                  : "text-yellow-600 dark:text-yellow-400"
            }`}
          >
            {alert.message}
          </p>
        )}
      </div>

      {/* Icon Section */}
      <div
        className={`p-5 rounded-full flex items-center justify-center shadow-sm transform hover:scale-110 ${
          alert?.type === "warning"
            ? "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-400"
            : "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400"
        }`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const ProgressBar = ({ value, max, className = "" }) => (
  <div
    className={`h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}
  >
    <div
      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 transition-all duration-500"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

const FinancialHealthCard = () => (
  <div
    className="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-900/80 
               backdrop-blur-lg border border-blue-300 dark:border-gray-600 
               rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105"
  >
    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
      Financial Health
    </h2>
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">
            Budget Utilization
          </span>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            43% used
          </span>
        </div>
        <ProgressBar value={4.3} max={10} />
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">
            Debt-to-Income
          </span>
          <span className="font-medium text-red-500 dark:text-red-400">
            757.6%
          </span>
        </div>
        <ProgressBar
          value={75.76}
          max={100}
          className="bg-red-100 dark:bg-red-900"
        />
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">Savings Rate</span>
          <span className="font-medium text-yellow-500 dark:text-yellow-400">
            0%
          </span>
        </div>
        <ProgressBar
          value={0}
          max={100}
          className="bg-yellow-100 dark:bg-yellow-900"
        />
      </div>
    </div>
  </div>
);

const AlertsCard = () => (
  <div
    className="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-900/80 
               backdrop-blur-lg border border-blue-300 dark:border-gray-600 
               rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105"
  >
    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
      Alerts
    </h2>
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/80 dark:to-red-800 rounded-lg shadow-md">
        <AlertCircle
          className="text-red-500 dark:text-red-400 mt-0.5"
          size={20}
        />
        <div>
          <p className="font-medium text-red-700 dark:text-red-300">
            High Debt Level
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Your debt exceeds recommended limits
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/80 dark:to-yellow-800 rounded-lg shadow-md">
        <AlertCircle
          className="text-yellow-500 dark:text-yellow-400 mt-0.5"
          size={20}
        />
        <div>
          <p className="font-medium text-yellow-700 dark:text-yellow-300">
            No Savings
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Consider setting aside some income
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardCard;
