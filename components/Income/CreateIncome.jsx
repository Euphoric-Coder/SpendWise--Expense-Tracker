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
          frequency: isRecurring ? frequency : null,
          startDate: isRecurring
            ? startDate
            : new Date().toISOString().split("T")[0], // Default to today for non-recurring
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
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-gradient-to-b from-white via-blue-50 to-indigo-50 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed border-indigo-200 cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              +
            </h2>
            <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500">
              Create New Income
            </h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Income Source</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Source Name</h2>
                  <Input
                    placeholder="e.g. Youtube"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">
                    Monthly Amount
                  </h2>
                  <Input
                    type="number"
                    placeholder="e.g. 5000$"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Checkbox
                    id="recurring"
                    checked={isRecurring}
                    onCheckedChange={(value) => setIsRecurring(value)}
                  />
                  <label
                    htmlFor="recurring"
                    className="text-black font-medium text-sm"
                  >
                    Recurring Income
                  </label>
                </div>
                {isRecurring && (
                  <div className="mt-4">
                    <h2 className="text-black font-medium my-1">Frequency</h2>
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
                    <div className="mt-2">
                      <h2 className="text-black font-medium my-1">
                        Start Date
                      </h2>
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
                    <h2 className="text-black font-medium my-1">End Date</h2>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onCreateIncomes()}
                className="mt-5 w-full rounded-full"
              >
                Create Income Source
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateIncomes;
