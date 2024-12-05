"use client";

import {
  calculateNonRecurringProgress,
  calculateRecurringProgress,
  dateDifference,
  formatCurrency,
  formatDate,
  getISTCustomDate,
  getISTDate,
  isSameDate,
} from "@/utils/utilities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Incomes } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { parseISO, format } from "date-fns";
import EmojiPicker from "emoji-picker-react";

function IncomeItem({ income, refreshData }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openEmojiPicker, setopenEmojiPicker] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [editedName, setEditedName] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedIcon, setEditedIcon] = useState();
  const [isRecurring, setIsRecurring] = useState(false);
  const [editedStartDate, setEditedStartDate] = useState(null);
  const [editedEndDate, setEditedEndDate] = useState(null);

  const nonrecurringProgress = calculateNonRecurringProgress(
    getISTCustomDate(income.createdAt),
    income.endDate
  );

  const recurringProgress = calculateRecurringProgress(
    getISTCustomDate(income.createdAt),
    income.frequency
  );

  // console.log(recurringProgress)

  const expiry = dateDifference(income.endDate);

  const startEditing = (income) => {
    setEditedName(income.name);
    setEditedAmount(income.amount);
    setIsRecurring(income.incomeType === "recurring");
    setEditedStartDate(income.startDate ? parseISO(income.startDate) : null);
    setEditedEndDate(income.endDate ? parseISO(income.endDate) : null);
    setEditedIcon(income.icon);
    setIsDialogOpen(true); // Opens up the dialog when editing starts
  };

  const saveEditedIncome = async () => {
    console.log(frequency);
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
      icon: editedIcon,
      incomeType: isRecurring ? "recurring" : "non-recurring",
      // frequency: isRecurring ? frequency : null,
      startDate: isRecurring ? editedStartDate : null,
      endDate: isRecurring ? null : editedEndDate || defaultEndDate,
      status: isRecurring
        ? isSameDate(editedStartDate, getISTDate())
          ? "current"
          : "upcoming"
        : "current",
      lastUpdated: getISTDate(),
    };

    const result = await db
      .update(Incomes)
      .set(updatedValues)
      .where(eq(Incomes.id, income.id))
      .returning();

    if (result) {
      toast(`Income "${editedName}" has been updated!`);
      setIsDialogOpen(false); // Close the dialog
      setFrequency("monthly")

      refreshData(); // Refresh data
    }
  };

  const deleteIncome = async () => {
    const name = income.name;
    try {
      await db.delete(Incomes).where(eq(Incomes.id, income.id)).returning();
      refreshData(); // Refresh data
      toast.success(`Income "${name}" has been deleted!`);
    } catch (error) {
      toast.error("Failed to delete the income");
    }
  };

  return (
    <div
      className={`relative p-4 mb-4 sm:p-5 border-2 rounded-3xl bg-gradient-to-b from-white via-green-50 to-teal-50 shadow-lg transition-transform transform`}
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
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white font-medium text-xs sm:text-sm shadow-sm text-center">
                Recurring Income
              </span>
            )}
          </div>
        </div>

        {/* Income Amount */}
        <h2
          className={`font-bold text-md sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-500 to-cyan-500`}
        >
          {formatCurrency(income.amount)}
        </h2>
      </div>
      <div className="mt-1 mb-2">
        <div>
          {income.incomeType === "non-recurring" && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-green-600 to-cyan-600">
                  Valid Till: {format(income.endDate, "PPP")}
                </h2>
                <h2 className="text-xs text-gray-500">
                  Expires in {dateDifference(income.endDate)} Days
                </h2>
              </div>
              {/* nonrecurringProgress Bar */}
              <div className="relative mt-3 w-full h-3 sm:h-4 bg-gray-300 rounded-full shadow-inner">
                <div
                  className="h-3 sm:h-4 rounded-full bg-gradient-to-r from-green-300 via-green-400 to-green-500 shadow-md"
                  style={{
                    width: `${nonrecurringProgress}%`,
                  }}
                ></div>
              </div>

              {/* Percentage Below nonrecurringProgress Bar */}
              <p
                className={`mt-2 text-center text-sm sm:text-lg font-semibold ${
                  nonrecurringProgress <= 25
                    ? "text-green-500" // Most time remaining
                    : nonrecurringProgress <= 75
                    ? "text-orange-500" // Moderate time remaining
                    : "text-red-500" // Time is almost up
                }`}
              >
                {100 - nonrecurringProgress}% of days left to expiry ({expiry}{" "}
                days)
              </p>
            </div>
          )}
          {income.incomeType === "recurring" && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-green-600 to-cyan-600">
                  Frequency: {income.frequency}
                </h2>
                <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-green-600 to-cyan-600">
                  Next Recurring Date:{" "}
                  {format(recurringProgress.nextRecurringDate, "PPP")}
                </h2>
              </div>
              {/* recurringProgress Bar */}
              <div className="relative mt-3 w-full h-3 sm:h-4 bg-gray-300 rounded-full shadow-inner">
                <div
                  className="h-3 sm:h-4 rounded-full bg-gradient-to-r from-green-300 via-green-400 to-green-500 shadow-md"
                  style={{
                    width: `${recurringProgress.progress}%`,
                  }}
                ></div>
              </div>
              {/* Percentage Below nonrecurringProgress Bar */}
              <p
                className={`mt-2 text-center text-sm sm:text-lg font-semibold ${
                  recurringProgress.progress <= 25
                    ? "text-green-500" // Most time remaining
                    : recurringProgress.progress <= 75
                    ? "text-orange-500" // Moderate time remaining
                    : "text-red-500" // Time is almost up
                }`}
              >
                {(100 - recurringProgress.progress).toFixed(2)}% of days left to
                next recurring ({recurringProgress.daysUntilNext} days)
              </p>
              <div className="flex justify-between items-center gap-3">
                <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-green-600 to-cyan-600">
                  Last Processed:{" "}
                  {income.lastProcessed
                    ? format(income.lastProcessed, "PPP")
                    : "NA"}
                </h2>
                <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-green-600 to-cyan-600">
                  Edited:{" "}
                  {income.lastUpdated
                    ? format(income.lastUpdated, "PPP")
                    : "No!"}
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Edit
                    className="text-teal-600 cursor-pointer hover:text-green-500 hover:scale-110 active:scale-95 transition-transform duration-300"
                    onClick={() => startEditing(income)}
                  />
                </TooltipTrigger>
                <TooltipContent className="rounded-full">
                  <p className="font-semibold">Edit Income</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
              {/* Emoji Picker */}
              <div className="flex space-y-11">
                <Button
                  variant="outline"
                  className="text-lg px-4 py-2 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white font-semibold rounded-full hover:scale-105 transition-transform"
                  onClick={() => setopenEmojiPicker(!openEmojiPicker)}
                >
                  {editedIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEditedIcon(e.emoji);
                      setopenEmojiPicker(false);
                    }}
                  />
                </div>
              </div>
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
                <div className="mt-4">
                  <h2 className="text-gray-700 font-medium mb-2">Frequency</h2>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
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
        <TooltipProvider>
          <Tooltip>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <TooltipTrigger asChild>
                  <Trash className="cursor-pointer text-red-500 hover:text-red-600 hover:scale-110 active:scale-95 transition-transform duration-500" />
                </TooltipTrigger>
              </AlertDialogTrigger>
              <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-green-50 to-teal-100 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,200,150,0.3)] w-[95%] max-w-lg">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-teal-400 via-green-400 to-transparent opacity-25 blur-3xl"></div>
                  <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-green-300 via-cyan-300 to-transparent opacity-30 blur-[120px]"></div>
                </div>

                {/* Dialog Header */}
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-green-500 to-cyan-500">
                    Are you absolutely sure to delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-gray-600 mt-2">
                    This action cannot be undone. This will permanently delete
                    your income "{income.name}" and all of its associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Dialog Footer */}
                <AlertDialogFooter className="flex gap-4 mt-6">
                  <AlertDialogCancel className="w-full py-3 rounded-2xl border border-teal-300 bg-gradient-to-r from-white to-teal-50 text-teal-600 font-semibold shadow-sm hover:shadow-md hover:bg-teal-100 transition-transform transform hover:scale-105 active:scale-95">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteIncome()}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,100,100,0.5)] hover:scale-105 active:scale-95 transition-transform transform"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <TooltipContent className="rounded-full">
              <p className="font-semibold">Delete Income</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default IncomeItem;
