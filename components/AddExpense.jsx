"use client";

import React, { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { toast } from "sonner";
import moment from "moment";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const AddExpense = ({ budgetId, refreshData, budgetAmount }) => {
  const {user } = useUser();
  const [name, setname] = useState();
  const [amount, setamount] = useState();
  const [overBudget, setOverBudget] = useState(false);
  const [overBudgetAmount, setOverBudgetAmount] = useState(0);
  const alertTimeoutRef = useRef(null);

  // Function to fetch the total expenses for the specified budget
  const fetchTotalExpenses = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, budgetId))
      .groupBy(Budgets.id);

    return result[0].totalSpend ?? 0;
  };

  const addNewExpense = async () => {
    // Fetch the current total expenses
    const currentTotal = await fetchTotalExpenses();
    const newTotal = currentTotal + parseFloat(amount);

    // Check if adding this expense will exceed the budget
    if (newTotal > budgetAmount) {
      setOverBudget(true);
      setOverBudgetAmount(newTotal - budgetAmount);

      // Clear any existing timeout to avoid conflicts
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);

      // Set timeout to hide alert after 3 seconds
      alertTimeoutRef.current = setTimeout(() => {
        setOverBudget(false);
        setOverBudgetAmount(0);
      }, 3000);

      return;
    }
    console.log(newTotal);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdAt: moment().format("DD/MM/yyy"),
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
      refreshData();
      toast("New Expense Added");
    }
  };
  return (
    <div className="border-2 border-indigo-100 p-6 rounded-3xl bg-gradient-to-b from-white via-blue-50 to-indigo-50 shadow-lg">
      <h2 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        Add Expense
      </h2>
      {overBudget && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <div>
            <AlertTitle>Error - Going Over Budget</AlertTitle>
            <AlertDescription>
              Adding this expense "{name}" will exceed your budget limit by Rs.
              {overBudgetAmount}!
            </AlertDescription>
          </div>
        </Alert>
      )}
      <div className="mt-4">
        <h3 className="text-gray-700 font-medium my-1">Expense Name</h3>
        <Input
          type="text"
          placeholder="e.g. Home Decor"
          className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"
          onChange={(e) => setname(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-gray-700 font-medium my-1">Expense Amount</h3>
        <Input
          type="number"
          placeholder="e.g. Rs.5000"
          className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"
          onChange={(e) => setamount(e.target.value)}
        />
      </div>
      <Button
        onClick={() => addNewExpense()}
        disabled={!(name && amount)}
        className="mt-5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-semibold p-3 rounded-xl shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition duration-200 disabled:opacity-50"
      >
        Add New Expense
      </Button>
    </div>
  );
};

export default AddExpense;
