import IncomeList from "@/components/IncomeList";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React from "react";

function Income() {
  return (
    <div className="p-10">
      <div className="flex justify-between">
        <h2 className="font-bold text-3xl">My Income Streams</h2>
        <Button variant="destructive"><Trash2 />Delete</Button>
      </div>
      <IncomeList />
    </div>
  );
}

export default Income;
