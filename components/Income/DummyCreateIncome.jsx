"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/utils/dbConfig";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  addOneMonth,
  getISTDate,
  getISTDateTime,
  isSameDate,
} from "@/utils/utilities";

export default function CreateIncomeTest({ refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { user } = useUser();

  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  /**
   * Validate the Form in Real-Time
   */
  const validateForm = () => {
    const validationErrors = {};

    if (!name) {
      validationErrors.name = "Income source name is required.";
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      validationErrors.amount = "Please enter a valid amount greater than 0.";
    }

    if (isRecurring && !startDate) {
      validationErrors.startDate =
        "Start date is required for recurring income.";
    }

    if (!isRecurring && endDate && new Date(endDate) < new Date()) {
      validationErrors.endDate = "End date cannot be in the past.";
    }

    setErrors(validationErrors);
    setIsButtonDisabled(Object.keys(validationErrors).length !== 0);
  };

  /**
   * Handle Input Change with Validation
   */
  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    validateForm();
  };

  /**
   * To Create New Source of Income
   */
  const onCreateIncomes = async () => {
    const incomeData = {
      name,
      amount,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      incomeType: isRecurring ? "recurring" : "non-recurring",
      status: isRecurring
        ? isSameDate(startDate || getISTDate(), getISTDate())
          ? "current"
          : "upcoming"
        : "current",
      startDate: isRecurring ? startDate || getISTDate() : getISTDate(),
      endDate: !isRecurring ? endDate || addOneMonth(getISTDate()) : null,
      createdAt: getISTDateTime(),
    };

    try {
      const result = await db.insert("Incomes").values(incomeData).returning();

      if (result) {
        refreshData();
        toast.success("New Source of Income has been Created!");
      }
    } catch (error) {
      toast.error("Failed to create income. Please try again.");
      console.error("Error creating income:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-gradient-to-b from-white via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed border-blue-300 dark:border-blue-600 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,150,255,0.5)] hover:scale-105 transition-transform transform">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400">
            +
          </h2>
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400">
            Create New Income
          </h2>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Income Source</DialogTitle>
        </DialogHeader>

        <div>
          <Input
            placeholder="Income Source Name"
            value={name}
            onChange={handleInputChange(setName, "name")}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={handleInputChange(setAmount, "amount")}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount}</p>
          )}
        </div>

        {isRecurring && (
          <div>
            <Input
              type="date"
              value={startDate}
              onChange={handleInputChange(setStartDate, "startDate")}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate}</p>
            )}
          </div>
        )}

        {!isRecurring && (
          <div>
            <Input
              type="date"
              value={endDate}
              onChange={handleInputChange(setEndDate, "endDate")}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate}</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={onCreateIncomes}
            disabled={isButtonDisabled}
            className={`${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
