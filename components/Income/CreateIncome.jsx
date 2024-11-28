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
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { getISTDate, isSameDate } from "@/utils/utilities";

function CreateIncomes({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false); // Toggle for recurring
  const [frequency, setFrequency] = useState("monthly"); // Default frequency
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); // Optional end date for non-recurring

  const { user } = useUser();

  /**
   * To Create New Source of Income
   */
  const onCreateIncomes = async () => {
    try {
      const result = await db
        .insert(Incomes)
        .values({
          name: name,
          amount: amount,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          icon: emojiIcon,
          incomeType: isRecurring ? "recurring" : "non-recurring",
          status: isRecurring ? (isSameDate(startDate, getISTDate()) ? "current" : "upcoming") : "current",
          frequency: isRecurring ? frequency : null,
          startDate: isRecurring
            ? startDate
            : getISTDate(), // Default to today for non-recurring
          endDate: !isRecurring
            ? endDate ||
              new Date(new Date().setMonth(new Date().getMonth() + 1))
                .toISOString()
                .split("T")[0] // Default 1 month for non-recurring
            : null,
        })
        .returning({ insertedId: Incomes.id });

      if (result) {
        refreshData();
        toast.success("New Source of Income has been Created!");
      }
    } catch (error) {
      toast.error("Failed to create income. Please try again.");
      console.error("Error creating income:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-gradient-to-b from-white via-green-50 to-teal-50 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed border-teal-300 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,255,200,0.5)] hover:scale-105 transition-transform transform">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500">
            +
          </h2>
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
            Create New Income
          </h2>
        </div>
      </DialogTrigger>

      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-green-50 to-teal-100 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,255,200,0.3)] w-[95%] max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-teal-400 via-green-400 to-transparent opacity-25 blur-3xl animate-spin-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-cyan-300 via-teal-300 to-transparent opacity-30 blur-[120px]"></div>
        </div>

        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-green-500 to-cyan-500">
            Create New Income Source
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill in the details below to add your income source.
          </DialogDescription>
        </DialogHeader>

        {/* Emoji Picker Section */}
        <div>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-teal-300 rounded-full p-4 bg-gradient-to-r from-white to-green-50 shadow-md hover:shadow-lg hover:scale-105 transition-transform"
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
          <h2 className="text-gray-700 font-medium mb-2">Income Source Name</h2>
          <Input
            type="text"
            placeholder="e.g. Freelance Work"
            className="w-full p-4 border rounded-lg shadow-md focus:ring focus:ring-teal-300 transition duration-200"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-6">
          <h2 className="text-gray-700 font-medium mb-2">Monthly Amount</h2>
          <Input
            type="number"
            placeholder="e.g. Rs.8000"
            className="w-full p-4 border rounded-lg shadow-md focus:ring focus:ring-teal-300 transition duration-200"
            onChange={(e) => setAmount(e.target.value)}
          />
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
            className="text-gray-700 font-medium text-sm"
          >
            Recurring Income
          </label>
        </div>
        {isRecurring && (
          <div className="mt-4">
            <h2 className="text-gray-700 font-medium mb-2">Frequency</h2>
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
              <h2 className="text-gray-700 font-medium mb-2">Start Date</h2>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
        )}
        {!isRecurring && (
          <div className="mt-4">
            <h2 className="text-gray-700 font-medium mb-2">End Date</h2>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}

        {/* Footer Section */}
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-green-500 to-cyan-500 text-white font-bold shadow-lg hover:shadow-[0_0_30px_rgba(0,100,255,0.5)] transition-transform transform hover:scale-105 disabled:opacity-50"
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

export default CreateIncomes;
