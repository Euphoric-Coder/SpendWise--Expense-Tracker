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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import { CalendarIcon, Edit, Repeat, Trash } from "lucide-react";
import { Incomes, Transactions } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { parseISO, format } from "date-fns";
import EmojiPicker from "emoji-picker-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "../ui/calendar";

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
    const defaultEndDate = new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    )
    .toISOString()
    .split("T")[0];
    const updatedValues = {
      name: editedName,
      amount: editedAmount,
      icon: editedIcon,
      incomeType: isRecurring ? "recurring" : "non-recurring",
      frequency: isRecurring ? frequency : null,
      startDate: isRecurring ? editedStartDate : null,
      endDate: isRecurring ? null : editedEndDate || defaultEndDate,
      status: isRecurring
        ? isSameDate(formatDate(editedStartDate), getISTDate())
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
      // setFrequency("monthly")

      refreshData(); // Refresh data
    }
  };

  const deleteIncome = async () => {
    const name = income.name;
    try {
      await db.delete(Transactions).where(eq(Transactions.referenceId, income.id)).returning();
      await db.delete(Incomes).where(eq(Incomes.id, income.id)).returning();
      refreshData(); // Refresh data
      toast.success(`Income "${name}" has been deleted!`);
    } catch (error) {
      toast.error("Failed to delete the income");
    }
  };

  return (
    <div
      className={`relative p-4 mb-4 sm:p-5 border-2 rounded-3xl bg-gradient-to-b from-white via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-lg transition-transform transform`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Icon and Name Section */}
        <div className="flex gap-3 sm:gap-4 items-center">
          {/* Icon */}
          <h2 className="text-2xl sm:text-3xl p-3 sm:p-4 px-4 sm:px-5 bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 dark:from-blue-500 dark:via-cyan-500 dark:to-indigo-500 rounded-full text-cyan-600 dark:text-cyan-300 shadow-inner">
            {income?.icon}
          </h2>
          {/* Income Name */}
          <div>
            <h2 className="font-extrabold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
              {income.name}
            </h2>
            {/* Recurring Label */}
            {income.incomeType === "recurring" && (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 dark:from-blue-700 dark:via-cyan-700 dark:to-indigo-700 text-white font-medium text-xs sm:text-sm shadow-sm text-center">
                <Repeat size={20} />
                Recurring Income
              </span>
            )}
          </div>
        </div>

        {/* Income Amount */}
        <h2
          className={`font-bold text-md sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400`}
        >
          {formatCurrency(income.amount)}
        </h2>
      </div>
      <div className="mt-1 mb-2">
        <div>
          {income.incomeType === "recurring" &&
            income.status === "upcoming" && (
              <div>
                <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
                  Starting On: {format(income?.startDate, "PPP")}
                </h2>
              </div>
            )}
          {income.incomeType === "non-recurring" && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
                  Valid Till: {format(income.endDate, "PPP")}
                </h2>
                <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
                  Expires in {dateDifference(income.endDate)} Days
                </h2>
              </div>
              {/* nonrecurringProgress Bar */}
              <div className="relative mt-3 w-full h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner">
                <div
                  className="h-3 sm:h-4 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 dark:from-blue-500 dark:via-cyan-500 dark:to-indigo-500 shadow-md"
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
                {(100 - nonrecurringProgress).toFixed(2)}% of days left to
                expiry ({expiry} days)
              </p>
            </div>
          )}
          {income.incomeType === "recurring" &&
            income.status !== "upcoming" && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
                    Frequency: {income.frequency}
                  </h2>
                  <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
                    Next Recurring Date:{" "}
                    {format(recurringProgress.nextRecurringDate, "PPP")}
                  </h2>
                </div>
                {/* recurringProgress Bar */}
                <div className="relative mt-3 w-full h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner">
                  <div
                    className="h-3 sm:h-4 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 dark:from-blue-500 dark:via-cyan-500 dark:to-indigo-500 shadow-md"
                    style={{
                      width: `${recurringProgress.progress}%`,
                    }}
                  ></div>
                </div>
                {/* Percentage Below nonrecurringProgress Bar */}
                {income.frequency === "daily" ? (
                  <p
                    className={`mt-2 text-center text-sm sm:text-lg font-semibold ${
                      recurringProgress.progress <= 65
                        ? "text-green-500" // Most time remaining
                        : recurringProgress.progress <= 85
                        ? "text-yellow-500" // Moderate time remaining
                        : "text-red-500" // Time is almost up
                    }`}
                  >
                    Approximately{" "}
                    {Math.floor(
                      ((100 - recurringProgress.progress).toFixed(2) / 100) * 24
                    )}{" "}
                    hours left to next recurring
                  </p>
                ) : (
                  <p
                    className={`mt-2 text-center text-sm sm:text-lg font-semibold ${
                      recurringProgress.progress <= 65
                        ? "text-green-500" // Most time remaining
                        : recurringProgress.progress <= 85
                        ? "text-yellow-500" // Moderate time remaining
                        : "text-red-500" // Time is almost up
                    }`}
                  >
                    {(100 - recurringProgress.progress).toFixed(2)}% of days
                    left to next recurring ({recurringProgress.daysUntilNext}{" "}
                    days)
                  </p>
                )}
                <div className="flex justify-between items-center gap-3">
                  <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-600">
                    Last Processed:{" "}
                    {income.lastProcessed
                      ? format(income.lastProcessed, "PPP")
                      : "NA"}
                  </h2>
                  <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600">
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
                    className="text-blue-400 cursor-pointer hover:text-indigo-500 hover:scale-110 active:scale-95 transition-transform duration-300"
                    onClick={() => startEditing(income)}
                  />
                </TooltipTrigger>
                <TooltipContent className="rounded-full">
                  <p className="font-semibold">Edit Income</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTrigger>
          <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,150,255,0.3)] w-[95%] max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-blue-400 via-cyan-400 to-transparent dark:from-blue-800 dark:via-cyan-800 dark:to-gray-800 opacity-25 blur-3xl animate-spin-slow"></div>
              <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-cyan-300 via-blue-300 to-transparent dark:from-cyan-800 dark:via-blue-800 dark:to-gray-800 opacity-30 blur-[120px]"></div>
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
                Edit Income
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Update the details for this income.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 mt-6">
              {/* Emoji Picker */}
              <div className="flex space-y-11">
                <Button
                  variant="outline"
                  className="text-2xl sm:text-3xl p-3 sm:p-4 px-4 sm:px-5 bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 dark:from-blue-500 dark:via-cyan-500 dark:to-indigo-500 rounded-full text-cyan-600 dark:text-cyan-300 shadow-inner"
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
                <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Income Name
                </h2>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Name"
                  className="w-full p-4 border rounded-lg shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200"
                />
              </div>

              {/* Amount */}
              <div>
                <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Amount
                </h2>
                <input
                  type="number"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full p-4 border rounded-lg shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200"
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
                  className="text-gray-700 dark:text-gray-300 font-medium text-sm"
                >
                  Recurring Income
                </label>
              </div>

              {/* Conditional Fields Based on Recurrence */}
              {isRecurring ? (
                <div className="mt-4">
                  <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Frequency
                  </h2>
                  <Select
                    // defaultValue={income.frequency}
                    value={frequency}
                    onValueChange={(e) => setFrequency(e)}
                    // className="block w-full p-2 mb-2 border border-gray-300 rounded-full"
                  >
                    <SelectTrigger className="w-full p-4 border rounded-lg shadow-md text-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200">
                      <SelectValue
                      placeholder={frequency}
                      // className="text-lg font-bold"
                      />
                    </SelectTrigger>
                    <SelectContent className="w-full p-4 border rounded-lg shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200">
                      <SelectItem
                        value="daily"
                        className="text-lg rounded-xl bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600
"
                      >
                        Daily
                      </SelectItem>
                      <SelectItem
                        value="weekly"
                        className="text-lg rounded-xl bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600
"
                      >
                        Weekly
                      </SelectItem>
                      <SelectItem
                        value="monthly"
                        className="text-lg rounded-xl bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600
"
                      >
                        Monthly
                      </SelectItem>
                      <SelectItem
                        value="yearly"
                        className="text-lg rounded-xl bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600
"
                      >
                        Yearly
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <h2 className="mt-4 text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Start Date
                  </h2>
                  <Popover modal>
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
                    <PopoverContent align="start" className="w-auto p-0">
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
                  <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    End Date
                  </h2>
                  <Popover modal>
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
              <AlertDialogTrigger>
                <TooltipTrigger asChild>
                  <Trash className="cursor-pointer text-red-500 hover:text-red-600 hover:scale-110 active:scale-95 transition-transform duration-500" />
                </TooltipTrigger>
              </AlertDialogTrigger>
              <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-blue-50 to-cyan-200 dark:from-gray-800 dark:via-gray-900 dark:to-blue-800 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,150,255,0.3)] dark:shadow-[0_0_40px_rgba(0,75,150,0.5)] w-[95%] max-w-lg">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-blue-500 via-blue-400 to-transparent dark:from-blue-900 dark:via-gray-800 dark:to-transparent opacity-25 blur-3xl"></div>
                  <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-cyan-400 via-blue-300 to-transparent dark:from-cyan-800 dark:via-blue-900 dark:to-transparent opacity-30 blur-[120px]"></div>
                </div>

                {/* Dialog Header */}
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 dark:from-blue-300 dark:via-cyan-400 dark:to-blue-500">
                    Are you absolutely sure to delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    This action cannot be undone. This will permanently delete
                    your income "{income.name}" and all of its associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Dialog Footer */}
                <AlertDialogFooter className="flex gap-4 mt-6">
                  <AlertDialogCancel className="w-full py-3 rounded-2xl border border-blue-300 bg-gradient-to-r from-white to-blue-50 text-blue-600 font-semibold shadow-sm hover:shadow-md hover:bg-blue-100 transition-transform transform hover:scale-105 active:scale-95 dark:border-blue-500 dark:bg-gradient-to-r dark:from-gray-800 dark:to-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 hover:text-indigo-500 dark:hover:text-indigo-200">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteIncome()}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,100,100,0.5)] hover:scale-105 active:scale-95 transition-transform transform dark:bg-gradient-to-r dark:from-red-700 dark:via-red-800 dark:to-red-900 dark:shadow-[0_0_20px_rgba(200,50,50,0.5)] dark:hover:shadow-[0_0_30px_rgba(200,50,50,0.7)]"
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
