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
} from "../ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Button } from "../ui/button";
import { Budgets } from "@/utils/schema";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

const CreateBudget = ({ refreshData }) => {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const router = useRouter();
  const [name, setname] = useState();
  const [amount, setamount] = useState();

  const { user } = useUser();
  const onCreateBudget = async () => {
    const result = await db
      .insert(Budgets)
      .values({
        name: name,
        amount: amount,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        icon: emojiIcon,
      })
      .returning({ insertedId: Budgets.id });
    if (result) {
      refreshData();
      toast("New Budget Created!");
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-gradient-to-b from-white via-blue-50 to-indigo-50 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed border-indigo-300 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,200,255,0.5)] hover:scale-105 transition-transform transform">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            +
          </h2>
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500">
            Create New Budget
          </h2>
        </div>
      </DialogTrigger>

      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,200,255,0.3)] w-[95%] max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-purple-400 via-blue-400 to-transparent opacity-25 blur-3xl animate-spin-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-teal-300 via-blue-300 to-transparent opacity-30 blur-[120px]"></div>
        </div>

        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 animate-gradient-text">
            Create New Budget
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill in the details below to create your budget.
          </DialogDescription>
        </DialogHeader>

        {/* Emoji Picker Section */}
        <div className="mt-5 flex items-center gap-4 relative">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-indigo-300 rounded-full p-4 bg-gradient-to-r from-white to-blue-50 shadow-md hover:shadow-lg hover:scale-105 transition-transform"
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
          >
            {emojiIcon}
          </Button>

          {/* Emoji Picker */}
          {openEmojiPicker && (
            <div
              className="absolute z-50 top-12 left-0 bg-white shadow-lg rounded-xl p-4"
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
        <div className="mt-6">
          <h2 className="text-gray-700 font-medium mb-2">Budget Name</h2>
          <Input
            type="text"
            placeholder="e.g. Home Decor"
            className="w-full p-4 border rounded-lg shadow-md focus:ring focus:ring-indigo-300 transition duration-200"
            onChange={(e) => setname(e.target.value)}
          />
        </div>
        <div className="mt-6">
          <h2 className="text-gray-700 font-medium mb-2">Budget Amount</h2>
          <Input
            type="number"
            placeholder="e.g. Rs.5000"
            className="w-full p-4 border rounded-lg shadow-md focus:ring focus:ring-indigo-300 transition duration-200"
            onChange={(e) => setamount(e.target.value)}
          />
        </div>

        {/* Footer Section */}
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold shadow-lg hover:shadow-[0_0_30px_rgba(255,100,255,0.5)] transition-transform transform hover:scale-105 disabled:opacity-50"
              onClick={() => onCreateBudget()}
              disabled={!(name && amount)}
            >
              Create Budget
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBudget;
