"use client";

import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
function EditBudget({ budgetInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const { user } = useUser();

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo?.icon);
      setAmount(budgetInfo.amount);
      setName(budgetInfo.name);
    }
  }, [budgetInfo]);
  const onUpdateBudget = async () => {
    const result = await db
      .update(Budgets)
      .set({
        name: name,
        amount: amount,
        icon: emojiIcon,
      })
      .where(eq(Budgets.id, budgetInfo.id))
      .returning();

    if (result) {
      refreshData();
      toast("Budget Updated!");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2 items-center bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 dark:from-blue-500 dark:via-indigo-500 dark:to-cyan-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:from-cyan-500 hover:to-blue-500 transition-transform transform hover:scale-105">
            <PenBox className="w-5" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 shadow-2xl rounded-3xl border border-blue-300 dark:border-gray-700">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-30 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-300 via-indigo-300 to-cyan-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 opacity-30 blur-[80px]"></div>
          </div>

          {/* Dialog Header */}
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400">
              Update Budget
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-4">
              Make changes to your budget details below.
            </DialogDescription>
          </DialogHeader>

          {/* Dialog Content */}
          <div className="mt-3 space-y-4">
            {/* Emoji Picker */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="text-lg px-4 py-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-500 text-white font-semibold rounded-full hover:scale-105 transition-transform"
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
            </div>

            {/* Budget Name */}
            <div>
              <h2 className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                Budget Name
              </h2>
              <Input
                placeholder="e.g. Home Decor"
                defaultValue={budgetInfo?.name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 shadow-inner focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              />
            </div>

            {/* Budget Amount */}
            <div>
              <h2 className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                Budget Amount
              </h2>
              <Input
                type="number"
                defaultValue={budgetInfo?.amount}
                placeholder="e.g. 5000₹"
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 shadow-inner focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="sm:justify-start mt-6">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onUpdateBudget()}
                className="w-full py-3 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-500 text-white font-medium rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBudget;
