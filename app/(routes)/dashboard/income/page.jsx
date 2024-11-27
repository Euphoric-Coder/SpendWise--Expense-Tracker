'use client'

import DeleteIncome from "@/components/Income/DeleteIncome";
import IncomeList from "@/components/Income/IncomeList";
import RecurringTransactionForm from "@/components/Income/RecurringTransactionForm";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

function Income() {
  const [recurringTransactions, setRecurringTransactions] = useState([]);

  const fetchRecurringTransactions = async () => {
    const response = await fetch("/api/recurring-transactions");
    const data = await response.json();
    if (response.ok) {
      setRecurringTransactions(data);
    } else {
      console.error("Failed to fetch recurring transactions:", data.message);
    }
  };

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);
  return (
    <div className="p-10">
      {/* <div className="flex justify-between">
        <h2 className="font-bold text-3xl">My Income Streams</h2>
        <DeleteIncome />
      </div> */}
      <IncomeList />
    </div>
  );
}

export default Income;
