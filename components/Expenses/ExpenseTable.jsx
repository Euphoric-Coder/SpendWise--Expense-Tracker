"use client";

import React, { useState } from "react";
import { Trash, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { expenseDateFormat, nextRecurringDate } from "@/utils/utilities";
/**
 * @todo : Add type of expense & implement the feature
 */
const ExpenseTable = ({
  expenseList = [],
  refreshData,
  isRecurringBudget,
  frequency,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedAmount, setEditedAmount] = useState("");

  const deleteExpense = async (expense) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();

    if (result) {
      toast.success(`Expense "${expense.name}" has been deleted!`);
      refreshData();
    }
  };

  const startEditing = (expense) => {
    setEditingExpense(expense);
    setEditedName(expense.name);
    setEditedAmount(expense.amount);
    setIsDialogOpen(true); // Open the dialog when editing starts
  };

  const saveEditedExpense = async () => {
    const result = await db
      .update(Expenses)
      .set({ name: editedName, amount: editedAmount })
      .where(eq(Expenses.id, editingExpense.id))
      .returning();

    if (result) {
      toast.success(`Expense "${editedName}" has been updated!`);
      setIsDialogOpen(false); // Close the dialog after saving
      setEditingExpense(null); // Reset editing state
      refreshData();
    }
  };

  return (
    <div className="p-6">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Amount
              </th>
              <th scope="col" class="px-6 py-3">
                Description
              </th>
              <th scope="col" class="px-6 py-3">
                {isRecurringBudget ? "Next Due Date" : "Date"}
              </th>
              <th scope="col" class="px-6 py-3">
                Action (Edit/Delete)
              </th>
            </tr>
          </thead>
          <tbody>
            {expenseList?.length > 0 ? (
              expenseList.map((expense, index) => (
                <tr
                  key={index}
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {expense.name}
                  </th>
                  <td class="px-6 py-4">{expense.amount}</td>
                  <td class="px-6 py-4">{expense.description}</td>
                  <td class="px-6 py-4">
                    {isRecurringBudget
                      ? expenseDateFormat(
                          nextRecurringDate(expense.createdAt, frequency)
                        )
                      : expenseDateFormat(expense.createdAt)}
                  </td>
                  <td class="px-6 py-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Edit
                          className="text-blue-600 dark:text-blue-400 cursor-pointer mr-2 hover:text-purple-800 dark:hover:text-purple-500 hover:scale-110 active:scale-90 transition-all duration-500"
                          onClick={() => startEditing(expense)}
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Expense</DialogTitle>
                          <DialogDescription>
                            Update the details for this expense.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 mt-4">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Name"
                            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                          />
                          <input
                            type="number"
                            value={editedAmount}
                            onChange={(e) => setEditedAmount(e.target.value)}
                            placeholder="Amount"
                            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                          />
                          <DialogClose>
                            <button
                              onClick={saveEditedExpense}
                              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white p-2 rounded-md transition-all duration-300"
                            >
                              Save
                            </button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <button
                      onClick={() => deleteExpense(expense)}
                      class="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  colSpan="5"
                  class="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  No expense found
                </th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
