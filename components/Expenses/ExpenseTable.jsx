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
const ExpenseTable = ({ expenseList = [], refreshData, isRecurringBudget, frequency }) => {
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
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-all duration-300">
            <TableHead className="font-bold text-blue-700 dark:text-blue-400">
              Name
            </TableHead>
            <TableHead className="font-bold text-blue-700 dark:text-blue-400">
              Amount
            </TableHead>
            <TableHead className="font-bold text-blue-700 dark:text-blue-400">
              Description
            </TableHead>
            <TableHead className="font-bold text-blue-700 dark:text-blue-400">
              {isRecurringBudget ? "Next Due Date" : "Date"}
            </TableHead>
            {/* <TableHead className="font-bold text-blue-700 dark:text-blue-400">Type of Expense</TableHead> */}
            <TableHead className="font-bold text-blue-700 dark:text-blue-400">
              Action (Edit/ Delete)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenseList?.length > 0 ? (
            expenseList.map((expense, index) => (
              <TableRow
                key={index}
                className="hover:bg-blue-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <TableCell className="text-gray-800 dark:text-gray-300">
                  {expense.name}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">
                  {expense.amount}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">
                  {expense.description ? expense.description : "N/A"}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">
                  {isRecurringBudget
                    ? expenseDateFormat(nextRecurringDate(expense.createdAt, frequency))
                    : expenseDateFormat(expense.createdAt)}
                </TableCell>
                <TableCell className="flex items-center space-x-2 text-gray-800 dark:text-gray-300">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                        <button
                          onClick={saveEditedExpense}
                          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white p-2 rounded-md transition-all duration-300"
                        >
                          Save
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <span className="text-gray-400">|</span>
                  <Trash
                    className="text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-500"
                    onClick={() => deleteExpense(expense)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan="4"
                className="text-center text-gray-700 dark:text-gray-300"
              >
                No expenses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseTable;
