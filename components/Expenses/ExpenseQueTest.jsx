"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses, ExpenseQue } from "@/utils/schema";
import { toast } from "sonner";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, CalendarIcon, Eraser, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatDate, getISTDate } from "@/utils/utilities";
import { format } from "date-fns";

const ExpenseQueTest = ({
  budgetId,
  refreshData,
  budgetAmount,
  isRecurringBudget,
}) => {
  const { user } = useUser();
  const [name, setname] = useState("");
  const [amount, setamount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(getISTDate());
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  // Fetch pending expenses on mount
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchPendingExpenses();
    }
  }, [user]);

  // Fetch pending expenses from ExpenseQue
  const fetchPendingExpenses = async () => {
    const result = await db
      .select()
      .from(ExpenseQue)
      .where(eq(ExpenseQue.budgetId, budgetId));

    setPendingExpenses(result);
  };

  // Save or update unfinished expense in ExpenseQue
  const saveToQueue = async () => {
    if (!name || !amount) return; // Don't save if empty

    // Check if the expense already exists in the queue
    const existingExpense = await db
      .select()
      .from(ExpenseQue)
      .where(eq(ExpenseQue.budgetId, budgetId))
      .where(eq(ExpenseQue.name, name));

    if (existingExpense.length > 0) {
      // Update existing expense
      await db
        .update(ExpenseQue)
        .set({ amount, description, initiatedOn: new Date().toISOString() })
        .where(eq(ExpenseQue.id, existingExpense[0].id));
    } else {
      // Insert new expense into the queue
      await db.insert(ExpenseQue).values({
        name,
        amount,
        description,
        budgetId,
        initiatedOn: new Date().toISOString(),
      });
    }

    toast.info("Expense saved as draft.");
    fetchPendingExpenses();
  };

  // Remove a single pending expense from queue
  const removePendingExpense = async (expenseId) => {
    await db.delete(ExpenseQue).where(eq(ExpenseQue.id, expenseId));
    setPendingExpenses(pendingExpenses.filter((exp) => exp.id !== expenseId));
    toast.success("Pending expense deleted.");
  };

  // Load a pending expense into input fields instead of directly adding it
  const loadPendingExpense = (expense) => {
    setname(expense.name);
    setamount(expense.amount);
    setDescription(expense.description);
    setSelectedExpenseId(expense.id);
  };

  // Submit the loaded expense to Expenses table
  const submitExpense = async () => {
    if (!name || !amount) {
      toast.error("Please enter a name and amount.");
      return;
    }

    await db.insert(Expenses).values({
      name,
      amount,
      description,
      budgetId,
      createdAt: formatDate(dueDate),
    });

    // Remove from queue if it was loaded from pending
    if (selectedExpenseId) {
      await removePendingExpense(selectedExpenseId);
      setSelectedExpenseId(null);
    }

    refreshData();
    clearInputFields();
    toast.success("Expense added successfully.");
  };

  // Clear input fields
  const clearInputFields = () => {
    setname("");
    setamount("");
    setDescription("");
    setDueDate(getISTDate());
    setSelectedExpenseId(null);
  };

  return (
    <div className="border-2 border-blue-200 p-8 rounded-3xl bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl relative overflow-hidden">
      {/* Alert for pending expenses */}
      {pendingExpenses.length > 0 && (
        <Alert className="mb-4 bg-yellow-100 border-yellow-400 text-yellow-800">
          <AlertCircle className="mr-2 h-5 w-5" />
          <div>
            <AlertTitle>Pending Expenses</AlertTitle>
            <AlertDescription>
              You have {pendingExpenses.length} unsaved expenses. Click to edit
              or submit.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Expense Form */}
      <h2 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-500 dark:from-blue-500 dark:via-indigo-500 dark:to-cyan-400">
        Add Expense
      </h2>

      {/* Name Input */}
      <div className="mt-4">
        <h3>Expense Name</h3>
        <Input
          type="text"
          placeholder="e.g. Home Decor"
          value={name}
          onChange={(e) => setname(e.target.value)}
          onBlur={saveToQueue}
        />
      </div>

      {/* Amount Input */}
      <div className="mt-4">
        <h3>Expense Amount</h3>
        <Input
          type="number"
          placeholder="e.g. Rs.5000"
          value={amount}
          onChange={(e) => setamount(e.target.value)}
          onBlur={saveToQueue}
        />
      </div>

      {/* Description Input */}
      <div className="mt-4">
        <h3>Expense Description (Optional)</h3>
        <Input
          type="text"
          placeholder="e.g. Living room decor"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={saveToQueue}
        />
      </div>

      {/* Due Date Picker */}
      {isRecurringBudget && (
        <div className="mt-4">
          <h3>Due Date</h3>
          <Popover modal>
            <PopoverTrigger asChild>
              <Button className="exp-input-field">
                <CalendarIcon />
                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar selected={dueDate} onSelect={setDueDate} />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Submit and Clear Buttons */}
      <div className="flex gap-4 mt-6">
        <Button onClick={submitExpense}>Submit Expense</Button>
        <Button variant="outline" onClick={clearInputFields}>
          <Eraser /> Clear Input
        </Button>
      </div>

      {/* Display Pending Expenses with Individual Delete Buttons */}
      {pendingExpenses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Pending Expenses</h3>
          {pendingExpenses.map((expense) => (
            <div
              key={expense.id}
              className="border p-2 rounded-lg mt-2 flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium">{expense.name}</h4>
                <p className="text-sm text-gray-600">Rs. {expense.amount}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => loadPendingExpense(expense)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removePendingExpense(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseQueTest;
