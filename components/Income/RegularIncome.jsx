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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  formatToIndianCurrency,
  getISTDate,
  getISTDateTime,
  isSameDate,
  nextRecurringDate,
} from "@/utils/utilities";
import { frequencyTypes, incomeCategoriesList } from "@/utils/data";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { set } from "date-fns";

function RegularIncome({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");

  const [name, setName] = useState("");
  const [basicPay, setBasicPay] = useState();
  const [netIncome, setNetIncome] = useState();
  const [da, setDa] = useState();
  const [hra, setHra] = useState();
  const [otherAllowances, setOtherAllowances] = useState();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("salary");
  const [isNewRegime, setIsNewRegime] = useState(false); // Toggle for recurring
  const [frequency, setFrequency] = useState("monthly"); // Default frequency
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); // Optional end date for non-recurring
  const { user } = useUser();

  // console.log(incomeCategories.filter((item) => item.id === "salary"));

  /**
   * To Create New Source of Income
   */
  const onCreateIncomes = async () => {
    const incomeData = {
      name: name,
      amount: amount,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      icon: emojiIcon,
      incomeType: isNewRegime ? "recurring" : "non-recurring",
      category: category,
      status: isNewRegime
        ? isSameDate(startDate ? startDate : getISTDate(), getISTDate())
          ? "current"
          : "upcoming"
        : "current",
      frequency: isNewRegime ? frequency : null,
      startDate: isNewRegime
        ? startDate
          ? startDate
          : getISTDate()
        : getISTDate(), // Default to today for non-recurring
      endDate: !isNewRegime ? endDate || addOneMonth(getISTDate()) : null,
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
          isNewRegime: isNewRegime,
          frequency: isNewRegime ? frequency : null,
          nextRecurringDate: isNewRegime
            ? nextRecurringDate(startDate, frequency)
            : null,
          lastProcessed: isSameDate(
            startDate ? startDate : getISTDate(),
            getISTDate()
          )
            ? getISTDate()
            : null,
          status: isNewRegime
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

  function calculateNetIncome(basicPay, da, hra, otherAllowances, isNewRegime) {
    const totalIncome = basicPay + da + hra + otherAllowances;
    let tax = 0;

    if (isNewRegime) {
      // New Tax Regime (2025) slabs
      if (totalIncome <= 400000) {
        tax = 0;
      } else if (totalIncome <= 800000) {
        tax = (totalIncome - 400000) * 0.05;
      } else if (totalIncome <= 1200000) {
        tax = 20000 + (totalIncome - 800000) * 0.1;
      } else if (totalIncome <= 1600000) {
        tax = 60000 + (totalIncome - 1200000) * 0.15;
      } else if (totalIncome <= 2000000) {
        tax = 120000 + (totalIncome - 1600000) * 0.2;
      } else if (totalIncome <= 2400000) {
        tax = 200000 + (totalIncome - 2000000) * 0.25;
      } else {
        tax = 300000 + (totalIncome - 2400000) * 0.3;
      }

      // Apply rebate for income up to Rs. 12,00,000
      if (totalIncome <= 1200000) {
        tax = 0;
      }
    } else {
      // Old Tax Regime slabs
      const standardDeduction = 75000; // Standard deduction under Old Regime for salaried individuals
      const exemptHRA = Math.min(hra, totalIncome * 0.4); // HRA exemption calculation
      const taxableIncome = totalIncome - standardDeduction - exemptHRA;

      if (taxableIncome <= 250000) {
        tax = 0;
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2;
      } else {
        tax = 112500 + (taxableIncome - 1000000) * 0.3;
      }
    }

    // Add 4% health and education cess to the tax
    tax = tax + tax * 0.04;

    // Calculate net income
    const netIncome = totalIncome - tax;
    return {
      totalIncome: totalIncome,
      tax: tax.toFixed(2),
      netIncome: netIncome.toFixed(2),
    };
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setBasicPay("");
          setNetIncome("");
          setDa("");
          setHra("");
          setOtherAllowances("");
          setIsNewRegime(false);
        }
      }}
    >
      <DialogTrigger>
        <div className="bg-gradient-to-b from-white via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed border-blue-300 dark:border-blue-600 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,150,255,0.5)] hover:scale-105 transition-transform transform">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
            +
          </h2>
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400">
            Add Regular Income
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
            Add Regular Income
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Fill in the details below to add your income source.
          </DialogDescription>
        </DialogHeader>

        {/* Input Fields */}
        <div className="mt-1">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Basic Pay
          </h2>
          <Input
            type="text"
            placeholder="Rs. 1,50,000"
            className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]"
            value={basicPay}
            onChange={(e) => {
              let inputValue = e.target.value;
              // Remove commas and non-numeric characters, then format
              inputValue = inputValue.replace(/[^0-9]/g, "");
              setBasicPay(formatToIndianCurrency(inputValue));
            }}
          />
        </div>
        <div className="mt-1">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Dearness Allowance (DA)
          </h2>
          <Input
            type="number"
            placeholder="e.g. Rs.8000"
            className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]"
            value={da}
            onChange={(e) => {
              let inputValue = e.target.value;
              // Remove commas and non-numeric characters, then format
              inputValue = inputValue.replace(/[^0-9]/g, "");
              setDa(formatToIndianCurrency(inputValue));
            }}
          />
        </div>
        <div className="mt-1">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            House Rent Allowance (HRA)
          </h2>
          <Input
            type="number"
            placeholder="e.g. Rs.8000"
            className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]"
            value={hra}
            onChange={(e) => {
              let inputValue = e.target.value;
              // Remove commas and non-numeric characters, then format
              inputValue = inputValue.replace(/[^0-9]/g, "");
              setHra(formatToIndianCurrency(inputValue));
            }}
          />
        </div>
        <div className="mt-1">
          <h2 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Other Allowances
          </h2>
          <Input
            type="number"
            placeholder="e.g. Rs.8000"
            className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]"
            value={otherAllowances}
            onChange={(e) => {
              let inputValue = e.target.value;
              // Remove commas and non-numeric characters, then format
              inputValue = inputValue.replace(/[^0-9]/g, "");
              setOtherAllowances(formatToIndianCurrency(inputValue));
            }}
          />
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
              New Income Regime
              {isNewRegime && (
                <Badge className="border-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-2 rounded-3xl text-xs dark:from-green-500 dark:to-green-700">
                  Active
                </Badge>
              )}
            </h3>
            <p className="mt-2 text-xs text-gray-900 dark:text-blue-100">
              New regime will be effective from the start date.
            </p>
          </div>

          <Switch
            checked={isNewRegime}
            onCheckedChange={(e) => setIsNewRegime(e)}
            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-400 
        dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-blue-300 border-2 border-blue-400 dark:border-indigo-200"
          />
        </div>

        {isNewRegime && <div className="mt-1">Lorem ipsum dolor sit amet.</div>}

        {/* Footer Section */}
        <DialogFooter className="mt-6">
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

export default RegularIncome;
