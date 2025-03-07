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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import {
  expenseCategoriesList,
  expenseSubcategories,
  frequencyTypes,
} from "@/utils/data";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
function EditBudget({ budgetInfo, refreshData, isExpense = false }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState("");
  const [isRecurring, setIsRecurring] = useState(false); // Toggle for recurring
  const [frequency, setFrequency] = useState("monthly"); // Default frequency
  const [selectedSubCategories, setSelectedSubCategories] = useState("");
  const selectedCount = selectedSubCategories
    ? selectedSubCategories.split(", ").length
    : 0;

  const { user } = useUser();

  const onUpdateBudget = async () => {
    const result = await db
      .update(Budgets)
      .set({
        icon: emojiIcon,
        name: name,
        amount: amount,
        category: category,
        subCategory: selectedSubCategories,
        budgetType: isRecurring ? "recurring" : "non-recurring",
        frequency: isRecurring ? frequency : null,
      })
      .where(eq(Budgets.id, budgetInfo.id))
      .returning();

    if (result) {
      refreshData();
      toast("Budget Updated!");
    }
  };

  const editLoader = () => {
    setEmojiIcon(budgetInfo?.icon);
    setAmount(budgetInfo.amount);
    setName(budgetInfo.name);
    setCategory(budgetInfo.category);
    setSelectedSubCategories(budgetInfo.subCategory);
    setIsRecurring(budgetInfo.budgetType === "recurring");
    setFrequency(budgetInfo.frequency || "monthly");
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={`${
              isExpense ? "expense-btn1 rounded-2xl" : "budg-btn4 rounded-3xl"
            } `}
            onClick={() => {
              editLoader();
            }}
          >
            <PenBox /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="border-2 border-blue-200 p-8 bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl overflow-auto">
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
              <h2 className="budg-text">Budget Name</h2>
              <Input
                placeholder="e.g. Home Decor"
                defaultValue={budgetInfo?.name}
                onChange={(e) => setName(e.target.value)}
                className="exp-input-field focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px]"
              />
            </div>

            {/* Budget Amount */}
            <div>
              <h2 className="budg-text">Budget Amount</h2>
              <Input
                type="number"
                defaultValue={budgetInfo?.amount}
                placeholder="e.g. 5000₹"
                onChange={(e) => setAmount(e.target.value)}
                className="exp-input-field focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px]"
              />
            </div>

            {/* Categories  */}
            <div className="mt-1">
              <h2 className="budg-text">Category</h2>
              <Select
                value={category.toLowerCase()}
                onValueChange={(e) => {
                  setCategory(e);
                  setSelectedSubCategories("");
                }}
              >
                <SelectTrigger className="exp-input-field focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-[3px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="budg-select-content mt-2">
                  <ScrollArea className="max-h-60 overflow-auto">
                    {expenseCategoriesList.map((category, index) => (
                      <SelectItem
                        key={index}
                        value={category.toLowerCase()}
                        className="budg-select-item"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Categories (Only Show When Category is Selected) */}
            {category && expenseSubcategories[category] && (
              <div
                className="relative max-h-[200px] mt-2 overflow-y-auto 
                    p-3 shadow-sm rounded-xl
                    bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900
                    border-2 border-blue-500 dark:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Title & Selected Badge */}
                  <div className="flex items-center gap-2">
                    <label className="budg-text">
                      Sub-Categories (
                      {new Set(expenseSubcategories[category] || []).size})
                    </label>

                    {/* Show Selected Count Badge */}
                    {selectedCount > 0 && (
                      <Badge className="border-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-2 py-1 rounded-full text-xs dark:from-green-500 dark:to-green-700 ">
                        Selected: {selectedCount}
                      </Badge>
                    )}
                  </div>
                  <div>
                    {/* Clear Button */}
                    {selectedCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedSubCategories("")}
                        className="text-sm rounded-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 dark:border-gray-300"
                        size="sm"
                      >
                        Clear Selection
                      </Button>
                    )}
                  </div>
                </div>

                {/* Subcategories List */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[...new Set(expenseSubcategories[category] || [])].map(
                    (subCategory) => {
                      const lowerSubCategory = subCategory.toLowerCase();
                      const isSelected =
                        selectedSubCategories?.includes(lowerSubCategory);

                      return (
                        <Badge
                          key={subCategory}
                          onClick={() => {
                            setSelectedSubCategories((prev) => {
                              let subCategoriesArray = prev
                                ? prev.split(", ")
                                : [];

                              if (isSelected) {
                                subCategoriesArray = subCategoriesArray.filter(
                                  (c) => c !== lowerSubCategory
                                );
                              } else {
                                subCategoriesArray.push(lowerSubCategory);
                              }

                              return subCategoriesArray.join(", ");
                            });
                          }}
                          className={`border-0 rounded-full text-sm cursor-pointer px-3 py-1 transition-all
                              ${
                                isSelected
                                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                              }`}
                        >
                          {subCategory}
                        </Badge>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Recurring Budget Section */}
            <div
              className="flex items-center justify-between p-4 rounded-3xl 
      bg-gradient-to-r from-cyan-50 via-blue-100 to-indigo-100 
      dark:bg-gradient-to-r dark:from-[#243089] dark:via-[#3a6aa4] dark:to-[#76b2e6] 
      border border-blue-300 dark:border-0 transition-all"
            >
              <div>
                <h3 className="flex gap-2 items-center budg-text text-sm font-extrabold tracking-wide">
                  Recurring Budget
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
              <div className="mt-1">
                <h2 className="budg-text">Recurring Interval</h2>
                <Select
                  value={frequency}
                  onValueChange={(e) => setFrequency(e)}
                >
                  <SelectTrigger className="exp-input-field focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-[3px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="budg-select-content">
                    {frequencyTypes.map((frequency, index) => (
                      <SelectItem
                        key={index}
                        value={frequency}
                        className="budg-select-item"
                      >
                        {frequency.replace(/^./, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="sm:justify-start mt-6">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onUpdateBudget()}
                className="expense-btn2 rounded-full"
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
