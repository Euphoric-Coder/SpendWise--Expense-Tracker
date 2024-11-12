"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { toast } from "sonner";
import moment from "moment";

const AddExpense = ({ budgetId, refreshData }) => {
  const [name, setname] = useState();
  const [amount, setamount] = useState();
  const addNewExpense = async () => {
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdAt: moment().format('DD/MM/yyy'),
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
        refreshData()
        toast("New Expense Added");
    }
  };
  return (
    <div className="border-2 border-indigo-100 p-6 rounded-3xl bg-gradient-to-b from-white via-blue-50 to-indigo-50 shadow-lg">
      <h2 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        Add Expense
      </h2>
      <div className="mt-4">
        <h3 className="text-gray-700 font-medium my-1">Expense Name</h3>
        <Input
          type="text"
          placeholder="e.g. Home Decor"
          className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"
          onChange={(e) => setname(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-gray-700 font-medium my-1">Expense Amount</h3>
        <Input
          type="number"
          placeholder="e.g. Rs.5000"
          className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"
          onChange={(e) => setamount(e.target.value)}
        />
      </div>
      <Button
        onClick={() => addNewExpense()}
        disabled={!(name && amount)}
        className="mt-5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-semibold p-3 rounded-xl shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition duration-200 disabled:opacity-50"
      >
        Add New Expense
      </Button>
    </div>
  );
};

export default AddExpense;
