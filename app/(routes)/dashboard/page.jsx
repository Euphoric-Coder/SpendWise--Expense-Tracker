"use client";

import AIBudgetAdvisor from "@/components/Dashboard/AIBudgetAdvisor";
import BarChartDashboard from "@/components/Dashboard/DashboardBarChart";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses, Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import React, { useEffect, useState } from "react";

const page = () => {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    user && getBudgetList();
  }, [user]);
  /**
   * used to get budget List
   */
  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),

        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    setBudgetList(result);
    getAllExpenses();
    getIncomeList();
  };

  /**
   * Get Income stream list
   */
  const getIncomeList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(
            Number
          ),
        })
        .from(Incomes)
        .groupBy(Incomes.id); // Assuming you want to group by ID or any other relevant column

      setIncomeList(result);
    } catch (error) {
      console.error("Error fetching income list:", error);
    }
  };

  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour > 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18 && currentHour > 12) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  return (
    <div className="p-8">
      <h2 className="font-bold text-3xl">
        {getGreeting()}, {user?.fullName}
      </h2>
      <p className="text-gray-500">
        Here's what happening with your money, Let's Manage your expense
      </p>
      {/* {budgetList.map((budget, index) => (
        <div key={index}>
          <div className="flex justify-between">
            <h2 className="font-bold text-3xl">{budget.name}</h2>
            <div className="flex gap-4">
              <p className="text-gray-500">Total Spend: {budget.totalSpend}</p>
              <p className="text-gray-500">Total Item: {budget.totalItem}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-500">Total Spend: {budget.totalSpend}</p>
            <p className="text-gray-500">Total Item: {budget.totalItem}</p>
          </div>
        </div>
      ))}
      {incomeList.map((income, index) => (
        <div key={index}>
          <div className="flex justify-between">
            <h2 className="font-bold text-3xl">{income.name}</h2>
            <div className="flex gap-4">
              <p className="text-gray-500">Total Spend: {income.totalAmount}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-500">Total Spend: {income.totalAmount}</p>
          </div>
        </div>
      ))} */}
      {/* {expensesList.map((expense, index) => (
        <div key={index}>
          <div className="flex justify-between">
            <h2 className="font-bold text-3xl">{expense.name}</h2>
            <div className="flex gap-4">
              <p className="text-gray-500">Total Spend: {expense.amount}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-500">Total Spend: {expense.amount}</p>
          </div>
        </div>
      ))} */}

      <DashboardCard
        budgetList={budgetList}
        incomeList={incomeList}
        expensesList={expensesList}
      />

      <BarChartDashboard budgetList={budgetList}/>
      
    </div>
  );
};

export default page;
