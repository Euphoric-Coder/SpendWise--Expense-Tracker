"use client";

import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { toast } from "sonner";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, CalendarIcon, Eraser } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CSVImportButton from "./CSVImportButton";
import { cn } from "@/lib/utils";
import { formatDate, getISTDate, isSameDate } from "@/utils/utilities";
import { format } from "date-fns";
import RecieptImportButton from "./RecieptImportButton";

const AddExpense = ({
  budgetId,
  refreshData,
  budgetAmount,
  isRecurringBudget,
  frequency,
}) => {
  const { user } = useUser();
  const [name, setname] = useState();
  const [amount, setamount] = useState();
  const [description, setDescription] = useState();
  const [overBudget, setOverBudget] = useState(false);
  const [overBudgetAmount, setOverBudgetAmount] = useState(0);
  const [dueDate, setDueDate] = useState(getISTDate());
  const alertTimeoutRef = useRef(null);


  /**PLAN TO MAINTAIN A QUEING SYSTEM FOR EXPENSES
   * 
   * @todo Add a Queing System for unfinished expense data 
   * @todo After Adding the expense delete it from the que
   * @todo If remained unfinished, prompt the user to either cancel or edit it
   * 
   */
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
      }, 4000);

      return;
    }
    console.log(newTotal);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        description: description,
        createdAt: formatDate(dueDate),
      })
      .returning({ insertedId: Budgets.id });

    setname("");
    setamount("");
    setDescription("");
    setDueDate(getISTDate());
    if (result) {
      refreshData();
      toast.success("New Expense Added");
    }
  };

  const clearData = () => {
    setname("");
    setamount("");
    setDescription("");
    setDueDate(getISTDate());
  };
  return (
    <div className="border-2 border-blue-200 p-8 rounded-3xl bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial Glows Effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-25 blur-3xl animate-spin-slow"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-400 via-indigo-300 to-cyan-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-20 blur-[120px]"></div>
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 flex space-x-4 animate-float">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-lg"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-lg"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg"></div>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col justify-center gap-2 md:flex-row md:justify-between items-center">
        <h2 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-500 dark:from-blue-500 dark:via-indigo-500 dark:to-cyan-400 animate-gradient-text">
          Add Expense
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
          <Button
            onClick={() => clearData()}
            className="individual-expense-btn1 rounded-full"
          >
            <Eraser /> Clear Data
          </Button>
          <div className="flex gap-3">
            <CSVImportButton />
            <RecieptImportButton />
          </div>
        </div>
      </div>

      {/* Over Budget Alert */}
      {overBudget && (
        <Alert
          variant="destructive"
          className="mt-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-400 dark:border-gray-600 shadow-lg p-4 rounded-xl flex items-center hover:shadow-xl transition-transform transform hover:scale-105"
        >
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <AlertTitle className="text-blue-700 dark:text-blue-300 font-bold">
              Error - Over Budget
            </AlertTitle>
            <AlertDescription className="text-blue-600 dark:text-blue-400">
              Adding this expense "<b>{name}</b>" will exceed your budget limit
              by <b>Rs. {overBudgetAmount}</b>!
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Expense Name Input */}
      <div className="mt-6">
        <h3 className="text-blue-700 dark:text-blue-300 font-medium mb-2">
          Expense Name
        </h3>
        <Input
          type="text"
          placeholder="e.g. Home Decor"
          className="exp-input-field focus-visible:ring-blue-400 dark:focus:ring-blue-500 ring-1"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
      </div>

      {/* Expense Amount Input */}
      <div className="mt-6">
        <h3 className="text-blue-700 dark:text-blue-300 font-medium mb-2">
          Expense Amount
        </h3>
        <Input
          type="number"
          placeholder="e.g. Rs.5000"
          className="exp-input-field focus-visible:ring-blue-400 dark:focus:ring-blue-500 ring-1"
          value={amount}
          onChange={(e) => setamount(e.target.value)}
        />
      </div>

      {/* Expense Description Input */}
      <div className="mt-6">
        <h3 className="text-blue-700 dark:text-blue-300 font-medium mb-2">
          Expense Description (Optional)
        </h3>
        <Input
          type="text"
          placeholder="e.g. For decorating the living room"
          className="exp-input-field focus-visible:ring-blue-400 dark:focus:ring-blue-500 ring-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {isRecurringBudget && (
        <div className="mt-6">
          <h3 className="text-blue-700 dark:text-blue-300 font-medium mb-2">
            Due Date (Optional)
          </h3>
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
                // variant={"outline"}
                className={cn(
                  "exp-input-field justify-start focus-visible:ring-blue-400 dark:focus:ring-blue-500 ring-1",
                  isSameDate(dueDate, getISTDate()) && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Add Expense Button */}
      <Button
        onClick={() => addNewExpense()}
        disabled={!(name && amount)}
        className="individual-expense-btn2 mt-5 p-2 rounded-3xl"
      >
        Add New Expense
      </Button>
    </div>
  );
};

export default AddExpense;
