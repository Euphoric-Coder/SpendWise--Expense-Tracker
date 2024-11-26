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
          <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform">
            <PenBox className="w-5" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gradient-to-b from-yellow-50 via-orange-50 to-red-50 text-gray-800 shadow-2xl rounded-3xl border border-orange-300">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 opacity-30 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-orange-300 via-red-300 to-yellow-300 opacity-30 blur-[80px]"></div>
          </div>

          {/* Dialog Header */}
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500">
              Update Budget
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-4">
              Make changes to your budget details below.
            </DialogDescription>
          </DialogHeader>

          {/* Dialog Content */}
          <div className="mt-3 space-y-2">
            {/* Emoji Picker */}
            <div className="flex space-y-11">
              <Button
                variant="outline"
                className="text-lg px-4 py-2 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white font-semibold rounded-full hover:scale-105 transition-transform"
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
              <h2 className="text-orange-600 font-medium mb-2">Budget Name</h2>
              <Input
                placeholder="e.g. Home Decor"
                defaultValue={budgetInfo?.name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-800 shadow-inner"
              />
            </div>

            {/* Budget Amount */}
            <div>
              <h2 className="text-orange-600 font-medium mb-2">
                Budget Amount
              </h2>
              <Input
                type="number"
                defaultValue={budgetInfo?.amount}
                placeholder="e.g. 5000₹"
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-800 shadow-inner"
              />
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="sm:justify-start mt-6">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onUpdateBudget()}
                className="w-full py-3 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white font-medium rounded-full shadow-lg hover:scale-105 transition-transform"
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
