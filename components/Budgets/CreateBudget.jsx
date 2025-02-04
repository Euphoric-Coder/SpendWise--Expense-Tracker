"use client";

import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Button } from "../ui/button";
import { Budgets } from "@/utils/schema";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import {
  getISTDate,
  getISTDateTime,
  nextRecurringDate,
} from "@/utils/utilities";
import {
  expenseCategoriesList,
  expenseSubcategories,
  frequencyTypes,
} from "@/utils/data";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
  AlertCircle,
  AlertTriangle,
  Eraser,
  PlusCircleIcon,
  RepeatIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ConsoleLogWriter } from "drizzle-orm";
import { format } from "date-fns";

const CreateBudget = ({ refreshData }) => {
  const [name, setname] = useState("");
  const [amount, setamount] = useState();
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false); // Toggle for recurring
  const [frequency, setFrequency] = useState("monthly"); // Default frequency
  const [category, setCategory] = useState("housing");
  const [selectedSubCategories, setSelectedSubCategories] = useState("");
  const selectedCount = selectedSubCategories
    ? selectedSubCategories.split(", ").length
    : 0;

  const expiryDate = getISTDate();
  const renewDate = isRecurring && nextRecurringDate(expiryDate, frequency);

  const theme = useTheme();

  const { user } = useUser();
  const onCreateBudget = async () => {
    const result = await db
      .insert(Budgets)
      .values({
        name: name,
        amount: amount,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        icon: emojiIcon,
        budgetType: isRecurring ? "recurring" : "non-recurring",
        frequency: isRecurring ? frequency : null,
        createdAt: getISTDateTime(),
      })
      .returning({ insertedId: Budgets.id });
    if (result) {
      refreshData();
      toast.success(`New Budget:"${name}" Created!`);
    }
  };

  const clearData = () => {
    setIsRecurring(false);
    setFrequency("monthly");
    setCategory("housing");
    setSelectedSubCategories("");
    setname("");
    setamount("");
  };

  return (
    <Dialog
      onOpenChange={() => {
        setIsRecurring(false);
        setFrequency("monthly");
        setCategory("housing");
        setSelectedSubCategories("");
        setname("");
        setamount("");
      }}
      className="ring-0 ring-offset-0"
    >
      <DialogTrigger>
        <div className="bg-gradient-to-b from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900 dark:to-indigo-950 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed border-indigo-300 dark:border-blue-600 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,200,255,0.5)] hover:scale-105 transition-transform transform">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 dark:from-indigo-400 dark:via-blue-400 dark:to-blue-500">
            +
          </h2>
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 dark:from-teal-400 dark:via-blue-500 dark:to-indigo-400">
            Create New Budget
          </h2>
        </div>
      </DialogTrigger>

      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,200,255,0.3)] w-[95%] max-w-lg max-h-[80vh] md:max-h-[90vh] overflow-y-auto">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-purple-400 via-blue-400 to-transparent dark:from-indigo-800 dark:via-blue-800 dark:to-gray-800 opacity-25 blur-3xl animate-spin-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-teal-300 via-blue-300 to-transparent dark:from-blue-900 dark:via-teal-800 dark:to-gray-800 opacity-30 blur-[120px]"></div>
        </div>
        {/* Dialog Header */}
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400">
            Create New Budget
            {isRecurring && (
              <Badge className="border-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 rounded-3xl text-sm dark:from-green-500 dark:to-green-700">
                Recurring Budget
              </Badge>
            )}
          </DialogTitle>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <DialogDescription className="flex justify-start">
              Fill in the details below to create your budget.
            </DialogDescription>
            <Button onClick={clearData} size="sm" className="budg-btn2">
              <Eraser />
              Clear Data
            </Button>
          </div>
        </DialogHeader>
        {/* Emoji Picker Section */}
        <div className="">
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-indigo-300 dark:border-indigo-600 rounded-full p-4 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-transform"
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
                theme={theme.theme === "dark" ? "dark" : "light"}
              />
            </div>
          )}
        </div>
        {/* Input Fields */}
        <div className="mt-1">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Budget Name
          </h2>
          <Input
            type="text"
            placeholder="e.g. Home Decor"
            className="budg-input-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[2px]"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </div>
        <div className="mt-1">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Budget Amount
          </h2>
          <Input
            type="number"
            placeholder="e.g. Rs.5000"
            className="budg-input-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[2px]"
            value={amount}
            onChange={(e) => setamount(e.target.value)}
          />
        </div>

        {/* Categories  */}
        <div className="mt-1">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Category
          </h2>
          <Select
            value={category.toLowerCase()}
            onValueChange={(e) => {
              setCategory(e);
              setSelectedSubCategories("");
            }}
            // className="block w-full p-2 mb-2 border border-gray-300 rounded-full"
          >
            <SelectTrigger className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]">
              <SelectValue
              // placeholder={category}
              // className="text-lg font-bold"
              />
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
        p-3 shadow-sm rounded-xl border 
        bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900
        border-blue-300 dark:border-blue-500 transition-all"
          >
            <div className="flex items-center justify-between">
              {/* Title & Selected Badge */}
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-white">
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
                    selectedSubCategories.includes(lowerSubCategory);

                  return (
                    <Badge
                      key={subCategory}
                      onClick={() => {
                        setSelectedSubCategories((prev) => {
                          let subCategoriesArray = prev ? prev.split(", ") : [];

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

        {/* Recurring Income Section */}
        <div
          className="flex items-center justify-between p-4 rounded-3xl 
      bg-gradient-to-r from-cyan-50 via-blue-100 to-indigo-100 
      dark:bg-gradient-to-r dark:from-[#243089] dark:via-[#3a6aa4] dark:to-[#76b2e6] 
      border border-blue-300 dark:border-0 transition-all"
        >
          <div>
            <h3 className="flex gap-2 items-center text-sm font-extrabold tracking-wide text-gray-900 dark:text-white">
              Recurring Budget
              {isRecurring && (
                <Badge className="border-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-2 rounded-3xl text-xs dark:from-green-500 dark:to-green-700">
                  Active
                </Badge>
              )}
            </h3>
            <p className="mt-2 text-xs text-gray-900 dark:text-blue-100">
              Enable to automatically allocate a recurring budget each cycle.
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
            <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
              Frequency
            </h2>
            <Select value={frequency} onValueChange={(e) => setFrequency(e)}>
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
                    {frequency.replace(/^./, (char) => char.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Budget Expiration Information  */}
        {name && amount && (
          <Alert
            variant="destructive"
            className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-400 dark:border-gray-600 shadow-lg p-4 rounded-xl flex items-center"
          >
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <AlertTitle className="text-blue-700 dark:text-blue-300 font-bold">
                Budget Expiration Warning
              </AlertTitle>
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                {!isRecurring && (
                  <>
                    Your budget <strong>"{name}"</strong> will expire on{" "}
                    <strong>{format(nextRecurringDate(expiryDate, "monthly"), "PPP")}</strong>.
                  </>
                )}
                {isRecurring && (
                  <>
                    Your budget is{" "}
                    <span className="border-0 p-[2px] bg-gradient-to-r from-green-400 to-green-600 text-white px-2 rounded-3xl text-xs dark:from-green-500 dark:to-green-700">
                      Recurring
                    </span>
                    {" "}
                     and will renew on a <strong>{frequency}</strong>{" "}
                    basis. Next renewal date: <strong>{format(renewDate, "PPP")}</strong>.
                  </>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}
        {/* Footer Section */}
        <DialogFooter className="mt-1">
          <DialogClose asChild>
            <Button
              className="budg-btn1 disabled:opacity-50 [&_svg]:size-5"
              onClick={() => onCreateBudget()}
              disabled={!(name && amount)}
            >
              {isRecurring ? (
                <span className="flex gap-2">
                  <RepeatIcon />
                  <p>Create New Recurring Budget</p>
                </span>
              ) : (
                <span className="flex gap-2">
                  <PlusCircleIcon />
                  <p>Create New Budget</p>
                </span>
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBudget;
