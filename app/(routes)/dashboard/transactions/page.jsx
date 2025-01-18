"use client";

import React, { useState, useMemo } from "react";
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
import { expenseCategories, incomeCategories } from "@/data/categories";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const transactions = [
  {
    id: 1,
    desc: "Grocery Shopping",
    amount: 120,
    date: "2024-03-15",
    category: "groceries",
    status: "completed",
    type: "Expense",
    recurring: false,
    frequency: null,
    deletionRemark: null,
  },
  {
    id: 2,
    desc: "Salary Deposit",
    amount: 3500,
    date: "2024-03-14",
    category: "salary",
    status: "completed",
    type: "Income",
    recurring: true,
    frequency: "monthly",
    deletionRemark: null,
  },
  {
    id: 3,
    desc: "Utility Bills",
    amount: 250,
    date: "2024-03-13",
    category: "utilities",
    status: "pending",
    type: "Expense",
    recurring: true,
    frequency: "weekly",
    deletionRemark: null,
  },
  {
    id: 4,
    desc: "Freelance Work",
    amount: 800,
    date: "2024-03-12",
    category: "freelance",
    status: "completed",
    type: "Income",
    recurring: true,
    frequency: "monthly",
    deletionRemark: null,
  },
  {
    id: 5,
    desc: "Restaurant",
    amount: 85,
    date: "2024-03-11",
    category: "food",
    status: "completed",
    type: "Expense",
    recurring: false,
    frequency: null,
    deletionRemark: null,
  },
  {
    id: 6,
    desc: "Transport",
    amount: 30,
    date: "2024-03-10",
    category: "travel",
    status: "completed",
    type: "Expense",
    recurring: false,
    frequency: null,
    deletionRemark: null,
  },
];

// const transactions = [];
const categories = ["All Categories", "food", "bills", "income", "travel"];
const statuses = ["All Statuses", "completed", "pending"];

export default function Transactions() {
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
        tx.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm) ||
        tx.date.includes(searchTerm);

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
  }, [searchTerm, appliedFilters]);

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
  }, [tempFilters]);

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
      ["Name", "Date", "Description", "Category", "Amount", "Recurring", "Status"],
      ...filteredTransactions.map((tx) => [
        tx.name,
        tx.date,
        tx.desc,
        tx.category,
        tx.amount,
        (tx.frequency? tx.frequency : "One-Time"),
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
                    {tx.desc}
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
            <thead className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white uppercase">
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
                      INV001
                      {tx.type === "Income" ? (
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
                      {tx.desc && tx.desc.length > 10 ? (
                        <div>
                          <span>
                            {expandedIndex === index
                              ? tx.desc
                              : `${tx.desc.substring(0, 10)}...`}
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
                        tx.desc || "No description"
                      )}
                    </td>

                    {/* Date Column */}
                    <td className="flex gap-1 items-center py-4 px-6 text-gray-600">
                      <Calendar size={18} /> {format(tx.date, "PPP")}
                    </td>

                    {/* Category Column */}
                    <td className="py-4 px-6">
                      {category && (
                        <span
                          className="inline-flex px-3 py-1 rounded-full text-xs font-semibold items-center gap-2"
                          style={{
                            background: `linear-gradient(90deg, ${category.color} 0%, ${category.color} 100%)`,
                            color: category.textColor || "white",
                          }}
                        >
                          {category.icon && <category.icon size={16} />}
                          {category.name}
                        </span>
                      )}
                    </td>

                    {/* Amount Column */}
                    <td
                      className={`py-4 px-6 text-right font-medium ${
                        tx.type === "Income" ? "text-green-600" : "text-red-600"
                      } flex gap-1 items-center`}
                    >
                      {tx.type === "Income" ? <TrendingUp /> : <TrendingDown />}
                      {tx.amount}
                    </td>

                    {/* Recurring Column */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tx.recurring
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                        }`}
                      >
                        {tx.recurring ? (
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
