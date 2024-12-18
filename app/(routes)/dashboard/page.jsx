"use client";

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
        .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
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
    <div className="p-8 space-y-8">
      {/* Greeting Section Container */}
      <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-3xl shadow-2xl relative overflow-hidden transition-transform transform hover:scale-105 duration-500">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-300 via-teal-300 to-purple-500 opacity-30 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-purple-400 via-indigo-300 to-blue-400 opacity-20 blur-[100px]"></div>
        </div>

        {/* Greeting Section */}
        <div className="relative z-10">
          <h2 className="font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 animate-gradient-text">
            {getGreeting()}, {user?.fullName || "Valued User"}
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Your dashboard is ready. Let’s take control of your expenses today!
          </p>
        </div>
      </div>

      {/* Dashboard Card Section */}
      <div className="relative">
        {/* Add a subtle glow or shadow for the DashboardCard container */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-indigo-100 opacity-30 blur-2xl pointer-events-none"></div>
        <DashboardCard
          budgetList={budgetList}
          incomeList={incomeList}
          expenseList={expensesList}
        />
      </div>
    </div>
  );
};

export default page;
