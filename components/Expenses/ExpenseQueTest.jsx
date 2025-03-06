"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { db } from "@/utils/dbConfig";
import { Expenses, ExpenseQue } from "@/utils/schema";
import { toast } from "sonner";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, ArrowDownCircle, Eraser } from "lucide-react";
import { debounce } from "lodash"; // Import lodash debounce

const ExpenseQueTest = ({ budgetId, refreshData }) => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [existingExpense, setExistingExpense] = useState(null); // Store the queued expense
  const [showAlert, setShowAlert] = useState(false); // Show alert only on refresh/revisit
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      checkForPendingExpense();
    }
  }, [user]);

  // ✅ Check if there's an existing expense in the queue
  const checkForPendingExpense = async () => {
    const result = await db
      .select()
      .from(ExpenseQue)
      .where(eq(ExpenseQue.budgetId, budgetId))
      .limit(1);

    if (result.length > 0) {
      setExistingExpense(result[0]);
      setShowAlert(true); // Show alert only when app is revisited
    }
  };

  // ✅ Save or Update Expense in Queue (Prevent Duplicates)
  const saveToQueue = useCallback(
    debounce(async () => {
      if (!name && !amount && !description) return; // Prevent empty saves

      if (existingExpense) {
        // ✅ Update existing expense if values changed
        if (
          existingExpense.name !== name ||
          existingExpense.amount !== amount ||
          existingExpense.description !== description
        ) {
          await db
            .update(ExpenseQue)
            .set({
              name,
              amount,
              description,
              initiatedOn: new Date().toISOString(),
            })
            .where(eq(ExpenseQue.id, existingExpense.id));

          checkForPendingExpense();
        }
      } else {
        // ✅ Insert only if no existing record
        const insertedExpense = await db
          .insert(ExpenseQue)
          .values({
            name,
            amount,
            description,
            budgetId,
            initiatedOn: new Date().toISOString(),
          })
          .returning({ id: ExpenseQue.id });

        setExistingExpense({
          id: insertedExpense[0].id,
          name,
          amount,
          description,
        });
        setShowAlert(true);
      }
    }, 700), // Debounce updates to 700ms
    [name, amount, description, budgetId, existingExpense]
  );

  useEffect(() => {
    saveToQueue();
  }, [name, amount, description]);

  // ✅ Load the saved expense into input fields
  const loadPendingExpense = () => {
    if (existingExpense) {
      setName(existingExpense.name);
      setAmount(existingExpense.amount);
      setDescription(existingExpense.description);
      setSelectedExpenseId(existingExpense.id);
      setShowAlert(false); // Hide alert after loading
    }
  };

  // ✅ Submit the expense and remove it from queue
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
    });

    if (selectedExpenseId) {
      await db.delete(ExpenseQue).where(eq(ExpenseQue.id, selectedExpenseId));
      setExistingExpense(null);
      setSelectedExpenseId(null);
    }

    refreshData();
    clearInputFields();
    toast.success("Expense added successfully.");
  };

  // ✅ Clear input fields and delete from queue
  const clearInputFields = async () => {
    setName("");
    setAmount("");
    setDescription("");

    if (existingExpense) {
      await db.delete(ExpenseQue).where(eq(ExpenseQue.id, existingExpense.id));
      setExistingExpense(null);
      setShowAlert(false);
    }
  };

  return (
    <div className="border-2 border-blue-200 p-8 rounded-3xl bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl relative overflow-hidden">
      {/* ✅ Show Alert Only When App is Refreshed or Revisited */}
      {showAlert && existingExpense && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>
              You have an unsaved expense: <b>{existingExpense.name}</b> - Rs.{" "}
              {existingExpense.amount}
            </p>
          </div>
          <Button onClick={loadPendingExpense} size="sm">
            <ArrowDownCircle className="h-5 w-5" /> Load Expense
          </Button>
        </div>
      )}

      <h2 className="font-bold text-3xl text-cyan-600 dark:text-cyan-400">
        Add Expense
      </h2>

      <div className="mt-4">
        <h3>Expense Name</h3>
        <Input
          type="text"
          placeholder="e.g. Home Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <h3>Expense Amount</h3>
        <Input
          type="number"
          placeholder="e.g. Rs.5000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <h3>Expense Description</h3>
        <Input
          type="text"
          placeholder="e.g. Living room decor"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={submitExpense}>Submit Expense</Button>
        <Button variant="outline" onClick={clearInputFields}>
          <Eraser /> Clear Input
        </Button>
      </div>
    </div>
  );
};

export default ExpenseQueTest;
