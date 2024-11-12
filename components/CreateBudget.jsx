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
} from "./ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Button } from "./ui/button";
import { Budgets } from "@/utils/schema";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

const CreateBudget = ({refreshData}) => {
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
      refreshData()
      toast("New Budget Created!");
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-gradient-to-b from-white via-blue-50 to-indigo-50 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed border-indigo-200 cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            +
          </h2>
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500">
            Create New Budget
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-6 rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500">
            Create New Budget
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill in the details below to create your budget.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-indigo-300 hover:bg-gradient-to-r from-teal-100 via-blue-100 to-indigo-100"
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
          >
            {emojiIcon}
          </Button>
        </div>
        <div className="relative">
          <EmojiPicker
            open={openEmojiPicker}
            onEmojiClick={(e) => {
              setEmojiIcon(e.emoji);
              setOpenEmojiPicker(false);
            }}
          />
        </div>
        <div className="mt-2">
          <h2 className="text-black font-medium my-1">Budget Name</h2>
          <Input
            type="text"
            placeholder="e.g. Home Decor"
            className="border rounded-lg shadow-sm focus:ring focus:ring-indigo-200"
            onChange={(e) => setname(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <h2 className="text-black font-medium my-1">Budget Amount</h2>
          <Input
            type="number"
            placeholder="e.g. Rs.5000"
            className="border rounded-lg shadow-sm focus:ring focus:ring-indigo-200"
            onChange={(e) => setamount(e.target.value)}
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              className={`mt-5 w-full rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:opacity-90 transition-opacity`}
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
