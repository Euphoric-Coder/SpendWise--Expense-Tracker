"use client";

import React, { useState } from "react";
import { Trash, Edit, Pen, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { expenseDateFormat, nextRecurringDate } from "@/utils/utilities";
import { Button } from "../ui/button";

const ExpenseTable = ({
  expenseList = [],
  refreshData,
  isRecurringBudget,
  frequency,
}) => {
  const [editingExpense, setEditingExpense] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

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
    setEditedDescription(expense.description);
  };

  const saveEditedExpense = async () => {
    const result = await db
      .update(Expenses)
      .set({
        name: editedName,
        amount: editedAmount,
        description: editedDescription,
      })
      .where(eq(Expenses.id, editingExpense.id))
      .returning();

    if (result) {
      toast.success(`Expense "${editedName}" has been updated!`);
      setEditingExpense(null); // Reset editing state
      refreshData();
    }
  };

  return (
    <div>
       <div className="w-full block md:hidden mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 gap-10">
           {expenseList?.length > 0 ? (
            expenseList.map((expense, index) => (
              <Card
                key={index}
                className="flex flex-col justify-between h-full border border-gray-300 dark:border-gray-600 p-6 rounded-3xl bg-gradient-to-br from-white/70 via-blue-50/60 to-indigo-50/50 dark:from-gray-800/70 dark:via-gray-700/60 dark:to-gray-600/50 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 backdrop-blur-lg"
              >
                {/* Decorative Animated Gradient Blobs */}
                {/* <div className="absolute w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-400 dark:from-purple-400 dark:to-pink-400 rounded-full blur-3xl opacity-40 group-hover:opacity-60 animate-pulse"></div> */}
                {/* <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-br from-indigo-400 to-blue-400 dark:from-pink-400 dark:to-purple-400 rounded-full blur-3xl opacity-40 group-hover:opacity-60 animate-pulse"></div> */}

                {/* Card Content */}
                <div>
                  <CardHeader>
                    <CardTitle className="text-2xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400 dark:from-purple-400 dark:to-pink-400">
                      {expense.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                      {isRecurringBudget
                        ? expenseDateFormat(
                            nextRecurringDate(
                              expense.createdAt,
                              expense.frequency
                            )
                          )
                        : expenseDateFormat(expense.createdAt)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="mt-4">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Amount:
                      </p>
                      <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-400 dark:to-purple-400">
                        ${expense.amount}
                      </p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Description:{" "}
                        {expense.description || "No description provided"}
                      </p>
                    </div>
                  </CardContent>
                </div>

                {/* Card Footer */}
                <CardFooter className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={() => startEditing(expense)}
                    className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-110"
                  >
                    <Pen /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteExpense(expense)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-110"
                  >
                    <Trash2 /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-lg font-semibold text-gray-700 dark:text-white">
                No expenses found
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full hidden md:block">
        <div className="overflow-hidden rounded-3xl shadow-lg bg-gradient-to-br from-white/70 via-blue-50/60 to-indigo-50/50 dark:from-gray-800/70 dark:via-gray-700/60 dark:to-gray-600/50 backdrop-blur-lg">
          <table className="w-full border-collapse text-sm sm:text-base">
            {/* Table Header */}
            <thead className="bg-gradient-to-r uppercase via-cyan-600 from-blue-600 to-teal-500 dark:from-blue-400 dark:via-pink-500 dark:to-purple-600 text-white">
              <tr>
                <th className="py-4 px-6 font-bold text-left">Name</th>
                <th className="py-4 px-6 font-bold text-left">Amount</th>
                <th className="py-4 px-6 font-bold text-left">
                  {isRecurringBudget ? "Due Date" : "Date"}
                </th>
                <th className="py-4 px-8 font-bold text-left w-2/5">
                  Description
                </th>
                <th className="py-4 px-6 font-bold text-left">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {expenseList?.length > 0 ? (
                expenseList.map((expense, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gradient-to-br hover:from-blue-200 hover:via-blue-100 hover:to-indigo-200 dark:hover:from-gray-700 dark:hover:via-gray-600 dark:hover:to-gray-500 transition-all duration-300"
                  >
                    <td className="py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                      {expense.name}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                      ₹{expense.amount}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {isRecurringBudget
                        ? expenseDateFormat(
                            nextRecurringDate(expense.createdAt, frequency)
                          )
                        : expenseDateFormat(expense.createdAt)}
                    </td>
                    <td className="py-4 px-8 text-gray-600 dark:text-gray-400">
                      {expense.description || "No description provided"}
                    </td>
                    <td className="py-4 px-6 flex gap-2 justify-start sm:justify-center items-center">
                      <Dialog>
                        <DialogTrigger>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Edit
                                  className="text-blue-600 dark:text-blue-400 cursor-pointer mr-2 hover:text-purple-800 hover:dark:text-purple-500 hover:scale-110 active:scale-90 transition-all duration-500"
                                  onClick={() => startEditing(expense)}
                                />
                              </TooltipTrigger>
                              <TooltipContent className="font-bold rounded-full">
                                <p>Edit Expense</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </DialogTrigger>
                        <DialogContent className="border-2 border-blue-200 p-8 bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl overflow-auto">
                          {/* Background Effects */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-30 blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-300 via-indigo-300 to-cyan-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-30 blur-[80px]"></div>
                          </div>

                          <DialogHeader>
                            <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400">
                              Edit Expense
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-4">
                              Update the details for this expense.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-4 mt-4">
                            {/* Name Input */}
                            <label
                              htmlFor="name"
                              className="text-blue-700 dark:text-blue-300 text-md font-bold"
                            >
                              Name
                            </label>
                            <input
                              id="name"
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              placeholder="Name"
                              className="w-full border border-blue-300 dark:border-gray-600 rounded-xl shadow-lg p-2 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus-visible:ring-blue-400 focus:ring-blue-400 dark:focus:ring-blue-500 transition-transform transform hover:scale-105 duration-200"
                            />

                            {/* Amount Input */}
                            <label
                              htmlFor="amount"
                              className="text-blue-700 dark:text-blue-300 text-md font-bold"
                            >
                              Amount
                            </label>
                            <input
                              id="amount"
                              type="number"
                              value={editedAmount}
                              onChange={(e) => setEditedAmount(e.target.value)}
                              placeholder="Amount"
                              className="w-full border border-blue-300 dark:border-gray-600 rounded-xl shadow-lg p-2 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus-visible:ring-blue-400 focus:ring-blue-400 dark:focus:ring-blue-500 transition-transform transform hover:scale-105 duration-200"
                            />

                            {/* Amount Input */}
                            <label
                              htmlFor="description"
                              className="text-blue-700 dark:text-blue-300 text-md font-bold"
                            >
                              Description
                            </label>
                            <input
                              id="description"
                              type="text"
                              value={editedDescription}
                              onChange={(e) =>
                                setEditedDescription(e.target.value)
                              }
                              placeholder="Description"
                              className="w-full border border-blue-300 dark:border-gray-600 rounded-xl shadow-lg p-2 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus-visible:ring-blue-400 focus:ring-blue-400 dark:focus:ring-blue-500 transition-transform transform hover:scale-105 duration-200"
                            />

                            {/* Save Button */}
                            <DialogClose>
                              <button
                                onClick={saveEditedExpense}
                                className="individual-expense-btn2 rounded-full py-1 mt-4"
                              >
                                Update Expense
                              </button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <span className="text-gray-400">|</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Trash
                              className="text-red-600 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-500"
                              onClick={() => deleteExpense(expense)}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="font-bold rounded-full p-2 m-2">
                            <p>Delete Expense</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-gray-700 dark:text-gray-300"
                  >
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default ExpenseTable;
