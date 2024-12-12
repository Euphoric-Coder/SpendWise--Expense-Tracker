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
import CsvUpload from "@/components/Expenses/CSVUpload";

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
    toast(`Budget "${budgetInfo.name}" has been deleted!`);
    route.replace("/dashboard/budgets");
  };

  return (
    <div className="p-10 bg-gradient-to-b from-yellow-50 via-orange-50 to-red-50 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-orange-300 via-red-300 to-yellow-300 opacity-30 blur-[80px]"></div>
      </div>

      {/* My Expenses Header */}
      <h2 className="flex justify-between text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 mb-6 animate-gradient-text">
        My Expenses
        <span className="flex gap-4 items-center">
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
                className="flex gap-2 items-center bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:from-orange-500 hover:to-yellow-500 transition-transform transform hover:scale-105"
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
            <Button className="px-4 py-2 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-orange-500 hover:to-yellow-500 transition-transform transform hover:scale-105">
              Go to Budgets
            </Button>
          </Link>
        </span>
      </h2>

      {/* Budget Item and Skeleton Placeholder */}
      <div className="grid grid-cols-1 xl:grid-cols-2 mt-8 gap-6">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <Skeleton className="h-[145px] rounded-3xl bg-gradient-to-r from-yellow-200 via-orange-300 to-red-300 shadow-lg animate-pulse" />
        )}
        <AddExpense
          budgetId={params.id}
          budgetAmount={budgetInfo ? budgetInfo.amount : 0}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>

      {/* Latest Expenses Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 mb-6 animate-gradient-text">
          Latest Expenses
        </h2>
        <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl shadow-md p-6 border border-orange-200">
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
