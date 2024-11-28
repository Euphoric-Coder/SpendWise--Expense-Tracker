"use client";

import {
  formatCurrency,
  formatDate,
  getISTDate,
  isSameDate,
} from "@/utils/utilities";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import { Edit } from "lucide-react";
import { Incomes } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { parseISO, format } from "date-fns";

function IncomeItem({ income, isIncome, refreshData }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [editedStartDate, setEditedStartDate] = useState(null);
  const [editedEndDate, setEditedEndDate] = useState(null);

  const startEditing = (income) => {
    setEditingExpense(income);
    setEditedName(income.name);
    setEditedAmount(income.amount);
    setIsRecurring(income.incomeType === "recurring");
    setEditedStartDate(income.startDate ? parseISO(income.startDate) : null);
    setEditedEndDate(income.endDate ? parseISO(income.endDate) : null);
    setIsDialogOpen(true); // Open the dialog when editing starts
  };
  
  const saveEditedIncome = async () => {
    const defaultEndDate = new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    )
      .toISOString()
      .split("T")[0];
    setEditedStartDate(formatDate(editedStartDate));
    setEditedEndDate(formatDate(editedEndDate));
    const updatedValues = {
      name: editedName,
      amount: editedAmount,
      incomeType: isRecurring ? "recurring" : "non-recurring",
      startDate: isRecurring ? editedStartDate : null,
      endDate: isRecurring ? null : editedEndDate || defaultEndDate,
      status: isRecurring
        ? isSameDate(editedStartDate, getISTDate())
          ? "current"
          : "upcoming"
        : "current",
    };

    const result = await db
      .update(Incomes)
      .set(updatedValues)
      .where(eq(Incomes.id, income.id))
      .returning();

    if (result) {
      toast(`Income "${editedName}" has been updated!`);
      setIsDialogOpen(false); // Close the dialog
      refreshData(); // Refresh data
    }
  };

  return (
    <div
      className={`p-4 sm:p-5 border-2 rounded-3xl bg-gradient-to-b from-white via-green-50 to-teal-50 shadow-lg transition-transform transform ${
        isIncome
          ? "hover:scale-105 hover:shadow-xl cursor-pointer"
          : "cursor-default"
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Icon and Name Section */}
        <div className="flex gap-3 sm:gap-4 items-center">
          {/* Icon */}
          <h2 className="text-2xl sm:text-3xl p-3 sm:p-4 px-4 sm:px-5 bg-gradient-to-r from-teal-200 via-green-200 to-cyan-200 rounded-full text-teal-600 shadow-inner">
            {income?.icon}
          </h2>
          {/* Income Name */}
          <div>
            <h2 className="font-extrabold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-green-600 to-cyan-600">
              {income.name}
            </h2>
            {/* Recurring Label */}
            {income.incomeType === "recurring" && (
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white font-medium text-xs sm:text-sm shadow-sm">
                Recurring Income
              </span>
            )}
          </div>
        </div>

        {/* Income Amount */}
        <h2
          className={`font-bold text-md sm:text-lg text-transparent bg-clip-text bg-gradient-to-r ${
            income.incomeType === "recurring"
              ? "from-cyan-600 via-teal-500 to-green-500"
              : "from-green-600 via-teal-500 to-cyan-500"
          }`}
        >
          {formatCurrency(income.amount)}
        </h2>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger className="">
          <Edit
            className="text-teal-600 cursor-pointer mr-2 hover:text-green-500 hover:scale-110 active:scale-95 transition-transform duration-300"
            onClick={() => startEditing(income)}
          />
        </DialogTrigger>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-green-50 to-teal-100 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,200,150,0.3)] w-[95%] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-green-500 to-cyan-500">
              Edit Income
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Update the details for this income.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 mt-6">
            {/* Income Name */}
            <div>
              <h2 className="text-gray-700 font-medium mb-2">Income Name</h2>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Name"
                className="w-full p-4 border border-teal-300 rounded-lg shadow-md focus:ring focus:ring-teal-300 transition duration-200"
              />
            </div>

            {/* Amount */}
            <div>
              <h2 className="text-gray-700 font-medium mb-2">Amount</h2>
              <input
                type="number"
                value={editedAmount}
                onChange={(e) => setEditedAmount(e.target.value)}
                placeholder="Amount"
                className="w-full p-4 border border-teal-300 rounded-lg shadow-md focus:ring focus:ring-teal-300 transition duration-200"
              />
            </div>

            {/* Recurring Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked)}
              />
              <label
                htmlFor="recurring"
                className="text-gray-700 font-medium text-sm"
              >
                Recurring Income
              </label>
            </div>

            {/* Conditional Fields Based on Recurrence */}
            {isRecurring ? (
              <div>
                <h2 className="text-gray-700 font-medium mb-2">Start Date</h2>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {editedStartDate ? (
                        format(editedStartDate, "PPP")
                      ) : (
                        <span>Pick a start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editedStartDate}
                      onSelect={setEditedStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div>
                <h2 className="text-gray-700 font-medium mb-2">End Date</h2>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {editedEndDate ? (
                        format(editedEndDate, "PPP")
                      ) : (
                        <span>Pick an end date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editedEndDate}
                      onSelect={setEditedEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={saveEditedIncome}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-green-500 to-cyan-500 text-white font-bold shadow-lg hover:shadow-[0_0_30px_rgba(0,200,150,0.5)] hover:scale-105 active:scale-95 transition-transform duration-300"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default IncomeItem;
