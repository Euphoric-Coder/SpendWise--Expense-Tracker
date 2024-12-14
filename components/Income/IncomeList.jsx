"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Incomes, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import CreateIncomes from "./CreateIncome";
import IncomeItem from "./IncomeItem";
import { Skeleton } from "../ui/skeleton";
import DeleteIncome from "./DeleteIncome";
import { Button } from "../ui/button";
import Link from "next/link";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const [upcomingItems, setUpcomingItems] = useState([])
  const [currentItems, setCurrentItems] = useState([])
  const { user } = useUser();

  useEffect(() => {
    user && getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    const result = await db
      .select({
        ...getTableColumns(Incomes),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Incomes)
      .leftJoin(Expenses, eq(Incomes.id, Expenses.budgetId))
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));

    // Separate items into "upcoming" and "current" arrays
    const upcomingItems = result.filter((item) => item.status === "upcoming");
    const currentItems = result.filter((item) => item.status === "current");

    setIncomelist(result);
    setUpcomingItems(upcomingItems);
    setCurrentItems(currentItems);
  };

  return (
    <div className="mt-7">
      <div className="my-5 flex justify-between items-center">
        <h2 className="p-2 font-extrabold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-sky-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
          My Income Category Sources
        </h2>
        <Link
          href="/dashboard/budgets"
          className="flex gap-3 justify-center md:justify-between"
        >
          <Button className="rounded-full text-md bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-400 dark:from-blue-600 dark:via-cyan-500 dark:to-teal-500 text-white px-6 py-3 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform">
            Go to Budget Tab
          </Button>
          <DeleteIncome
            incomeData={incomelist}
            refreshData={() => getIncomelist()}
          />
        </Link>
      </div>
      <div className="mb-7 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
        <CreateIncomes refreshData={() => getIncomelist()} />
      </div>
      <h2 className="mb-5 p-2 font-extrabold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-tr from-cyan-600 via-blue-600 to-sky-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
        Ongoing Incomes
      </h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mb-10">
        {currentItems?.length > 0
          ? currentItems.map((income, index) => (
              <IncomeItem
                income={income}
                refreshData={() => getIncomelist()}
                key={`ongoing-${index}`}
              />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div key={index}>
                <IncomeSkeleton />
              </div>
            ))}
      </div>
      <h2 className="mb-5 p-2 font-extrabold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-tr from-cyan-600 via-blue-600 to-sky-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
        Upcoming Recurring Incomes
      </h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mb-5">
        {upcomingItems?.length > 0
          ? upcomingItems.map((income, index) => (
              <IncomeItem
                income={income}
                refreshData={() => getIncomelist()}
                key={`upcoming-${index}`}
              />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div key={index}>
                <IncomeSkeleton />
              </div>
            ))}
      </div>
    </div>
  );
}

const IncomeSkeleton = () => {
  return (
    <div className>
          <Skeleton className="h-[145px] rounded-3xl bg-gradient-to-r from-teal-500 via-cyan-400 to-green-400 shadow-lg" />
          <div className="mt-2 space-y-2">
            <Skeleton className="h-4 bg-slate-300" />
            <Skeleton className="h-4 w-[75%] bg-slate-300" />
          </div>
        </div>
  );
};

export default IncomeList;
