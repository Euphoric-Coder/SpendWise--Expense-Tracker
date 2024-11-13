import DeleteIncome from "@/components/Income/DeleteIncome";
import IncomeList from "@/components/Income/IncomeList";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React from "react";

function Income() {
  return (
    <div className="p-10">
      <div className="flex justify-between">
        <h2 className="font-bold text-3xl">My Income Streams</h2>
        <DeleteIncome />
      </div>
      <IncomeList />
    </div>
  );
}

export default Income;
