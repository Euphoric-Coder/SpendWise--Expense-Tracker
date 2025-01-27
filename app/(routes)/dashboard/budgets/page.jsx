"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { formatCurrencyDashboard } from "@/utils/utilities";
import ExpenseDialog from "@/components/Expenses/ExpenseDialog";
import { Skeleton } from "@/components/ui/skeleton";
import CreateBudget from "@/components/Budgets/CreateBudget";
import ExpenseCard from "@/components/Budgets/BudgetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const ExpenseDashboard = () => {
  const [budgetList, setBudgetList] = useState([]);
  const [expensesByBudget, setExpensesByBudget] = useState({});
  const [selectedBudget, setSelectedBudget] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) fetchBudgetsAndExpenses();
  }, [user]);

  const fetchBudgetsAndExpenses = async () => {
    const budg_response = await fetch(`/api/budgets`);
    const budgets = await budg_response.json();

    const exp_response = await fetch(`/api/expenses`);
    const expenses = await exp_response.json();

    const groupedExpenses = expenses?.reduce((acc, expense) => {
      acc[expense.budgetId] = acc[expense.budgetId] || [];
      acc[expense.budgetId].push(expense);
      return acc;
    }, {});

    // console.log(groupedExpenses);

    setBudgetList(budgets);
    setExpensesByBudget(groupedExpenses);
  };

  const calculateStats = () => {
    const totalBudgets = budgetList.reduce(
      (acc, budget) => acc + parseFloat(budget.amount),
      0
    );
    const totalExpenses = budgetList.reduce(
      (acc, budget) => acc + parseFloat(budget.totalSpend || 0),
      0
    );
    return {
      totalBudgets,
      totalExpenses,
      remaining: totalBudgets - totalExpenses,
    };
  };

  const refreshData = () => {
    fetchBudgetsAndExpenses();
  };

  const { totalBudgets, totalExpenses, remaining } = calculateStats();

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

  return (
    <div className="p-10 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 opacity-30 blur-[80px]"></div>
      </div>

      {/* Header */}
      <h2 className="p-2 mb-10 font-extrabold text-xl md:text-4xl lg:text-3xl xl:text-5xl md:text-left text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-400 to-purple-500">
        My Budget List
      </h2>

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

      {/* Add New Budget & Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <CreateBudget refreshData={() => refreshData()} />

        <div className="relative bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 shadow-xl rounded-3xl p-8 text-center hover:scale-105 transition-transform">
          <h2 className="mb-2 text-2xl font-bold text-gray-100 dark:text-gray-300">
            Total Budgets
          </h2>
          <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            {formatCurrencyDashboard(totalBudgets)}
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-indigo-200 via-purple-300 to-blue-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 shadow-xl rounded-3xl p-8 text-center hover:scale-105 transition-transform">
          <h2 className="mb-2 text-2xl font-bold text-gray-100 dark:text-gray-300">
            Total Expenses
          </h2>
          <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">
            {formatCurrencyDashboard(totalExpenses)}
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-purple-200 via-blue-300 to-indigo-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 shadow-xl rounded-3xl p-8 text-center hover:scale-105 transition-transform">
          <h2 className="mb-2 text-2xl font-bold text-gray-100 dark:text-gray-300">
            Remaining Balance
          </h2>
          <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400">
            {formatCurrencyDashboard(remaining)}
          </p>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {budgetList.length === 0
          ? [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index}>
                <Skeleton className="h-[145px] rounded-3xl bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 shadow-lg" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 bg-slate-300 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-[75%] bg-slate-300 dark:bg-gray-700" />
                </div>
              </div>
            ))
          : budgetList.map((budget) => (
              <div className="p-2" key={budget.id}>
                <ExpenseCard
                  budget={budget}
                  expenses={expensesByBudget[budget.id] || []}
                  onOpen={() => setSelectedBudget(budget)} // Open dialog for selected budget
                />
              </div>
            ))}
      </div>

      {/* Dialog */}
      {selectedBudget && (
        <ExpenseDialog
          budget={selectedBudget}
          expenses={expensesByBudget[selectedBudget.id] || []}
          onClose={() => setSelectedBudget(null)} // Close dialog
        />
      )}
    </div>
  );
};

export default ExpenseDashboard;
