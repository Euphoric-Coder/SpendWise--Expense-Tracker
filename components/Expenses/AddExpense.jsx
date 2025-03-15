"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses, Transactions } from "@/utils/schema";
import { toast } from "sonner";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, CalendarIcon, Eraser, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CSVImportButton from "./CSVImportButton";
import { cn } from "@/lib/utils";
import {
  formatDate,
  getISTDate,
  getISTDateTime,
  isSameDate,
  nextRecurringDate,
} from "@/utils/utilities";
import { format } from "date-fns";
import RecieptImportButton from "./RecieptImportButton";
import BudgetList from "../Budgets/BudgetList";

const AddExpense = ({
  budgetId,
  refreshData,
  budgetAmount,
  isRecurringBudget,
  frequency,
}) => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [overBudget, setOverBudget] = useState(false);
  const [overBudgetAmount, setOverBudgetAmount] = useState(0);
  const [dueDate, setDueDate] = useState(getISTDate());
  const [pendingExpense, setPendingExpense] = useState(false);
  const [clearPendingAlert, setClearPendingAlert] = useState(false);
  const [budgetDetails, setBudgetDetails] = useState([]);
  const alertTimeoutRef = useRef(null);

  // Generate a unique key for each budget's pending expense
  const storageKey = `pendingExpense_${budgetId}`;

  useEffect(() => {
    const storedExpense = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (storedExpense.name || storedExpense.amount) {
      setName(storedExpense.name || "");
      setAmount(storedExpense.amount || "");
      setDescription(storedExpense.description || "");
      setDueDate(
        storedExpense.dueDate ? new Date(storedExpense.dueDate) : getISTDate()
      );
      setPendingExpense(true);
    }

    fetchBudgetDetails();
  }, [budgetId]); // Only re-run when budgetId changes

  const handleInputChange = (field, value) => {
    const updatedExpense = {
      name: field === "name" ? value : name,
      amount: field === "amount" ? value : amount,
      description: field === "description" ? value : description,
      dueDate: field === "dueDate" ? value : dueDate,
    };
    localStorage.setItem(storageKey, JSON.stringify(updatedExpense));
  };

  const clearPendingExpense = () => {
    localStorage.removeItem(storageKey);
    setPendingExpense(false);
    setName("");
    setAmount("");
    setDescription("");
    setDueDate(getISTDate());
  };

  // Function to fetch the current budget details
  const fetchBudgetDetails = async () => {
    const budgetDetails = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.id, budgetId));

    setBudgetDetails(budgetDetails);
  };

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

    console.log(result);

    return result[0].totalSpend ?? 0;
  };

  const addNewExpense = async () => {
    // Fetch the current total expenses
    const currentTotal = await fetchTotalExpenses();
    const newTotal = currentTotal + parseFloat(amount);

    if (newTotal >= 0.9 * budgetAmount) {
      // TODO: Send Notification & E-Mail to User
      toast.success("90% of your budget has been spent");
      console.log("90% of your budget has been spent");
      console.log(BudgetList);
    }

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

    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        description: description,
        createdAt: formatDate(dueDate),
      })
      .returning({ insertedId: Expenses.id });

    console.log(result);

    const transaction = await db
      .insert(Transactions)
      .values({
        id: result[0].insertedId,
        referenceId: budgetId,
        type: "expense",
        category: budgetDetails[0].category,
        subCategory: budgetDetails[0].subCategory,
        isRecurring: budgetDetails[0].budgetType === "recurring",
        frequency:
          budgetDetails[0].budgetType === "recurring"
            ? budgetDetails[0].frequency
            : null,
        nextRecurringDate:
          budgetDetails[0].budgetType === "recurring"
            ? nextRecurringDate(
                budgetDetails[0].createdAt.split(" ")[0],
                budgetDetails[0].frequency
              )
            : null,
        status:
          budgetDetails[0].budgetType === "recurring"
            ? isSameDate(
                formatDate(dueDate) ? formatDate(dueDate) : getISTDate(),
                getISTDate()
              )
              ? "active"
              : "upcoming"
            : "active",
        name: name,
        amount: amount,
        createdBy: budgetDetails[0].createdBy,
        createdAt: getISTDateTime(),
      })
      .returning({ insertedId: Transactions.id });

    setName("");
    setAmount("");
    setDescription("");
    setDueDate(getISTDate());
    if (result) {
      refreshData();
      localStorage.removeItem(storageKey);
      setPendingExpense(false);
      toast.success("New Expense Added");
    }
  };

  const clearData = () => {
    localStorage.removeItem(storageKey);
    setPendingExpense(false);
    setName("");
    setAmount("");
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
            onClick={() => {
              if (pendingExpense) {
                setClearPendingAlert(true);
              } else {
                clearData();
              }
            }}
            className="expense-btn1 rounded-full"
          >
            <Eraser /> Clear Data
          </Button>
          <div className="flex gap-3">
            <CSVImportButton />
            <RecieptImportButton />
          </div>
        </div>
      </div>

      <AlertDialog open={clearPendingAlert}>
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
              This action cannot be undone. This will permanently delete your
              income <strong>""</strong> and all of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Dialog Footer */}
          <AlertDialogFooter className="flex gap-4 mt-6">
            <AlertDialogCancel
              onClick={() => setClearPendingAlert(false)}
              className="w-full py-3 rounded-2xl border border-blue-300 bg-gradient-to-r from-white to-blue-50 text-blue-600 font-semibold shadow-sm hover:shadow-md hover:bg-blue-100 transition-transform transform hover:scale-105 active:scale-95 dark:border-blue-500 dark:bg-gradient-to-r dark:from-gray-800 dark:to-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 hover:text-indigo-500 dark:hover:text-indigo-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearData();
                setClearPendingAlert(false);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,100,100,0.5)] hover:scale-105 active:scale-95 transition-transform transform dark:bg-gradient-to-r dark:from-red-700 dark:via-red-800 dark:to-red-900 dark:shadow-[0_0_20px_rgba(200,50,50,0.5)] dark:hover:shadow-[0_0_30px_rgba(200,50,50,0.7)]"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {/* Pending Expense Alert */}
      {pendingExpense && (
        <Alert
          variant="warning"
          className="mt-6 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border border-yellow-400 dark:border-gray-600 shadow-lg p-4 rounded-xl flex items-center hover:shadow-xl transition-transform transform hover:scale-105"
        >
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
          <div>
            <AlertTitle className="text-yellow-700 dark:text-yellow-300 font-bold">
              Pending Expense
            </AlertTitle>
            <AlertDescription className="text-yellow-600 dark:text-yellow-400">
              You have an unfinished expense: "<b>{name}</b>". Would you like to
              continue?
            </AlertDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={clearPendingExpense}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Dismiss
          </Button>
        </Alert>
      )}

      {/* Expense Name Input */}
      <div className="mt-6">
        <h3 className="budg-text">Expense Name</h3>
        <Input
          type="text"
          placeholder="e.g. Home Decor"
          className="exp-input-field focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px]"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            handleInputChange("name", e.target.value);
          }}
        />
      </div>

      {/* Expense Amount Input */}
      <div className="mt-6">
        <h3 className="budg-text">Expense Amount</h3>
        <Input
          type="number"
          placeholder="e.g. Rs.5000"
          className="exp-input-field focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px]"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            handleInputChange("amount", e.target.value);
          }}
        />
      </div>

      {/* Expense Description Input */}
      <div className="mt-6">
        <h3 className="budg-text">Expense Description (Optional)</h3>
        <Input
          type="text"
          placeholder="e.g. For decorating the living room"
          className="exp-input-field focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px]"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleInputChange("description", e.target.value);
          }}
        />
      </div>

      {isRecurringBudget && (
        <div className="mt-6">
          <h3 className="budg-text">Due Date (Optional)</h3>
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
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
                onSelect={(date) => {
                  setDueDate(date);
                  handleInputChange("dueDate", date.toISOString());
                }}
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
        className="expense-btn2 mt-5 p-2 rounded-3xl"
      >
        Add New Expense
      </Button>
    </div>
  );
};

export default AddExpense;
