"use client";

import {
  calculateNonRecurringProgress,
  calculateRecurringProgress,
  dateDifference,
  formatCurrency,
  formatDate,
  getISTCustomDate,
  getISTDate,
  getISTDateTime,
  isSameDate,
  nextRecurringDate,
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
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar1,
  CalendarIcon,
  Edit,
  Repeat,
  Trash,
} from "lucide-react";
import { Incomes, Transactions } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { parseISO, format, set } from "date-fns";
import EmojiPicker from "emoji-picker-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Calendar } from "../ui/calendar";
import { frequencyTypes, incomeCategoriesList } from "@/utils/data";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

function IncomeItem({ income, refreshData }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invalidDate, setInvalidDate] = useState(false);
  const [openEmojiPicker, setopenEmojiPicker] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [editedName, setEditedName] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedCategory, setEditedCategory] = useState("salary");
  const [editedIcon, setEditedIcon] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [editedStartDate, setEditedStartDate] = useState(getISTDate());
  const [editedEndDate, setEditedEndDate] = useState(null);

  useEffect(() => {
    setInvalidDate(pastDate(editedStartDate));
  }, [editedStartDate]);

  const nonrecurringProgress = calculateNonRecurringProgress(
    getISTCustomDate(income.createdAt),
    income.endDate
  );

  const recurringProgress = calculateRecurringProgress(
    getISTCustomDate(income.startDate),
    income.frequency
  );

  // console.log(recurringProgress)

  const expiry = dateDifference(income.endDate);

  const startEditing = (income) => {
    setEditedName(income.name);
    setEditedAmount(income.amount);
    setEditedCategory(income.category);
    setIsRecurring(income.incomeType === "recurring");
    setEditedStartDate(
      income.startDate ? parseISO(income.startDate) : getISTDate()
    );
    setEditedEndDate(income.endDate ? parseISO(income.endDate) : null);
    setEditedIcon(income.icon);
  };

  const saveEditedIncome = async () => {
    if (pastDate(startDate)) {
      toast.error("Start Date cannot be in the past.");
      return;
    }
    const updatedValues = {
      name: editedName,
      amount: editedAmount,
      category: editedCategory,
      icon: editedIcon,
      incomeType: isRecurring ? "recurring" : "non-recurring",
      frequency: isRecurring ? frequency : null,
      startDate: isRecurring
        ? editedStartDate
          ? editedStartDate
          : getISTDate()
        : null,
      endDate: !isRecurring ? addOneMonth(getISTDate()) : null,
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

    const transactionResult = await db
      .update(Transactions)
      .set({
        name: editedName,
        amount: editedAmount,
        category: editedCategory,
        isRecurring: isRecurring,
        frequency: isRecurring ? frequency : null,
        nextRecurringDate: isRecurring
          ? nextRecurringDate(editedStartDate, frequency)
          : null,
        status: isRecurring
          ? isSameDate(
              editedStartDate ? editedStartDate : getISTDate(),
              getISTDate()
            )
            ? "active"
            : "upcoming"
          : "active",
        lastUpdated: getISTDateTime(),
      })
      .where(eq(Transactions.referenceId, income.id))
      .returning();

    if (result && transactionResult) {
      toast.success(`Income "${editedName}" has been updated!`);
      refreshData(); // Refresh data
    }
  };

  const deleteIncome = async () => {
    const name = income.name;
    try {
      await db
        .update(Transactions)
        .set({
          lastUpdated: getISTDate(),
          status: "deleted",
          deletionRemark: `Income deleted by user at ${getISTDateTime()}`,
        })
        .where(eq(Transactions.referenceId, income.id))
        .returning();
      await db.delete(Incomes).where(eq(Incomes.id, income.id)).returning();
      refreshData(); // Refresh data
      toast.success(`Income "${name}" has been deleted!`);
    } catch (error) {
      toast.error("Failed to delete the income");
    }
  };

  const pastDate = (date) => {
    return (date ? formatDate(date) : getISTDate()) < getISTDate();
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
        <Dialog
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditedName("");
              setEditedAmount("");
              setEditedCategory("salary");
              setopenEmojiPicker(false);
              setIsRecurring(false);
              setFrequency("monthly");
              setEditedStartDate("");
              setEditedEndDate("");
            }
          }}
        >
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

            {/* Dialog Header */}
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
                Edit Income Source
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Fill in the details below to add your income source.
              </DialogDescription>
            </DialogHeader>

            {/* Emoji Picker Section */}
            <div>
              <h2 className="budg-text1">Choose an Emoji</h2>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-300 dark:border-blue-600 rounded-full p-4 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-transform"
                onClick={() => setopenEmojiPicker(!openEmojiPicker)}
              >
                {editedIcon}
              </Button>

              {/* Emoji Picker */}
              {openEmojiPicker && (
                <div
                  className="absolute z-20 space-y-4"
                  style={{ minWidth: "250px" }}
                >
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setopenEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Input Fields */}
            <div className="mt-1">
              <h2 className="budg-text1">Income Source Name</h2>
              <Input
                type="text"
                placeholder="e.g. Freelance Work"
                className="budg-input-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="mt-1">
              <h2 className="budg-text1">Monthly Amount</h2>
              <Input
                type="number"
                placeholder="e.g. Rs.8000"
                className="budg-input-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                value={editedAmount}
                onChange={(e) => setEditedAmount(e.target.value)}
              />
            </div>

            {/* Categories  */}
            <div className="mt-1">
              <h2 className="budg-text1">Category</h2>
              <Select
                value={editedCategory.toLowerCase()}
                onValueChange={(e) => {
                  setEditedCategory(e);
                  console.log(e.toLowerCase().split(" ")[0]);
                }}
              >
                <SelectTrigger className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="budg-select-content mt-2">
                  <ScrollArea className="max-h-60 overflow-auto">
                    {incomeCategoriesList.map((category, index) => (
                      <SelectItem
                        key={index}
                        value={category.toLowerCase().split(" ")[0]}
                        className="budg-select-item"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            {/* Recurring Income Section */}
            <div
              className="flex items-center justify-between p-4 rounded-3xl 
      bg-gradient-to-r from-cyan-50 via-blue-100 to-indigo-100 
      dark:bg-gradient-to-r dark:from-[#243089] dark:via-[#3a6aa4] dark:to-[#76b2e6] 
      border border-blue-300 dark:border-0 transition-all"
            >
              <div>
                <h3 className="flex gap-2 items-center budg-text1 text-sm font-extrabold tracking-wide text-gray-900 dark:text-white">
                  Recurring Income
                  {isRecurring && (
                    <Badge className="border-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-2 rounded-3xl text-xs dark:from-green-500 dark:to-green-700">
                      Active
                    </Badge>
                  )}
                </h3>
                <p className="mt-2 text-xs text-gray-900 dark:text-blue-100">
                  Enable to automatically allocate a recurring budget each
                  cycle.
                </p>
              </div>

              <Switch
                checked={isRecurring}
                onCheckedChange={(e) => setIsRecurring(e)}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-400 
        dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-blue-300 border-2 border-blue-400 dark:border-indigo-200"
              />
            </div>

            {isRecurring && (
              <div>
                <div className="mt-1">
                  <h2 className="budg-text1">Frequency</h2>
                  <Select
                    value={frequency}
                    onValueChange={(e) => setFrequency(e)}
                  >
                    <SelectTrigger className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="budg-select-content">
                      {frequencyTypes.map((frequency, index) => (
                        <SelectItem
                          key={index}
                          value={frequency}
                          className="budg-select-item"
                        >
                          {frequency.replace(/^./, (char) =>
                            char.toUpperCase()
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-2">
                  <h2 className="budg-text1">Start Date</h2>
                  <div className="flex items-center gap-2">
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="budg-input-field justify-start"
                        >
                          <CalendarIcon />
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
                    {invalidDate && (
                      <Button
                        size={"sm"}
                        className="del1 tracking-wider"
                        onClick={() => setEditedStartDate(getISTDate())}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Invalid Date Alert */}
            {invalidDate && (
              <Alert
                variant="destructive"
                className="mt-1 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-400 dark:border-gray-600 shadow-lg p-4 rounded-xl flex items-center transition-transform transform"
              >
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <AlertTitle className="text-blue-700 dark:text-blue-300 font-bold">
                    Invalid Data
                  </AlertTitle>
                  <AlertDescription className="text-blue-600 dark:text-blue-400">
                    Start Date cannot be in the past.
                  </AlertDescription>
                  <div className="w-full mt-2"></div>
                </div>
              </Alert>
            )}

            {/* Footer Section */}
            <DialogFooter className="mt-1">
              <DialogClose asChild>
                <Button
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 dark:from-blue-600 dark:via-cyan-500 dark:to-teal-500 text-white font-bold shadow-lg hover:shadow-[0_0_30px_rgba(0,100,255,0.5)] transition-transform transform hover:scale-105 disabled:opacity-50"
                  onClick={() => saveEditedIncome()}
                  disabled={!(editedName && editedAmount)}
                >
                  Edit Income Source
                </Button>
              </DialogClose>
            </DialogFooter>
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
                    className="w-full del1"
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
