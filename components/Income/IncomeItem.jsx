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
import { FaRediere } from "react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      frequency: isRecurring ? frequency : null,
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
      // setFrequency("monthly")

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
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 dark:from-blue-700 dark:via-cyan-700 dark:to-indigo-700 text-white font-medium text-xs sm:text-sm shadow-sm text-center">
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
          {income.incomeType === "non-recurring" && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
                  Valid Till: {format(income.endDate, "PPP")}
                </h2>
                <h2 className="text-xs text-gray-500 dark:text-gray-400">
                  Expires in {dateDifference(income.endDate)} Days
                </h2>
              </div>
              {/* nonrecurringProgress Bar */}
              <div className="relative mt-3 w-full h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded-full shadow-inner">
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
                    ? "text-cyan-500 dark:text-cyan-400" // Most time remaining
                    : nonrecurringProgress <= 75
                    ? "text-blue-500 dark:text-blue-400" // Moderate time remaining
                    : "text-indigo-500 dark:text-indigo-400" // Time is almost up
                }`}
              >
                {100 - nonrecurringProgress}% of days left to expiry ({expiry}{" "}
                days)
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
                <div className="relative mt-3 w-full h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded-full shadow-inner">
                  <div
                    className="h-3 sm:h-4 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 dark:from-blue-500 dark:via-cyan-500 dark:to-indigo-500 shadow-md"
                    style={{
                      width: `${recurringProgress.progress}%`,
                    }}
                  ></div>
                </div>
                <p
                  className={`mt-2 text-center text-sm sm:text-lg font-semibold ${
                    recurringProgress.progress <= 65
                      ? "text-cyan-500 dark:text-cyan-400" // Most time remaining
                      : recurringProgress.progress <= 85
                      ? "text-blue-500 dark:text-blue-400" // Moderate time remaining
                      : "text-indigo-500 dark:text-indigo-400" // Time is almost up
                  }`}
                >
                  {(100 - recurringProgress.progress).toFixed(2)}% of days left
                  to next recurring ({recurringProgress.daysUntilNext} days)
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default IncomeItem;
