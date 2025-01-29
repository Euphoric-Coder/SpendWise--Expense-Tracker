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
import { toast } from "sonner";
import { expenseCategoriesList, expenseSubcategories } from "@/data/categories";

const ExpenseDashboard = () => {
  const [budgetList, setBudgetList] = useState([]);
  const [expensesByBudget, setExpensesByBudget] = useState({});
  const [selectedBudget, setSelectedBudget] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    user && fetchBudgetsAndExpenses();
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
  const [tempFilters, setTempFilters] = useState({
    categories: [],
    subCategories: [],
    dateRange: { start: "", end: "" },
    amountRange: { min: "", max: "" },
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...tempFilters });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isSearchActive = searchTerm !== ""; // Check if there is text in the search bar

  const filterCount = useMemo(() => {
    let count = 0;
    count += tempFilters.categories.length;
    count += tempFilters.subCategories.length;
    if (tempFilters.dateRange.start) count += 1;
    if (tempFilters.dateRange.end) count += 1;
    if (tempFilters.amountRange.min) count += 1;
    if (tempFilters.amountRange.max) count += 1;
    return count;
  }, [tempFilters]);

  const filteredTransactions = useMemo(() => {
    return budgetList.filter((tx) => {
      const filtersToApply = appliedFilters;

      const matchesSearch =
        tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm) ||
        tx.category.includes(searchTerm);

      const matchesCategory =
        filtersToApply.categories.length === 0 ||
        filtersToApply.categories.includes(tx.category.toLowerCase());

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
        matchesDateRange &&
        matchesAmountRange
      );
    });
  }, [searchTerm, appliedFilters, budgetList]);

  const previewedTransactions = useMemo(() => {
    return budgetList.filter((tx) => {
      const matchesCategory =
        tempFilters.categories.length === 0 ||
        tempFilters.categories.includes(tx.category.toLowerCase());

      const transactionSubCategories = tx.subCategory
        ? tx.subCategory.split(",").map((sub) => sub.trim()) // Convert to array and trim spaces
        : [];

      const matchesSubCategory =
        tempFilters.subCategories.length === 0 ||
        transactionSubCategories.some((sub) =>
          tempFilters.subCategories.includes(sub)
        );

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
        matchesSubCategory &&
        matchesDateRange &&
        matchesAmountRange
      );
    });
  }, [tempFilters, budgetList]);

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
      subCategories: [],
      dateRange: { start: "", end: "" },
      amountRange: { min: "", max: "" },
    });
    setTempFilters({
      categories: [],
      subCategories: [],
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

  const displayedBudgets = isDialogOpen
    ? previewedTransactions
    : filteredTransactions;

  const hasActiveFilters =
    appliedFilters.categories.length > 0 ||
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
            className="w-full px-6 py-5 rounded-full shadow-lg border transition-all duration-300 bg-white dark:bg-gray-900 dark:text-white text-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 dark:focus:ring-purple-600"
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
                  <div className="flex flex-wrap gap-2 space-y-2">
                    {expenseCategoriesList.slice(1).map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setTempFilters((prev) => ({
                            ...prev,
                            categories: prev.categories.includes(
                              category.toLowerCase()
                            )
                              ? prev.categories.filter(
                                  (c) => c !== category.toLowerCase()
                                )
                              : [...prev.categories, category.toLowerCase()],
                          }));
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          tempFilters.categories.includes(
                            category.toLowerCase()
                          )
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Categories (Only Show When Categories Are Selected) */}
                {tempFilters.categories.length > 0 && (
                  <div className="relative max-h-[200px] overflow-y-auto border border-gray-300 rounded-md p-3 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub-Categories (
                      {
                        new Set(
                          tempFilters.categories.flatMap(
                            (category) => expenseSubcategories[category] || []
                          )
                        ).size
                      }
                      )
                    </label>

                    {/* Subcategories List */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        ...new Set(
                          tempFilters.categories.flatMap(
                            (category) => expenseSubcategories[category] || []
                          )
                        ),
                      ] // Convert Set back to an array to prevent duplicates
                        .map((subCategory) => (
                          <button
                            key={subCategory}
                            onClick={() => {
                              setTempFilters((prev) => ({
                                ...prev,
                                subCategories: prev.subCategories.includes(
                                  subCategory.toLowerCase()
                                )
                                  ? prev.subCategories.filter(
                                      (c) => c !== subCategory.toLowerCase()
                                    )
                                  : [
                                      ...prev.subCategories,
                                      subCategory.toLowerCase(),
                                    ],
                              }));
                            }}
                            className={`px-3 py-1 rounded-full text-sm ${
                              tempFilters.subCategories.includes(
                                subCategory.toLowerCase()
                              )
                                ? "bg-purple-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {subCategory}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

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
        {displayedBudgets.length === 0 && <p>No budgets found.</p>}
        {displayedBudgets.length === 0
          ? [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index}>
                <Skeleton className="h-[145px] rounded-3xl bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 dark:from-blue-800 dark:via-indigo-900 dark:to-gray-800 shadow-lg" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 bg-slate-300 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-[75%] bg-slate-300 dark:bg-gray-700" />
                </div>
              </div>
            ))
          : displayedBudgets.map((budget) => (
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
