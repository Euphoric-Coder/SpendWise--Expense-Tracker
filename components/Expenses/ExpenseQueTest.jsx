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
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [canStoreExtra, setCanStoreExtra] = useState(false);
  const [isPendingRestored, setIsPendingRestored] = useState(false);
  const [isSavingExtra, setIsSavingExtra] = useState(false);

  // Storage keys
  const storageKey = `pendingExpense_${budgetId}`;
  const extraStorageKeys = [
    `pendingExpense_${budgetId}_1`,
    `pendingExpense_${budgetId}_2`,
    `pendingExpense_${budgetId}_3`,
  ];

  useEffect(() => {
    if (!budgetId) return;

    const savedExpense = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (savedExpense.name || savedExpense.amount) {
      setPendingExpenses([savedExpense]);
    }

    const extraExpenses = extraStorageKeys
      .map((key) => JSON.parse(localStorage.getItem(key) || "{}"))
      .filter((exp) => exp.name || exp.amount);

    setPendingExpenses((prev) => [...prev, ...extraExpenses]);
  }, [budgetId]);

  // Prevent overwriting primary storage when saving as extra
  const handleInputChange = (field, value) => {
    if (isSavingExtra) return;

    const updatedExpense = {
      name: field === "name" ? value : name,
      amount: field === "amount" ? value : amount,
      description: field === "description" ? value : description,
      dueDate: field === "dueDate" ? value : dueDate,
    };

    if (field === "name") setName(value);
    if (field === "amount") setAmount(value);
    if (field === "description") setDescription(value);
    if (field === "dueDate") setDueDate(value);

    // Overwrite storageKey only if it wasn't restored
    if (!isPendingRestored) {
      localStorage.setItem(storageKey, JSON.stringify(updatedExpense));
    }
  };

  const saveExtraPendingExpense = () => {
    if (!name || !amount) return;

    setIsSavingExtra(true); // Prevent overwriting while saving

    const newExpense = { name, amount, description, dueDate };

    for (const key of extraStorageKeys) {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(newExpense));
        setPendingExpenses((prev) => [...prev, newExpense]);

        setTimeout(() => {
          setIsSavingExtra(false); // Reset flag after saving
          setName("");
          setAmount("");
          setDescription("");
          setDueDate(getISTDate());
        }, 100);

        return;
      }
    }

    alert("Maximum of 3 extra pending expenses reached.");
    setIsSavingExtra(false);
  };

  const insertPendingExpense = (index) => {
    const expense = pendingExpenses[index];
    if (expense) {
      setName(expense.name || "");
      setAmount(expense.amount || "");
      setDescription(expense.description || "");
      setDueDate(expense.dueDate ? new Date(expense.dueDate) : getISTDate());

      setIsPendingRestored(true); // Prevent overwriting storageKey

      clearPendingExpense(index);
    }
  };

  const clearPendingExpense = (index) => {
    console.log(index)
    if (index === 0) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.removeItem(extraStorageKeys[index - 1]);
    }

    setPendingExpenses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-2 border-blue-200 p-8 rounded-3xl bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl relative overflow-hidden">
      {/* Pending Expense Alerts */}
      {pendingExpenses.length > 0 &&
        pendingExpenses.map((storedExpense, index) => (
          <Alert
            key={index}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertPendingExpense(index)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Insert
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearPendingExpense(index)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
            </div>
          </Alert>
        ))}

      {/* Expense Name Input */}
      <div className="mt-6">
        <h3 className="budg-text">Expense Name</h3>
        <Input
          type="text"
          placeholder="e.g. Home Decor"
          className="exp-input-field"
          value={name}
          onChange={(e) => handleInputChange("name", e.target.value)}
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
          onChange={(e) => handleInputChange("amount", e.target.value)}
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
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>

      {/* Due Date Input */}
      <div className="mt-6">
        <h3 className="budg-text">Due Date</h3>
        <Input
          type="date"
          className="exp-input-field"
          value={format(dueDate, "yyyy-MM-dd")}
          onChange={(e) =>
            handleInputChange("dueDate", new Date(e.target.value))
          }
        />
      </div>

      {/* Save as Extra Button */}
      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={saveExtraPendingExpense}>
          Save as Extra Pending Expense
        </Button>
        <Button>Add New Expense</Button>
      </div>
    </div>
  );
};

export default ExpenseQueTest;
