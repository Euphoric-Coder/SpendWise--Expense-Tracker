"use client";

import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/utils/dbConfig";
import { Incomes, Transactions } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  addOneMonth,
  getISTDate,
  getISTDateTime,
  isSameDate,
  nextRecurringDate,
} from "@/utils/utilities";
import { incomeCategories } from "@/data/categories";

export default function CreateIncomes({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("salary");
  const [isRecurring, setIsRecurring] = useState(false); // Toggle for recurring
  const [frequency, setFrequency] = useState("monthly"); // Default frequency
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); // Optional end date for non-recurring
  const { user } = useUser();

  // console.log(incomeCategories.filter((item) => item.id === "salary"));

  /**
   * To Create New Source of Income
   */
  const onCreateIncomes = async () => {
    const incomeData = {
      name: name,
      amount: amount,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      icon: emojiIcon,
      incomeType: isRecurring ? "recurring" : "non-recurring",
      category: category,
      status: isRecurring
        ? isSameDate(startDate ? startDate : getISTDate(), getISTDate())
          ? "current"
          : "upcoming"
        : "current",
      frequency: isRecurring ? frequency : null,
      startDate: isRecurring
        ? startDate
          ? startDate
          : getISTDate()
        : getISTDate(), // Default to today for non-recurring
      endDate: !isRecurring ? endDate || addOneMonth(getISTDate()) : null,
      createdAt: getISTDateTime(),
    };
    try {
      const result = await db
        .insert(Incomes)
        .values(incomeData)
        .returning({ insertedId: Incomes.id });

      const transaction = await db
        .insert(Transactions)
        .values({
          referenceId: result[0].insertedId,
          type: "income",
          category: category,
          isRecurring: isRecurring,
          frequency: isRecurring ? frequency : null,
          nextRecurringDate: isRecurring
            ? nextRecurringDate(startDate, frequency)
            : null,
          lastProcessed: isSameDate(
            startDate ? startDate : getISTDate(),
            getISTDate()
          )
            ? getISTDate()
            : null,
          status: isRecurring
            ? isSameDate(startDate ? startDate : getISTDate(), getISTDate())
              ? "active"
              : "upcoming"
            : "active",
          name: name,
          amount: amount,
          createdBy: incomeData.createdBy,
          createdAt: incomeData.createdAt,
        })
        .returning({ insertedId: Transactions.id });

      if (result && transaction) {
        refreshData();
        toast.success("New Source of Income has been Created!");
      }
    } catch (error) {
      toast.error("Failed to create income. Please try again.");
      console.error("Error creating income:", error);
    }
  };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setName("");
          setAmount("");
          setIsRecurring(false);
          setFrequency("monthly");
          setStartDate("");
          setEndDate("");
        }
      }}
    >
      <DialogTrigger>
        <div className="bg-gradient-to-b from-white via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed border-blue-300 dark:border-blue-600 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,150,255,0.5)] hover:scale-105 transition-transform transform">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
            +
          </h2>
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400">
            Create New Income
          </h2>
        </div>
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
            Create New Income Source
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Fill in the details below to add your income source.
          </DialogDescription>
        </DialogHeader>

        {/* Emoji Picker Section */}
        <div>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-300 dark:border-blue-600 rounded-full p-4 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-transform"
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
          >
            {emojiIcon}
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
                  setOpenEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Input Fields */}
        <div className="mt-4">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Income Source Name
          </h2>
          <Input
            type="text"
            placeholder="e.g. Freelance Work"
            className="w-full p-4 border rounded-lg shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-6">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Monthly Amount
          </h2>
          <Input
            type="number"
            placeholder="e.g. Rs.8000"
            className="w-full p-4 border rounded-lg shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Category
          </h2>
          <Select
            value={category}
            onValueChange={(e) => setCategory(e)}
            // className="block w-full p-2 mb-2 border border-gray-300 rounded-full"
          >
            <SelectTrigger className="w-full p-4 border rounded-lg shadow-md text-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200">
              <SelectValue
              // placeholder={category}
              // className="text-lg font-bold"
              />
            </SelectTrigger>
            <SelectContent className="w-full p-4 border rounded-lg shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200">
              {incomeCategories.map((category, index) => (
                <SelectItem
                  key={index}
                  value={category.id}
                  className="text-lg rounded-xl bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recurring Income Section */}
        <div className="mt-6 flex items-center space-x-2">
          <Checkbox
            id="recurring"
            checked={isRecurring}
            onCheckedChange={(value) => setIsRecurring(value)}
          />
          <label
            htmlFor="recurring"
            className="text-gray-700 dark:text-gray-300 font-medium text-sm"
          >
            Recurring Income
          </label>
        </div>
        {isRecurring && (
          <div className="mt-4">
            <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
              Frequency
            </h2>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <div className="mt-4">
              <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                Start Date
              </h2>
              <Input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-4 border rounded-lg shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200"
              />
            </div>
          </div>
        )}
        {!isRecurring && (
          <div className="mt-4">
            <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
              End Date
            </h2>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-4 border rounded-lg shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 focus:ring focus:ring-blue-400 dark:focus:ring-blue-500 transition duration-200"
            />
          </div>
        )}
        {/* Footer Section */}
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 dark:from-blue-600 dark:via-cyan-500 dark:to-teal-500 text-white font-bold shadow-lg hover:shadow-[0_0_30px_rgba(0,100,255,0.5)] transition-transform transform hover:scale-105 disabled:opacity-50"
              onClick={() => onCreateIncomes()}
              disabled={!(name && amount)}
            >
              Create Income Source
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
