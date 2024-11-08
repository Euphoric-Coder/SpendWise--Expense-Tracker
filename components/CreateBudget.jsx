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

const CreateBudget = () => {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

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
    console.log(result);
    if (result) {
      toast("New Budget Created!");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <div className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="mt-5 ">
            <Button
              variant="outline"
              size="lg"
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
              placeholder="e.g.Home Decor"
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <h2 className="text-black font-medium my-1">Budget Amount</h2>
            <Input
              type="number"
              placeholder="e.g.Rs.5000"
              onChange={(e) => setamount(e.target.value)}
            />
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                className="mt-5 w-full rounded-2xl"
                onClick={() => onCreateBudget()}
                disabled={!(name && amount)}
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBudget;
