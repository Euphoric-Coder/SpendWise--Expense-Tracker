"use client";

import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import BudgetItem from "./BudgetItem";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@clerk/nextjs";
const BudgetList = () => {
  const [BudgetList, setBudgetList] = useState([]);
  const {user} = useUser();

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    try {
      const response = await fetch("/api/budgets");
      const data = await response.json();
      
      setBudgetList(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
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
