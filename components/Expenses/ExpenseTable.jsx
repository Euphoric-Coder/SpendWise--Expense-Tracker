"use client";

import React, { useState } from "react";
import { Trash, Edit } from "lucide-react";
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
  };

  const saveEditedExpense = async () => {
    const result = await db
      .update(Expenses)
      .set({ name: editedName, amount: editedAmount })
      .where(eq(Expenses.id, editingExpense.id))
      .returning();

    if (result) {
      toast.success(`Expense "${editedName}" has been updated!`);
      setEditingExpense(null); // Reset editing state
      refreshData();
    }
  };

  return (
    // <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
    //     {expenseList?.length > 0 ? (
    //       expenseList.map((expense, index) => (
    //         <Card
    //           key={index}
    //           className="flex flex-col justify-between h-full border border-gray-300 dark:border-gray-600 p-6 rounded-3xl bg-gradient-to-br from-white/70 via-blue-50/60 to-indigo-50/50 dark:from-gray-800/70 dark:via-gray-700/60 dark:to-gray-600/50 shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 backdrop-blur-lg"
    //         >
    //           {/* Decorative Animated Gradient Blobs */}
    //           {/* <div className="absolute w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-400 dark:from-purple-400 dark:to-pink-400 rounded-full blur-3xl opacity-40 group-hover:opacity-60 animate-pulse"></div> */}
    //           {/* <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-br from-indigo-400 to-blue-400 dark:from-pink-400 dark:to-purple-400 rounded-full blur-3xl opacity-40 group-hover:opacity-60 animate-pulse"></div> */}

    //           {/* Card Content */}
    //           <div>
    //             <CardHeader>
    //               <CardTitle className="text-2xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400 dark:from-purple-400 dark:to-pink-400">
    //                 {expense.name}
    //               </CardTitle>
    //               <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
    //                 {isRecurringBudget
    //                   ? expenseDateFormat(
    //                       nextRecurringDate(
    //                         expense.createdAt,
    //                         expense.frequency
    //                       )
    //                     )
    //                   : expenseDateFormat(expense.createdAt)}
    //               </CardDescription>
    //             </CardHeader>

    //             <CardContent className="mt-4">
    //               <div className="mb-4">
    //                 <p className="text-sm text-gray-600 dark:text-gray-300">
    //                   Amount:
    //                 </p>
    //                 <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-400 dark:to-purple-400">
    //                   ${expense.amount}
    //                 </p>
    //               </div>
    //               <div className="flex gap-1 items-center">
    //                 <p className="text-sm text-gray-600 dark:text-gray-300">
    //                   Description:{" "}
    //                   {expense.description || "No description provided"}
    //                 </p>
    //               </div>
    //             </CardContent>
    //           </div>

    //           {/* Card Footer */}
    //           <CardFooter className="flex justify-between gap-4">
    //             <Button
    //               variant="outline"
    //               onClick={() => startEditing(expense)}
    //               className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-110"
    //             >
    //               Edit
    //             </Button>
    //             <Button
    //               variant="destructive"
    //               onClick={() => deleteExpense(expense)}
    //               className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-110"
    //             >
    //               Delete
    //             </Button>
    //           </CardFooter>
    //         </Card>
    //       ))
    //     ) : (
    //       <div className="col-span-full text-center">
    //         <p className="text-lg font-semibold text-gray-700 dark:text-white">
    //           No expenses found
    //         </p>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl shadow-lg bg-gradient-to-br from-white/70 via-blue-50/60 to-indigo-50/50 dark:from-gray-800/70 dark:via-gray-700/60 dark:to-gray-600/50 backdrop-blur-lg">
        <table className="w-full border-collapse text-sm sm:text-base">
          {/* Table Header */}
          <thead className="bg-gradient-to-r via-cyan-600 from-blue-600 to-teal-500 dark:from-blue-400 dark:via-pink-500 dark:to-purple-600 text-white">
            <tr>
              <th className="py-4 px-6 font-bold text-left">Name</th>
              <th className="py-4 px-6 font-bold text-left">Amount</th>
              <th className="py-4 px-6 font-bold text-left">Date</th>
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
                    ${expense.amount}
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
                      <DialogTrigger asChild>
                        <Edit
                          className="text-blue-600 dark:text-blue-400 cursor-pointer mr-2 hover:text-purple-800 hover:dark:text-purple-500 hover:scale-110 active:scale-90 transition-all duration-500"
                          onClick={() => startEditing(expense)}
                        />
                      </DialogTrigger>
                      <DialogContent className="p-6 rounded-3xl bg-gradient-to-br from-white/70 via-blue-50/60 to-indigo-50/50 dark:from-gray-800/70 dark:via-gray-700/60 dark:to-gray-600/50 shadow-lg backdrop-blur-lg">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400 dark:from-purple-400 dark:to-pink-400">
                            Edit Expense
                          </DialogTitle>
                          <DialogDescription className="text-sm text-gray-700 dark:text-gray-300">
                            Update the details for this expense.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 mt-4">
                          {/* Name Input */}
                          <label
                            htmlFor="name"
                            className="text-gray-600 dark:text-gray-300 text-sm"
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Name"
                            className="border border-gray-300 dark:border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400"
                          />

                          {/* Amount Input */}
                          <label
                            htmlFor="amount"
                            className="text-gray-600 dark:text-gray-300 text-sm"
                          >
                            Amount
                          </label>
                          <input
                            id="amount"
                            type="number"
                            value={editedAmount}
                            onChange={(e) => setEditedAmount(e.target.value)}
                            placeholder="Amount"
                            className="border border-gray-300 dark:border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-400"
                          />

                          {/* Save Button */}
                          <button
                            onClick={saveEditedExpense}
                            className="mt-4 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            Save
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <span className="text-gray-400">|</span>
                    <Trash
                      className="text-red-600 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-500"
                      onClick={() => deleteExpense(expense)}
                    />
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
  );
};

export default ExpenseTable;
