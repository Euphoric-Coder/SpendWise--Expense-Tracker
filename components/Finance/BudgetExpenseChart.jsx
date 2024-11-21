"use client";

import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function BudgetExpenseChart({ budgetList, expenseList }) {
  const [selectedBudget, setSelectedBudget] = useState(budgetList[0]?.id); // Default to first budget

  // Find the selected budget details
  const budgetDetails = budgetList.find(
    (budget) => budget.id === selectedBudget
  );

  // Filter expenses for the selected budget
  const filteredExpenses = expenseList.filter(
    (expense) => expense.budgetId === selectedBudget
  );

  // Calculate total expenses for the selected budget
  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  // Helper function to truncate legend labels
  const truncateText = (text, maxWords = 4) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? `${words.slice(0, maxWords).join(" ")}...`
      : text;
  };

  // Pie chart data
  const pieData = {
    labels: filteredExpenses.map(
      (expense) =>
        `${truncateText(expense.name)} - ₹${parseFloat(
          expense.amount
        ).toLocaleString()}`
    ),
    datasets: [
      {
        data: filteredExpenses.map((expense) => parseFloat(expense.amount)),
        backgroundColor: filteredExpenses.map(
          (_, index) =>
            `hsl(${(index * 360) / filteredExpenses.length}, 70%, 60%)`
        ),
        hoverBackgroundColor: filteredExpenses.map(
          (_, index) =>
            `hsl(${(index * 360) / filteredExpenses.length}, 70%, 50%)`
        ),
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data
  const barData = {
    labels: ["Allocated Budget", "Total Expense"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [parseFloat(budgetDetails?.amount || 0), totalSpent],
        backgroundColor: ["#36a2eb", "#ff6384"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14, // Consistent font size
          },
          boxWidth: 14,
          padding: 10,
          color: "#374151",
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
      },
    },
  };

  // Custom Combobox Component
  const Combobox = () => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {budgetDetails
              ? `${budgetDetails.name} - ₹${parseFloat(
                  budgetDetails.amount
                ).toLocaleString()}`
              : "Select Budget"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search budget..." />
            <CommandList>
              <CommandEmpty>No budget found.</CommandEmpty>
              <CommandGroup>
                {budgetList.map((budget) => (
                  <CommandItem
                    key={budget.id}
                    value={budget.id.toString()}
                    onSelect={() => {
                      setSelectedBudget(budget.id);
                      setOpen(false);
                    }}
                  >
                    {`${budget.name} - ₹${parseFloat(
                      budget.amount
                    ).toLocaleString()}`}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedBudget === budget.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <Card className="mt-6 border shadow-lg rounded-xl bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="text-2xl font-extrabold text-gray-800">
          Budget Expense Overview
        </CardTitle>
        <div className="mt-4">
          <Combobox />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
          {/* Pie Chart */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Expense Distribution
            </h3>
            {filteredExpenses.length > 0 ? (
              <div className="relative w-full h-[300px] md:h-[400px] xl:h-[500px]">
                <Pie data={pieData} options={options} />
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No expenses found for the selected budget.
              </p>
            )}
          </div>

          {/* Bar Chart */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Budget vs Expense
            </h3>
            <div className="relative w-full h-[300px] md:h-[400px] xl:h-[500px]">
              <Bar data={barData} options={options} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
