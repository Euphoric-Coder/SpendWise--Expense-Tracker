"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
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
  formatDate,
  getISTDate,
  getISTDateTime,
  isSameDate,
  nextRecurringDate,
} from "@/utils/utilities";
import { frequencyTypes, incomeCategoriesList } from "@/utils/data";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

function CreateIncomes({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [invalidDate, setInvalidDate] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("salary");
  const [isRecurring, setIsRecurring] = useState(false); // Toggle for recurring income
  const [frequency, setFrequency] = useState("monthly"); // Default frequency
  const [startDate, setStartDate] = useState(getISTDate());
  const { user } = useUser();

  useEffect(() => {
    setInvalidDate(pastDate(startDate));
  }, [startDate]);

  /**
   * To Create New Source of Income
   */
  const onCreateIncomes = async () => {
    if (pastDate(startDate)) {
      toast.error("Start Date cannot be in the past.");
      return;
    }
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
      endDate: !isRecurring ? addOneMonth(getISTDate()) : null,
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
            startDate ? formatDate(startDate) : getISTDate(),
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

  const pastDate = (date) => {
    return (date ? formatDate(date) : getISTDate()) < getISTDate();
  };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setName("");
          setAmount("");
          setCategory("salary");
          setOpenEmojiPicker(false);
          setIsRecurring(false);
          setFrequency("monthly");
          setStartDate("");
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="bg-gradient-to-b from-white via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-10 rounded-2xl justify-center items-center flex flex-col border-2 border-dashed border-blue-300 dark:border-blue-600 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,150,255,0.5)] hover:scale-105 transition-transform transform">
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
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Choose an Emoji
          </h2>
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
        <div className="mt-1">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Income Source Name
          </h2>
          <Input
            type="text"
            placeholder="e.g. Freelance Work"
            className="budg-input-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[2px]"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-1">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Monthly Amount
          </h2>
          <Input
            type="number"
            placeholder="e.g. Rs.8000"
            className="budg-input-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[2px]"
            onChange={(e) => setAmount(e.target.value)}
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
              console.log(e.toLowerCase().split(" ")[0]);
            }}
          >
            <SelectTrigger className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="budg-select-content mt-2">
              <ScrollArea className="max-h-60 overflow-auto">
                {incomeCategoriesList.map((category, index) => (
                  <SelectItem
                    key={index}
                    value={category.toLowerCase().split(" ")[0]}
                    className="budg-select-item"
                  >
                    {category}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        {/* Recurring Income Section */}
        <div
          className="flex items-center justify-between p-4 rounded-3xl 
      bg-gradient-to-r from-cyan-50 via-blue-100 to-indigo-100 
      dark:bg-gradient-to-r dark:from-[#243089] dark:via-[#3a6aa4] dark:to-[#76b2e6] 
      border border-blue-300 dark:border-0 transition-all"
        >
          <div>
            <h3 className="flex gap-2 items-center text-sm font-extrabold tracking-wide text-gray-900 dark:text-white">
              Recurring Income
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
          <div>
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
            <div className="mt-1">
              <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                Start Date (Optional)
              </h2>
              <div className="flex items-center gap-2">
                <Popover modal>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="budg-input-field justify-start"
                    >
                      <CalendarIcon />
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Pick a start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {invalidDate && (
                  <Button
                    size={"sm"}
                    className="del1"
                    onClick={() => setStartDate(getISTDate())}
                  >
                    Clear Date
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {!isRecurring && (
          <Alert
            variant="destructive"
            className="mt-1 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-400 dark:border-gray-600 shadow-lg p-4 rounded-xl flex items-center transition-transform transform"
          >
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <AlertTitle className="text-red-700 dark:text-red-300 font-bold">
                Non-Recurring Income Expiration
              </AlertTitle>
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                Please be aware that non-recurring incomes will automatically
                expire after 1 month.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Invalid Date Alert */}
        {invalidDate && (
          <Alert
            variant="destructive"
            className="mt-1 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-400 dark:border-gray-600 shadow-lg p-4 rounded-xl flex items-center transition-transform transform"
          >
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <AlertTitle className="text-blue-700 dark:text-blue-300 font-bold">
                Invalid Date
              </AlertTitle>
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                Start Date cannot be in the past.
              </AlertDescription>
              <div className="w-full mt-2"></div>
            </div>
          </Alert>
        )}

        {/* Footer Section */}
        <DialogFooter className="mt-2">
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

export default CreateIncomes;
