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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { PenBox, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EditBudget from "@/components/Budgets/EditBudget";

const ExpensesDashboard = ({ params }) => {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    user && getBudgetInfo();
    // getListOfExpenses();
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
    setBudgetInfo(result[0]);
    getListOfExpenses();
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
    toast.success(`Budget "${budgetInfo.name}" has been deleted!`);
    route.replace("/dashboard/budgets");
  };

  return (
    <div className="p-10 bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-300 via-indigo-300 to-cyan-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-30 blur-[80px]"></div>
      </div>

      {/* My Expenses Header */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h2 className="flex justify-between text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400 mb-6 animate-gradient-text">
          My Budget Expenses
        </h2>

        <div className="flex gap-4 items-center justify-center">
          {/* Edit Budget Button */}
          <EditBudget
            budgetInfo={budgetInfo}
            refreshData={() => getBudgetInfo()}
          />

          {/* Delete Budget Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="individual-expense-btn1 rounded-2xl"
              >
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-blue-50 to-cyan-200 dark:from-gray-800 dark:via-gray-900 dark:to-blue-800 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,150,255,0.3)] dark:shadow-[0_0_40px_rgba(0,75,150,0.5)] w-[95%] max-w-lg">
              {/* Background Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-blue-500 via-blue-400 to-transparent dark:from-blue-900 dark:via-gray-800 dark:to-transparent opacity-25 blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-cyan-400 via-blue-300 to-transparent dark:from-cyan-800 dark:via-blue-900 dark:to-transparent opacity-30 blur-[120px]"></div>
              </div>

              {/* Dialog Header */}
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 dark:from-blue-300 dark:via-cyan-400 dark:to-blue-500">
                  Are you absolutely sure to delete?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  This action cannot be undone. This will permanently delete
                  your income <strong>"{budgetInfo?.name}"</strong> and all of
                  its associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {/* Dialog Footer */}
              <AlertDialogFooter className="flex gap-4 mt-6">
                <AlertDialogCancel className="w-full py-3 rounded-2xl border border-blue-300 bg-gradient-to-r from-white to-blue-50 text-blue-600 font-semibold shadow-sm hover:shadow-md hover:bg-blue-100 transition-transform transform hover:scale-105 active:scale-95 dark:border-blue-500 dark:bg-gradient-to-r dark:from-gray-800 dark:to-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 hover:text-indigo-500 dark:hover:text-indigo-200">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteBudget()}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,100,100,0.5)] hover:scale-105 active:scale-95 transition-transform transform dark:bg-gradient-to-r dark:from-red-700 dark:via-red-800 dark:to-red-900 dark:shadow-[0_0_20px_rgba(200,50,50,0.5)] dark:hover:shadow-[0_0_30px_rgba(200,50,50,0.7)]"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Go to Budgets Button */}
          <Link href={"/dashboard/budgets"}>
            <Button className="individual-expense-btn1 rounded-2xl">
              Go to Budgets
            </Button>
          </Link>
        </div>
      </div>
      {/* Budget Item and Skeleton Placeholder */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 mt-8 gap-6">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <Skeleton className="h-[145px] rounded-3xl bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 shadow-lg animate-pulse" />
        )}
        <AddExpense
          budgetId={params.id}
          budgetAmount={budgetInfo ? budgetInfo.amount : 0}
          user={user}
          isRecurringBudget={
            budgetInfo?.budgetType === "recurring" ? true : false
          }
          frequency={budgetInfo?.frequency}
          refreshData={() => getBudgetInfo()}
        />
      </div>

      {/* Latest Expenses Section */}
      <div className="mt-12">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tl from-blue-600 to-teal-400 dark:from-purple-400 dark:to-pink-400 mb-10">
          Latest Expenses ({expensesList.length} Items)
        </h1>
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-md px-2 py-8 border border-blue-200 dark:border-gray-600">
          <ExpenseTable
            expenseList={expensesList}
            refreshData={() => getBudgetInfo()}
            isRecurringBudget={
              budgetInfo?.budgetType === "recurring" ? true : false
            }
            frequency={budgetInfo?.frequency}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpensesDashboard;
