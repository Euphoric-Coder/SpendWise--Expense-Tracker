"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Timer,
  TrendingUp,
  TrendingDown,
  TimerReset,
  CircleCheck,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { expenseCategories, incomeCategories } from "@/utils/data";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// const transactions = [];
const categories = ["All Categories", "food", "bills", "income", "travel"];
const statuses = ["All Statuses", "completed", "pending"];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [tempFilters, setTempFilters] = useState({
    categories: [],
    statuses: [],
    dateRange: { start: "", end: "" },
    amountRange: { min: "", max: "" },
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...tempFilters });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isSearchActive = searchTerm !== ""; // Check if there is text in the search bar

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      console.log(data);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const filterCount = useMemo(() => {
    let count = 0;
    count += tempFilters.categories.length;
    count += tempFilters.statuses.length;
    if (tempFilters.dateRange.start) count += 1;
    if (tempFilters.dateRange.end) count += 1;
    if (tempFilters.amountRange.min) count += 1;
    if (tempFilters.amountRange.max) count += 1;
    return count;
  }, [tempFilters]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const filtersToApply = appliedFilters;

      const matchesSearch =
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm) ||
        tx.createdAt.includes(searchTerm);

      const matchesCategory =
        filtersToApply.categories.length === 0 ||
        filtersToApply.categories.includes(tx.category);

      const matchesStatus =
        filtersToApply.statuses.length === 0 ||
        filtersToApply.statuses.includes(tx.status);

      const matchesDateRange =
        (!filtersToApply.dateRange.start ||
          tx.date >= filtersToApply.dateRange.start) &&
        (!filtersToApply.dateRange.end ||
          tx.date <= filtersToApply.dateRange.end);

      const matchesAmountRange =
        (!filtersToApply.amountRange.min ||
          tx.amount >= Number(filtersToApply.amountRange.min)) &&
        (!filtersToApply.amountRange.max ||
          tx.amount <= Number(filtersToApply.amountRange.max));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesDateRange &&
        matchesAmountRange
      );
    });
  }, [searchTerm, appliedFilters, transactions]);

  const previewedTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesCategory =
        tempFilters.categories.length === 0 ||
        tempFilters.categories.includes(tx.category);

      const matchesStatus =
        tempFilters.statuses.length === 0 ||
        tempFilters.statuses.includes(tx.status);

      const matchesDateRange =
        (!tempFilters.dateRange.start ||
          tx.date >= tempFilters.dateRange.start) &&
        (!tempFilters.dateRange.end || tx.date <= tempFilters.dateRange.end);

      const matchesAmountRange =
        (!tempFilters.amountRange.min ||
          tx.amount >= Number(tempFilters.amountRange.min)) &&
        (!tempFilters.amountRange.max ||
          tx.amount <= Number(tempFilters.amountRange.max));

      return (
        matchesCategory &&
        matchesStatus &&
        matchesDateRange &&
        matchesAmountRange
      );
    });
  }, [tempFilters, transactions]);

  const applyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setIsDialogOpen(false); // Close the dialog
  };

  const clearFilters = () => {
    setTempFilters(appliedFilters);
  };

  const resetFilters = () => {
    setAppliedFilters({
      categories: [],
      statuses: [],
      dateRange: { start: "", end: "" },
      amountRange: { min: "", max: "" },
    });
    setTempFilters({
      categories: [],
      statuses: [],
      dateRange: { start: "", end: "" },
      amountRange: { min: "", max: "" },
    });

    toast.success("Filters have been successfully reset to default!");
  };

  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
      setTempFilters({ ...appliedFilters }); // Reset temp filters to applied filters when dialog is closed
    }
    setIsDialogOpen(isOpen); // Track dialog state
  };

  const displayedTransactions = isDialogOpen
    ? previewedTransactions
    : filteredTransactions;

  const hasActiveFilters =
    appliedFilters.categories.length > 0 ||
    appliedFilters.statuses.length > 0 ||
    (appliedFilters.dateRange.start &&
      appliedFilters.dateRange.start.trim() !== "") ||
    (appliedFilters.dateRange.end &&
      appliedFilters.dateRange.end.trim() !== "") ||
    (appliedFilters.amountRange.min &&
      appliedFilters.amountRange.min.trim() !== "") ||
    (appliedFilters.amountRange.max &&
      appliedFilters.amountRange.max.trim() !== "");

  const toggleDescription = (currentIndex) => {
    if (expandedIndex === currentIndex) {
      setExpandedIndex(null); // Collapse if already expanded
    } else {
      setExpandedIndex(currentIndex); // Expand the current index
    }
  };
  const exportTransactions = () => {
    const csvContent = [
      [
        "Name",
        "Date",
        "Description",
        "Category",
        "Subcategory",
        "Amount",
        "Recurring",
        "Status",
      ],
      ...filteredTransactions.map((tx) => [
        tx.name,
        tx.createdAt,
        tx.description,
        tx.category,
        tx.subCategory,
        tx.amount,
        tx.frequency ? tx.frequency : "One-Time",
        tx.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="md:p-8">
      <div className="flex flex-col md:flex-row justify-center md:justify-between gap-2 items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="w-full flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-full">
            <Input
              type="text"
              placeholder="Search transactions by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full shadow-lg border transition-all duration-300 bg-white dark:bg-gray-900 dark:text-white text-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 dark:focus:ring-purple-600"
            />

            {/* Clear Button Inside Search Bar */}
            {isSearchActive && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white px-3 py-1 rounded-full shadow-md text-sm xs:text-base transition-transform duration-300 bg-gradient-to-r from-blue-500 to-teal-500 dark:from-pink-400 dark:to-yellow-400 hover:scale-110 active:scale-95"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <Dialog onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    filterCount > 0
                      ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:from-purple-600 hover:via-purple-700 hover:to-purple-800"
                      : "bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 text-purple-700 hover:from-purple-200 hover:via-purple-300 hover:to-purple-400"
                  }`}
                >
                  <Filter size={20} />
                  {filterCount > 0 ? `Filters (${filterCount})` : "Filter"}
                </button>
              </DialogTrigger>
              <DialogContent className="p-6 bg-white rounded-lg shadow-xl w-full max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Filter Transactions
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(1).map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setTempFilters((prev) => ({
                              ...prev,
                              categories: prev.categories.includes(category)
                                ? prev.categories.filter((c) => c !== category)
                                : [...prev.categories, category],
                            }));
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            tempFilters.categories.includes(category)
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {statuses.slice(1).map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setTempFilters((prev) => ({
                              ...prev,
                              statuses: prev.statuses.includes(status)
                                ? prev.statuses.filter((s) => s !== status)
                                : [...prev.statuses, status],
                            }));
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            tempFilters.statuses.includes(status)
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={tempFilters.dateRange.start}
                        onChange={(e) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            dateRange: {
                              ...prev.dateRange,
                              start: e.target.value,
                            },
                          }))
                        }
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="date"
                        value={tempFilters.dateRange.end}
                        onChange={(e) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            dateRange: {
                              ...prev.dateRange,
                              end: e.target.value,
                            },
                          }))
                        }
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  {/* Amount Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Range
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Min"
                        value={tempFilters.amountRange.min}
                        onChange={(e) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            amountRange: {
                              ...prev.amountRange,
                              min: e.target.value,
                            },
                          }))
                        }
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={tempFilters.amountRange.max}
                        onChange={(e) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            amountRange: {
                              ...prev.amountRange,
                              max: e.target.value,
                            },
                          }))
                        }
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      Clear Filters
                    </button>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        Reset Filters
                      </button>
                    )}
                    <DialogClose
                      onClick={applyFilters}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Apply Filters
                    </DialogClose>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Reset Filters
              </button>
            )}
            <Button
              onClick={exportTransactions}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 via-cyan-600 to-teal-500 hover:from-blue-600 hover:via-cyan-700 hover:to-teal-600 transition-all duration-300 shadow-md"
            >
              <Download size={24} />
              Export
            </Button>
          </div>
        </div>

        <div className="hidden md:block">
          {/* <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 uppercase">
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="">Category</TableHead>
                <TableHead className="">Amount</TableHead>
                <TableHead className="">Recurring</TableHead>
                <TableHead className="">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="flex gap-1 font-medium">
                    INV001{" "}
                    <span>
                      {tx.type === "Income" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-300 hover:scale-105 cursor-pointer transition-all duration-500">
                          Income
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-300 hover:scale-105 cursor-pointer transition-all duration-500">
                          Expense
                        </Badge>
                      )}
                    </span>
                    <span className="md:hidden table-cell">({tx.type})</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tx.description}
                  </TableCell>
                  <TableCell>{format(tx.date, "PPP")}</TableCell>

                  <TableCell className="">
                    <span className="">
                      {tx.type === "Income" &&
                        (() => {
                          const category = incomeCategories.find(
                            (c) => c.id === tx.category
                          );
                          return category ? (
                            <>
                              <span
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-2"
                                style={{
                                  background: `linear-gradient(90deg, ${category.color} 0%, ${category.color} 100%)`,
                                  color: category.textColor || "white", // Ensure text is readable
                                }}
                              >
                                {category.icon && <category.icon size={18} />}
                                {category.name}
                              </span>
                            </>
                          ) : null;
                        })()}
                      {tx.type === "Expense" &&
                        (() => {
                          const category = expenseCategories.find(
                            (c) => c.id === tx.category
                          );
                          return category ? (
                            <>
                              <span
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-2"
                                style={{
                                  background: `linear-gradient(90deg, ${category.color} 0%, ${category.color} 100%)`,
                                  color: category.textColor || "white", // Ensure text is readable
                                }}
                              >
                                {category.icon && <category.icon size={18} />}
                                {category.name}
                              </span>
                            </>
                          ) : null;
                        })()}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`flex gap-1 px-6 py-4 whitespace-nowrap text-md font-semibold ${
                      tx.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.amount > 0 ? <TrendingUp /> : <TrendingDown />}
                    {tx.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`inline-flex items-center gap-1 rounded-full text-sm font-medium text-center transition duration-200 ease-in-out shadow-sm cursor-pointer ${
                        tx.recurring
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900" // Very light blue with hover effect for recurring
                          : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 hover:text-cyan-900" // Very light cyan with hover effect for non-recurring
                      }`}
                    >
                      {tx.recurring ? (
                        <>
                          <TimerReset className="text-blue-700" size={18} />
                          {tx.frequency.toUpperCase()}
                        </>
                      ) : (
                        <>
                          <Timer className="text-cyan-700" size={18} />
                          One-Time
                        </>
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell className="">
                    <span
                      className={`px-2 inline-flex gap-1 text-xs leading-5 font-semibold rounded-full ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <CircleCheck size={20} />
                      {tx.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}

          <table className="w-full border-collapse text-base rounded-3xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <thead className="bg-gradient-to-r uppercase via-cyan-600 from-blue-600 to-teal-500 dark:from-blue-400 dark:via-pink-500 dark:to-purple-600 text-white">
              <tr>
                <th className="py-4 px-6 font-bold text-left">Name</th>
                <th className="py-4 px-6 font-bold text-left hidden md:table-cell">
                  Description
                </th>
                <th className="py-4 px-6 font-bold text-center">Date</th>
                <th className="py-4 px-6 font-bold text-left">Category</th>
                <th className="py-4 px-6 font-bold text-left">Amount</th>
                <th className="py-4 px-6 font-bold text-left">Recurring</th>
                <th className="py-4 px-6 font-bold text-left">Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {/* {transactions.map((tx, index) => { */}
              {displayedTransactions.map((tx, index) => {
                const category =
                  tx.type === "Income"
                    ? incomeCategories.find((c) => c.id === tx.category)
                    : expenseCategories.find((c) => c.id === tx.category);

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-gradient-to-br hover:from-blue-200 hover:via-blue-100 hover:to-indigo-200 transition-all duration-300 even:bg-blue-50"
                  >
                    {/* Name Column */}
                    <td className="py-4 px-6 font-medium text-gray-700 flex gap-2 items-center">
                      {tx.name}
                      {tx.type === "income" ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold hover:bg-green-200">
                          Income
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold hover:bg-red-200">
                          Expense
                        </span>
                      )}
                    </td>

                    {/* Description Column */}
                    <td className="py-4 px-6 hidden md:table-cell text-gray-600">
                      {tx.description && tx.description.length > 10 ? (
                        <div>
                          <span>
                            {expandedIndex === index
                              ? tx.description
                              : `${tx.description.substring(0, 10)}...`}
                          </span>
                          <button
                            onClick={() => toggleDescription(index)}
                            className="ml-2 text-blue-600 hover:underline text-sm"
                          >
                            {expandedIndex === index
                              ? "Show Less"
                              : "Show More"}
                          </button>
                        </div>
                      ) : (
                        tx.description || "No description"
                      )}
                    </td>

                    {/* Date Column */}
                    <td className="flex gap-1 items-center py-4 px-6 text-gray-600">
                      <Calendar size={18} />{" "}
                      {format(tx.createdAt.split(" ")[0], "PPP")}
                    </td>

                    {/* Category Column */}
                    <td className="py-4 px-6">
                      {tx.category &&
                        (() => {
                          // Find the correct category from either expense or income list
                          const category =
                            tx.type === "expense"
                              ? expenseCategories.find(
                                  (cat) => cat.id === tx.category
                                )
                              : incomeCategories.find(
                                  (cat) => cat.id === tx.category
                                );

                          if (!category) return null; // Return nothing if category not found

                          return (
                            <Badge
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200",
                                {
                                  // **Expense Category Colors (Light Mode: Softer, Dark Mode: Deeper)**
                                  "bg-red-200 dark:bg-red-600 text-red-900 dark:text-red-100 hover:bg-red-300 dark:hover:bg-red-500":
                                    category.color === "#ef4444",
                                  "bg-orange-200 dark:bg-orange-600 text-orange-900 dark:text-orange-100 hover:bg-orange-300 dark:hover:bg-orange-500":
                                    category.color === "#f97316",
                                  "bg-lime-200 dark:bg-lime-600 text-lime-900 dark:text-lime-100 hover:bg-lime-300 dark:hover:bg-lime-500":
                                    category.color === "#84cc16",
                                  "bg-cyan-200 dark:bg-cyan-600 text-cyan-900 dark:text-cyan-100 hover:bg-cyan-300 dark:hover:bg-cyan-500":
                                    category.color === "#06b6d4",
                                  "bg-violet-200 dark:bg-violet-600 text-violet-900 dark:text-violet-100 hover:bg-violet-300 dark:hover:bg-violet-500":
                                    category.color === "#8b5cf6",
                                  "bg-rose-200 dark:bg-rose-600 text-rose-900 dark:text-rose-100 hover:bg-rose-300 dark:hover:bg-rose-500":
                                    category.color === "#f43f5e",
                                  "bg-pink-200 dark:bg-pink-600 text-pink-900 dark:text-pink-100 hover:bg-pink-300 dark:hover:bg-pink-500":
                                    category.color === "#ec4899",
                                  "bg-teal-200 dark:bg-teal-600 text-teal-900 dark:text-teal-100 hover:bg-teal-300 dark:hover:bg-teal-500":
                                    category.color === "#14b8a6",
                                  "bg-indigo-200 dark:bg-indigo-600 text-indigo-900 dark:text-indigo-100 hover:bg-indigo-300 dark:hover:bg-indigo-500":
                                    category.color === "#6366f1",
                                  "bg-fuchsia-200 dark:bg-fuchsia-600 text-fuchsia-900 dark:text-fuchsia-100 hover:bg-fuchsia-300 dark:hover:bg-fuchsia-500":
                                    category.color === "#d946ef",
                                  "bg-sky-200 dark:bg-sky-600 text-sky-900 dark:text-sky-100 hover:bg-sky-300 dark:hover:bg-sky-500":
                                    category.color === "#0ea5e9",
                                  "bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-500":
                                    category.color === "#64748b",

                                  // **Income Category Colors (Light Mode: Softer, Dark Mode: Deeper)**
                                  "bg-emerald-200 dark:bg-emerald-600 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-300 dark:hover:bg-emerald-500":
                                    category.color === "#34d399",
                                  "bg-sky-200 dark:bg-sky-600 text-sky-900 dark:text-sky-100 hover:bg-sky-300 dark:hover:bg-sky-500":
                                    category.color === "#38bdf8",
                                  "bg-indigo-200 dark:bg-indigo-600 text-indigo-900 dark:text-indigo-100 hover:bg-indigo-300 dark:hover:bg-indigo-500":
                                    category.color === "#818cf8",
                                  "bg-pink-200 dark:bg-pink-600 text-pink-900 dark:text-pink-100 hover:bg-pink-300 dark:hover:bg-pink-500":
                                    category.color === "#f472b6",
                                  "bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 hover:bg-yellow-300 dark:hover:bg-yellow-500":
                                    category.color === "#facc15",
                                }
                              )}
                            >
                              <category.icon size={16} className="mr-1" />
                              {category.name}
                            </Badge>
                          );
                        })()}
                    </td>

                    {/* Amount Column */}
                    <td
                      className={`py-4 px-6 text-right font-medium ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      } flex gap-1 items-center`}
                    >
                      {tx.type === "income" ? <TrendingUp /> : <TrendingDown />}
                      {tx.amount}
                    </td>

                    {/* Recurring Column */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tx.isRecurring
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                        }`}
                      >
                        {tx.isRecurring ? (
                          <>
                            <TimerReset size={16} />
                            {tx.frequency.toUpperCase()}
                          </>
                        ) : (
                          <>
                            <Timer size={16} />
                            One-Time
                          </>
                        )}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <CircleCheck size={16} />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {displayedTransactions.length === 0 && transactions.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found for the selected filters.
            </div>
          )}

          {displayedTransactions.length === 0 && transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found.
            </div>
          )}
        </div>

        <div className="block md:hidden">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis
          culpa quos eveniet, officia nostrum, voluptate dolores nemo amet
          maxime voluptatibus reiciendis similique error blanditiis soluta natus
          vitae hic? Rerum temporibus at enim cum?
        </div>
      </div>
    </div>
  );
}
