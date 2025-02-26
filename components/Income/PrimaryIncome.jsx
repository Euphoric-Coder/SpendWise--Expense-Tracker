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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { PrimaryIncome, Transactions } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  formatCurrency,
  formatToIndianCurrency,
  getISTDate,
  getISTDateTime,
  isSameDate,
  nextRecurringDate,
  normalizeAmount,
} from "@/utils/utilities";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { eq } from "drizzle-orm";
import Image from "next/image";
import {
  Eraser,
  History,
  NotepadTextIcon,
  PenBox,
  PlusCircleIcon,
  ShieldCloseIcon,
  Sparkle,
  Trash,
} from "lucide-react";
import { getSuggestions } from "@/utils/aiSuggest";

function addRegularIncome({ refreshData }) {
  const maxLength = 25;
  const [name, setName] = useState("");
  const [remainingChars, setRemainingChars] = useState(maxLength);
  const [warning, setWarning] = useState(false);
  const [regularIncomeData, setRegularIncomeData] = useState([]);
  const [basicPay, setBasicPay] = useState("");
  const [da, setDa] = useState("");
  const [hra, setHra] = useState("");
  const [otherAllowances, setOtherAllowances] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("salary");
  const [isNewRegime, setIsNewRegime] = useState(false); // Toggle for recurring
  const [frequency, setFrequency] = useState("monthly"); // Default frequency
  const [startDate, setStartDate] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [incomeDescription, setIncomeDescription] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    user && fetchOrCreateRegularIncome();
  }, [user]);

  // Update remainingChars when input field is loaded with data
  useEffect(() => {
    setRemainingChars(maxLength - name.length);
    setWarning(name.length > maxLength);
  }, [name]); // Runs whenever `name` is updated (including on input field load)

  const startEditing = (income) => {
    setName(income.name);
    setBasicPay(income.basicPay);
    setIsNewRegime(income.isNewRegime);
    setDa(income.da);
    setHra(income.hra);
    setOtherAllowances(income.otherAllowances);
    setIsNewRegime(income.isNewRegime);
  };

  const { netIncome, grossIncome, tax } = calculateNetIncome(
    normalizeAmount(basicPay),
    normalizeAmount(da),
    normalizeAmount(hra),
    normalizeAmount(otherAllowances),
    isNewRegime
  );

  const fetchOrCreateRegularIncome = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    // Check if an entry already exists for the user
    const result = await db
      .select()
      .from(PrimaryIncome)
      .where(
        eq(PrimaryIncome.createdBy, user.primaryEmailAddress.emailAddress)
      );

    if (result.length === 0) {
      // There is no entry for the user, so the state is an empty array
      setRegularIncomeData([]);
    } else {
      // If entry exists, you can fetch and use it if necessary
      setRegularIncomeData(result);
      console.log("Entry already exists:", result[0]);
    }
  };

  /**
   * To Create New Source of Income
   */
  const createRegularIncome = async () => {
    const primaryIncome = {
      name: name,
      basicPay: normalizeAmount(basicPay),
      grossIncome:
        normalizeAmount(basicPay) +
        normalizeAmount(da) +
        normalizeAmount(hra) +
        normalizeAmount(otherAllowances),
      netIncome: netIncome,
      da: normalizeAmount(da),
      hra: normalizeAmount(hra),
      otherAllowances: normalizeAmount(otherAllowances),
      taxDeductions: tax,
      isNewRegime: isNewRegime,
      monthlyPay: netIncome / 12,
      createdBy: user.primaryEmailAddress.emailAddress,
    };
    try {
      const result = await db
        .insert(PrimaryIncome)
        .values(primaryIncome)
        .returning({ insertedId: PrimaryIncome.id });

      // const transaction = await db
      //   .insert(Transactions)
      //   .values({
      //     referenceId: result[0].insertedId,
      //     type: "income",
      //     category: "salary",
      //     isNewRegime: isNewRegime,
      //     frequency: isNewRegime ? frequency : null,
      //     nextRecurringDate: isNewRegime
      //       ? nextRecurringDate(startDate, frequency)
      //       : null,
      //     lastProcessed: isSameDate(
      //       startDate ? startDate : getISTDate(),
      //       getISTDate()
      //     )
      //       ? getISTDate()
      //       : null,
      //     status: isNewRegime
      //       ? isSameDate(startDate ? startDate : getISTDate(), getISTDate())
      //         ? "active"
      //         : "upcoming"
      //       : "active",
      //     name: name,
      //     amount: amount,
      //     createdBy: incomeData.createdBy,
      //     createdAt: incomeData.createdAt,
      //   })
      //   .returning({ insertedId: Transactions.id });

      if (result) {
        fetchOrCreateRegularIncome();
        toast.success("New Source of Income has been Created!");
      }
    } catch (error) {
      toast.error("Failed to create income. Please try again.");
      console.error("Error creating income:", error);
    }
  };

  const updateRegularIncome = async () => {
    const primaryIncome = {
      name: name,
      basicPay: normalizeAmount(basicPay),
      grossIncome:
        normalizeAmount(basicPay) +
        normalizeAmount(da) +
        normalizeAmount(hra) +
        normalizeAmount(otherAllowances),
      netIncome: netIncome,
      da: normalizeAmount(da),
      hra: normalizeAmount(hra),
      otherAllowances: normalizeAmount(otherAllowances),
      taxDeductions: tax,
      isNewRegime: isNewRegime,
      monthlyPay: netIncome / 12,
      createdBy: user.primaryEmailAddress.emailAddress,
      lastUpdated: getISTDateTime(),
    };
    const result = await db
      .update(PrimaryIncome)
      .set(primaryIncome)
      .where(eq(PrimaryIncome.createdBy, user.primaryEmailAddress.emailAddress))
      .returning();

    if (result) {
      fetchOrCreateRegularIncome();
      toast.success("Budget Updated!");
    }
  };

  const deleteRegularIncome = async () => {
    await db
      .delete(PrimaryIncome)
      .where(eq(PrimaryIncome.createdBy, user.primaryEmailAddress.emailAddress))
      .returning();
    fetchOrCreateRegularIncome();
    toast.success("Income Source Deleted Successfully!");
  };

  function calculateNetIncome(basicPay, da, hra, otherAllowances, isNewRegime) {
    const totalIncome =
      Number(basicPay) + Number(da) + Number(hra) + Number(otherAllowances);
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
      netIncome: netIncome,
      grossIncome: totalIncome,
      tax: tax,
    };
  }

  const charLimit = (e) => {
    const value = e.target.value;

    if (value.length > maxLength) {
      setWarning(true);
    } else {
      setWarning(false);
    }

    setName(value.slice(0, maxLength + 1)); // Ensure input is always within limit
    setRemainingChars(Math.max(0, maxLength - value.length));
  };

  const clearData = () => {
    setName("");
    setBasicPay("");
    setDa("");
    setHra("");
    setOtherAllowances("");
    setIsNewRegime(false);
    setRemainingChars(maxLength);
  };

  const fetchSuggestions = async () => {
    if (!incomeDescription.trim()) return;
    setLoading(true);
    const generatedSuggestions = await getSuggestions(
      incomeDescription,
      maxLength
    );
    setSuggestions(generatedSuggestions);
    setLoading(false);
  };

  return (
    <div>
      {regularIncomeData.length === 0 ? (
        <Dialog
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setName("");
              setBasicPay("");
              setDa("");
              setHra("");
              setOtherAllowances("");
              setIsNewRegime(false);
              setRemainingChars(maxLength);
            }
          }}
        >
          <DialogTrigger asChild>
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
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Fill in the details below to add your income source.
                </DialogDescription>
                <Button onClick={clearData} size="sm" className="inc-btn2">
                  <Eraser />
                  Clear Data
                </Button>
              </div>
            </DialogHeader>

            {/* Input Fields */}
            <div className="mt-1">
              <h2 className="budg-text1">Source of Income</h2>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. Freelance Work"
                  className="budg-input-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px] pr-12"
                  value={name}
                  onChange={charLimit}
                />
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                    warning
                      ? "text-red-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {remainingChars > 0 ? remainingChars : 0} Characters Left
                </span>
              </div>
              {warning && name.length >= maxLength && (
                <p className="text-red-500 text-sm mt-1">
                  Character limit exceeded!
                </p>
              )}

              <Popover
                open={popoverOpen}
                onOpenChange={() => {
                  setPopoverOpen(!popoverOpen);
                  setIncomeDescription("");
                  setSuggestions([]);
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="link"
                    className="p-0 m-0 text-blue-600 dark:text-blue-400"
                  >
                    Get AI Suggestions
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-4 w-72 rounded-3xl">
                  <p className="text-gray-500 text-sm mb-2">
                    Describe your income source:
                  </p>
                  <Input
                    type="text"
                    placeholder="e.g. Content Writing"
                    value={incomeDescription}
                    onChange={(e) => setIncomeDescription(e.target.value)}
                    className="exp-input-field focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px] mb-3"
                  />
                  <Button
                    onClick={fetchSuggestions}
                    className="expense-btn2 w-full rounded-3xl mb-3"
                    disabled={loading || !incomeDescription}
                  >
                    {loading ? "Generating..." : "Get Suggestions"}
                  </Button>

                  {suggestions.length > 0 && (
                    <ul className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        >
                          <span>{suggestion}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setName(suggestion);
                              setRemainingChars(maxLength - suggestion.length);
                              setPopoverOpen(false);
                            }}
                          >
                            Add
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div className="-mt-4">
              <h2 className="budg-text1">Basic Pay</h2>
              <Input
                type="text"
                placeholder="Rs. 1,50,000"
                className="budg-select-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px]"
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
              <h2 className="budg-text1">Dearness Allowance (DA)</h2>
              <Input
                type="text"
                placeholder="e.g. Rs.8000"
                className="budg-select-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px]"
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
              <h2 className="budg-text1">House Rent Allowance (HRA)</h2>
              <Input
                type="text"
                placeholder="e.g. Rs.8000"
                className="budg-select-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px]"
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
              <h2 className="budg-text1">Other Allowances</h2>
              <Input
                type="text"
                placeholder="e.g. Rs.8000"
                className="budg-select-field focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px]"
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
                <h3 className="flex gap-2 items-center budg-text font-extrabold tracking-wide">
                  New Income Regime
                  {isNewRegime && (
                    <Badge className="border-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-2 rounded-3xl text-xs dark:from-green-500 dark:to-green-700">
                      Active
                    </Badge>
                  )}
                </h3>
                <p className="mt-2 text-xs font-bold text-gray-900 dark:text-white">
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

            {/* Income Overview  */}
            {name && basicPay && da && hra && otherAllowances && (
              <div
                className="flex items-center justify-between p-4 rounded-3xl 
    bg-gradient-to-r from-cyan-50 via-blue-100 to-indigo-100 
    dark:bg-gradient-to-r dark:from-[#243089] dark:via-[#3a6aa4] dark:to-[#76b2e6] 
    border border-blue-300 dark:border-0 transition-all"
              >
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide text-blue-900 dark:text-blue-200">
                    Income Overview
                  </h3>

                  {/* Gross Income */}
                  <p className="mt-2 text-xs text-blue-800 dark:text-blue-300">
                    <strong>Gross Income (Before Taxes):</strong>{" "}
                    {formatToIndianCurrency(grossIncome)}
                  </p>

                  {/* Net Income */}
                  <p className="mt-2 text-xs text-blue-800 dark:text-blue-300">
                    <strong>Net Income After Taxes:</strong>{" "}
                    {formatToIndianCurrency(netIncome)}
                  </p>

                  {/* Tax Levied */}
                  <p className="mt-2 text-xs text-blue-800 dark:text-blue-300">
                    <strong>Tax Levied:</strong> {formatToIndianCurrency(tax)}
                  </p>
                </div>

                {/* Badge for Tax Status */}
                {tax > 0 && (
                  <Badge className="border-0 bg-gradient-to-r from-red-400 to-red-600 text-white px-2 rounded-3xl text-xs dark:from-red-500 dark:to-red-700">
                    Taxes Applied
                  </Badge>
                )}
              </div>
            )}

            {/* Footer Section */}
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button
                  className="inc-btn3 disabled:opacity-50 [&_svg]:size-5"
                  onClick={() => createRegularIncome()}
                  disabled={!(basicPay && da && hra && otherAllowances)}
                >
                  <span className="flex gap-2">
                    <PlusCircleIcon />
                    <p>Create New Budget</p>
                  </span>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div
          className={`relative p-8 mb-8 border-2 rounded-3xl bg-gradient-to-b from-white via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl transition-transform transform hover:scale-105`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Header Section with Gradient Title */}
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
                <Image
                  src={"/salary.png"}
                  alt=""
                  width={40}
                  height={40}
                  draggable={false}
                />
              </div>
              <div>
                <h2 className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  {regularIncomeData[0].name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Detailed breakdown of your monthly income.
                </p>
              </div>
            </div>

            {/* Monthly Pay */}
            <h2
              className={`font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-300 dark:to-cyan-300`}
            >
              {formatCurrency(regularIncomeData[0].monthlyPay)} / month
            </h2>
          </div>

          {/* View, Edit and Delete Buttons */}
          <div className="flex items-center justify-end gap-3 mt-1">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              className={`px-6 py-3 [&_svg]:size-6 text-sm font-bold uppercase rounded-xl transition-all focus:outline-none shadow-md ${
                showDetails ? "del1" : "inc-btn2"
              }`}
            >
              {showDetails ? <ShieldCloseIcon /> : <NotepadTextIcon />}
              {showDetails ? "Hide Details" : "View Details"}
            </Button>
            <Dialog
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setName("");
                  setBasicPay("");
                  setDa("");
                  setHra("");
                  setOtherAllowances("");
                  setIsNewRegime(false);
                  setRemainingChars(maxLength);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => startEditing(regularIncomeData[0])}
                  className="inc-btn2"
                >
                  <PenBox />
                  Edit
                </Button>
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
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                      Fill in the details below to add your income source.
                    </DialogDescription>
                    <Button onClick={clearData} size="sm" className="inc-btn2">
                      <Eraser />
                      Clear Data
                    </Button>
                  </div>
                </DialogHeader>

                {/* Input Fields */}
                <div className="mt-1">
                  <h2 className="budg-text1">Source of Income</h2>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="e.g. Freelance Work"
                      className="budg-select-field focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px] mb-3 pr-12"
                      value={name}
                      onChange={charLimit} // Using the fixed charLimit function
                    />
                    <span
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                        warning
                          ? "text-red-500"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {remainingChars > 0 ? (
                        <>{remainingChars} Character(s) Left</>
                      ) : (
                        <>0</>
                      )}
                    </span>
                  </div>
                  {warning && name.length >= maxLength && (
                    <p className="text-red-500 text-sm mt-1">
                      Character limit exceeded!
                    </p>
                  )}
                  <Popover
                    open={popoverOpen}
                    onOpenChange={() => {
                      setPopoverOpen(!popoverOpen);
                      setIncomeDescription("");
                      setSuggestions([]);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="link"
                        className="p-0 m-0 text-blue-600 dark:text-blue-400 animate-pulse transition-all duration-[2000ms]"
                      >
                        <Sparkle className="animate-out" />
                        Get AI Suggestions
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 w-72 rounded-3xl">
                      <p className="text-gray-500 text-sm mb-2">
                        Describe your income source:
                      </p>
                      <Input
                        type="text"
                        placeholder="e.g. Content Writing"
                        value={incomeDescription}
                        onChange={(e) => setIncomeDescription(e.target.value)}
                        className="exp-input-field focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-[3px] mb-3"
                      />
                      <Button
                        onClick={fetchSuggestions}
                        className="expense-btn2 w-full rounded-3xl mb-3"
                        disabled={loading || !incomeDescription}
                      >
                        {loading ? "Generating..." : "Get Suggestions"}
                      </Button>

                      {suggestions.length > 0 && (
                        <ul className="space-y-1">
                          {suggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                              <span>{suggestion}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setName(suggestion);
                                  setRemainingChars(
                                    maxLength - suggestion.length
                                  );
                                  setPopoverOpen(false);
                                }}
                              >
                                Add
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="-mt-4">
                  <h2 className="budg-text1">Basic Pay</h2>
                  <Input
                    type="text"
                    placeholder="Rs. 1,50,000"
                    className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]"
                    value={formatToIndianCurrency(basicPay)}
                    onChange={(e) => {
                      toString;
                      let inputValue = e.target.value;
                      // Remove commas and non-numeric characters, then format
                      inputValue = inputValue.replace(/[^0-9]/g, "");
                      setBasicPay(inputValue);
                    }}
                  />
                </div>
                <div className="mt-1">
                  <h2 className="budg-text1">Dearness Allowance (DA)</h2>
                  <Input
                    type="text"
                    placeholder="e.g. Rs.8000"
                    className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]"
                    value={formatToIndianCurrency(da)}
                    onChange={(e) => {
                      let inputValue = e.target.value;
                      // Remove commas and non-numeric characters, then format
                      inputValue = inputValue.replace(/[^0-9]/g, "");
                      setDa(inputValue);
                    }}
                  />
                </div>
                <div className="mt-1">
                  <h2 className="budg-text1">House Rent Allowance (HRA)</h2>
                  <Input
                    type="text"
                    placeholder="e.g. Rs.8000"
                    className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]"
                    value={formatToIndianCurrency(hra)}
                    onChange={(e) => {
                      let inputValue = e.target.value;
                      // Remove commas and non-numeric characters, then format
                      inputValue = inputValue.replace(/[^0-9]/g, "");
                      setHra(inputValue);
                    }}
                  />
                </div>
                <div className="mt-1">
                  <h2 className="budg-text1">Other Allowances</h2>
                  <Input
                    type="text"
                    placeholder="e.g. Rs.8000"
                    className="budg-select-field focus:ring-cyan-400 dark:focus:ring-blue-400 focus:ring-[3px]"
                    value={formatToIndianCurrency(otherAllowances)}
                    onChange={(e) => {
                      let inputValue = e.target.value;
                      // Remove commas and non-numeric characters, then format
                      inputValue = inputValue.replace(/[^0-9]/g, "");
                      setOtherAllowances(inputValue);
                    }}
                  />
                </div>

                {/* New Income Regime Section */}
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

                {/* Income Overview  */}
                {name && basicPay && da && hra && otherAllowances && (
                  <div
                    className="flex items-center justify-between p-4 rounded-3xl 
    bg-gradient-to-r from-cyan-50 via-blue-100 to-indigo-100 
    dark:bg-gradient-to-r dark:from-[#243089] dark:via-[#3a6aa4] dark:to-[#76b2e6] 
    border border-blue-300 dark:border-0 transition-all"
                  >
                    <div>
                      <h3 className="text-sm font-extrabold tracking-wide text-blue-900 dark:text-blue-200">
                        Income Overview
                      </h3>

                      {/* Gross Income */}
                      <p className="mt-2 text-xs text-blue-800 dark:text-blue-300">
                        <strong>Gross Income (Before Taxes):</strong>{" "}
                        {formatToIndianCurrency(grossIncome)}
                      </p>

                      {/* Net Income */}
                      <p className="mt-2 text-xs text-blue-800 dark:text-blue-300">
                        <strong>Net Income After Taxes:</strong>{" "}
                        {formatToIndianCurrency(netIncome)}
                      </p>

                      {/* Tax Levied */}
                      <p className="mt-2 text-xs text-blue-800 dark:text-blue-300">
                        <strong>Tax Levied:</strong>{" "}
                        {formatToIndianCurrency(tax) === ""
                          ? "0"
                          : formatToIndianCurrency(tax)}
                      </p>
                    </div>

                    {/* Badge for Tax Status */}
                    {tax > 0 && (
                      <Badge className="border-0 bg-gradient-to-r from-red-400 to-red-600 text-white px-2 rounded-3xl text-xs dark:from-red-500 dark:to-red-700">
                        Taxes Applied
                      </Badge>
                    )}
                  </div>
                )}

                {/* Footer Section */}
                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 dark:from-blue-600 dark:via-cyan-500 dark:to-teal-500 text-white font-bold shadow-lg hover:shadow-[0_0_30px_rgba(0,100,255,0.5)] transition-transform transform hover:scale-105 disabled:opacity-50"
                      onClick={() => {
                        calculateNetIncome(
                          basicPay,
                          da,
                          hra,
                          otherAllowances,
                          isNewRegime
                        );
                        updateRegularIncome();
                      }}
                      disabled={!(basicPay && da && hra && otherAllowances)}
                    >
                      Update Monthly Income
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="del1">
                  <Trash className="w-7 h-7" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-blue-50 to-cyan-200 dark:from-gray-800 dark:via-gray-900 dark:to-blue-800 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,150,255,0.3)] dark:shadow-[0_0_40px_rgba(0,75,150,0.5)] w-[95%] max-w-lg">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-blue-500 via-blue-400 to-transparent dark:from-blue-900 dark:via-gray-800 dark:to-transparent opacity-25 blur-3xl"></div>
                  <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-cyan-400 via-blue-300 to-transparent dark:from-cyan-800 dark:via-blue-900 dark:to-transparent opacity-30 blur-[120px]"></div>
                </div>

                {/* Dialog Header */}
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 dark:from-blue-300 dark:via-cyan-400 dark:to-blue-500">
                    Are you absolutely sure to delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    This action cannot be undone. This will permanently delete
                    your income "{regularIncomeData[0].name}" and all of its
                    associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Dialog Footer */}
                <AlertDialogFooter className="flex gap-4 mt-6">
                  <AlertDialogCancel className="w-full py-3 rounded-2xl border border-blue-300 bg-gradient-to-r from-white to-blue-50 text-blue-600 font-semibold shadow-sm hover:shadow-md hover:bg-blue-100 transition-transform transform hover:scale-105 active:scale-95 dark:border-blue-500 dark:bg-gradient-to-r dark:from-gray-800 dark:to-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 hover:text-indigo-500 dark:hover:text-indigo-200">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteRegularIncome()}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,100,100,0.5)] hover:scale-105 active:scale-95 transition-transform transform dark:bg-gradient-to-r dark:from-red-700 dark:via-red-800 dark:to-red-900 dark:shadow-[0_0_20px_rgba(200,50,50,0.5)] dark:hover:shadow-[0_0_30px_rgba(200,50,50,0.7)]"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Collapsible Details Section */}
          {showDetails && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Detail Box with Frosted Glass Effect */}
              <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-widest">
                  Gross Income
                </h3>
                <p className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                  {formatCurrency(regularIncomeData[0].grossIncome)}
                </p>
              </div>

              <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-widest">
                  Net Income
                </h3>
                <p className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                  {formatCurrency(regularIncomeData[0].netIncome)}
                </p>
              </div>

              <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-widest">
                  Dearness Allowance (DA)
                </h3>
                <p className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                  {formatCurrency(regularIncomeData[0].da)}
                </p>
              </div>

              <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-widest">
                  House Rent Allowance (HRA)
                </h3>
                <p className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                  {formatCurrency(regularIncomeData[0].hra)}
                </p>
              </div>

              <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-widest">
                  Other Allowances
                </h3>
                <p className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                  {formatCurrency(regularIncomeData[0].otherAllowances)}
                </p>
              </div>

              <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-widest">
                  Tax Deductions
                </h3>
                <p className="font-extrabold text-lg text-red-600 dark:text-red-400">
                  -{formatCurrency(regularIncomeData[0].taxDeductions)}
                </p>
              </div>
            </div>
          )}

          {/* Last Updated Section */}
          <div className="mt-8 border-t pt-4 text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Last Updated:
              </span>{" "}
              {regularIncomeData[0].lastUpdated || "Not available"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default addRegularIncome;
