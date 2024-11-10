'use client'

import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { db } from "@/utils/dbConfig";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";
const BudgetList = () => {

  const [BudgetList, setBudgetList] = useState([])
  const {user} = useUser();

  useEffect(() => {
    user&&getBudgetList()
  }, [user])
  
  const getBudgetList=async()=>{
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend:sql `sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql `count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .groupBy(Budgets.id);

    setBudgetList(result)
  }
  return (
    <div className="mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <CreateBudget />
        {BudgetList.map((budget, index) => (
          <BudgetItem key={index} budget={budget} />
        ))}
      </div>
    </div>
  );
};

export default BudgetList;
