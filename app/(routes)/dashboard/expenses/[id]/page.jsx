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
                className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 dark:from-blue-500 dark:via-purple-600 dark:to-pink-500 rounded-xl shadow-xl hover:from-blue-500 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-transform transform hover:scale-110 hover:backdrop-brightness-125 dark:hover:backdrop-brightness-110"
              >
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget "<b>{budgetInfo?.name}</b>" along with all
                  its expenses and remove your data from the servers.
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

          {/* Go to Budgets Button */}
          <Link href={"/dashboard/budgets"}>
            <Button className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 dark:from-blue-500 dark:via-purple-600 dark:to-pink-500 rounded-xl shadow-xl hover:from-blue-500 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-transform transform hover:scale-110 hover:backdrop-brightness-125 dark:hover:backdrop-brightness-110">
              Go to Budgets
            </Button>
          </Link>
        </div>
      </div>

      {/* Budget Item and Skeleton Placeholder */}
      <div className="grid grid-cols-1 xl:grid-cols-2 mt-8 gap-6">
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
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-md p-6 border border-blue-200 dark:border-gray-600">
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
