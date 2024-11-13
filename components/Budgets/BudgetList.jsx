"use client";

import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { db } from "@/utils/dbConfig";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";
import { Skeleton } from "../ui/skeleton";
const BudgetList = () => {
  const [BudgetList, setBudgetList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

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
      .groupBy(Budgets.id);
    setBudgetList(result);
  };
  return (
    <div className="mt-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
        <CreateBudget refreshData={() => getBudgetList()} />
        {BudgetList?.length > 0
          ? BudgetList.map((budget, index) => (
              <BudgetItem key={index} budget={budget} isBudget={true} />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index}>
                <Skeleton className="h-[145px] rounded-3xl bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 shadow-lg" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 bg-slate-300" />
                  <Skeleton className="h-4 w-[75%] bg-slate-300" />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default BudgetList;
