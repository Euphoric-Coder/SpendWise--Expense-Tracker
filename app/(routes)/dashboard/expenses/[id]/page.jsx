"use client";

import AddExpense from "@/components/Expenses/AddExpense";
import BudgetItem from "@/components/Budgets/BudgetItem";
import ExpenseTable from "@/components/Expenses/ExpenseTable";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ExpensesDashboard = ({ params }) => {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  useEffect(() => {
    user && getBudgetInfo();
    getListOfExpenses();
  }, [user]);
  const route = useRouter();
  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, params.id))
      .groupBy(Budgets.id);
    getListOfExpenses();
    setBudgetInfo(result[0]);
  };

  const getListOfExpenses = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const deleteBudget = async () => {
    const deleteExpenseItems = await db
      .delete(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .returning();

    if (deleteExpenseItems) {
      const result = await db
        .delete(Budgets)
        .where(eq(Budgets.id, params.id))
        .returning();
    }
    toast(`Budget "${budgetInfo.name}" has been deleted!`);
    route.replace("/dashboard/budgets");
  };
  return (
    <div className="p-10 bg-gradient-to-b from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl">
      <h2 className="flex justify-between text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-bl from-purple-600 to-yellow-500 via-blue-500 mb-4">
        My Expenses
        <span className="flex gap-4 items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex gap-2">
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget "{budgetInfo ? budgetInfo.name : ""}"
                  along with all its expenses and remove your data from the
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Link href={"/dashboard/budgets"}>
            <Button>Goto Budgets</Button>
          </Link>
        </span>
      </h2>
      {/* Budget Item and Skeleton Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <Skeleton className="h-[145px] rounded-3xl bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 shadow-lg animate-pulse" />
        )}
        <AddExpense
          budgetId={params.id}
          budgetAmount={budgetInfo ? budgetInfo.amount : 0}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>

      {/* Latest Expenses Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 mb-4">
          Latest Expenses
        </h2>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <ExpenseTable
            expenseList={expensesList}
            refreshData={() => getBudgetInfo()}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpensesDashboard;
