"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CalendarIcon, XCircle, PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getISTDate, isSameDate } from "@/utils/utilities";

const ExpenseQueTest = ({ budgetId }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(getISTDate());
  const [pendingExpense, setPendingExpense] = useState(false);
  const [storedExpense, setStoredExpense] = useState(null);

  // Generate a unique key for each budget's pending expense
  const storageKey = `pendingExpense_${budgetId}`;

  useEffect(() => {
    if (!budgetId) return; // Ensure budgetId is available before fetching

    const savedExpense = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (savedExpense.name || savedExpense.amount) {
      setStoredExpense(savedExpense); // Store data without loading it into inputs
      setPendingExpense(true);
    }
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

  const insertPendingExpense = () => {
    if (storedExpense) {
      setName(storedExpense.name || "");
      setAmount(storedExpense.amount || "");
      setDescription(storedExpense.description || "");
      setDueDate(
        storedExpense.dueDate ? new Date(storedExpense.dueDate) : getISTDate()
      );
      setPendingExpense(false); // Remove the alert after inserting
    }
  };

  const clearPendingExpense = () => {
    localStorage.removeItem(storageKey);
    setPendingExpense(false);
    setStoredExpense(null);
  };

  return (
    <div className="border-2 border-blue-200 p-8 rounded-3xl bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl relative overflow-hidden">
      {/* Pending Expense Alert */}
      {pendingExpense && storedExpense && (
        <Alert
          variant="warning"
          className="mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border border-yellow-400 dark:border-gray-600 shadow-lg p-4 rounded-xl flex items-center hover:shadow-xl transition-transform transform hover:scale-105"
        >
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
          <div>
            <AlertTitle className="text-yellow-700 dark:text-yellow-300 font-bold">
              Pending Expense
            </AlertTitle>
            <AlertDescription className="text-yellow-600 dark:text-yellow-400">
              You have an unfinished expense: "<b>{storedExpense.name}</b>".
              Would you like to restore it?
            </AlertDescription>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={insertPendingExpense}>
              <PlusCircle className="h-4 w-4 mr-1" />
              Insert
            </Button>
            <Button variant="outline" size="sm" onClick={clearPendingExpense}>
              <XCircle className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
          </div>
        </Alert>
      )}

      {/* Expense Name Input */}
      <div className="mt-6">
        <h3 className="budg-text">Expense Name</h3>
        <Input
          type="text"
          placeholder="e.g. Home Decor"
          className="exp-input-field"
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
          className="exp-input-field"
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
          className="exp-input-field"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleInputChange("description", e.target.value);
          }}
        />
      </div>

      {/* Due Date Input */}
      <div className="mt-6">
        <h3 className="budg-text">Due Date (Optional)</h3>
        <Popover modal>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "exp-input-field justify-start ring-1",
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
    </div>
  );
};

export default ExpenseQueTest;
