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
  CalendarIcon,
  RefreshCcw,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { expenseCategoriesList, expenseSubcategories } from "@/utils/data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const ExpenseDashboard = () => {
  const [budgetList, setBudgetList] = useState([]);
  const [expensesByBudget, setExpensesByBudget] = useState({});
  const [selectedBudget, setSelectedBudget] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    user && fetchBudgetsAndExpenses();
  }, [user]);
  const fetchBudgetsAndExpenses = async () => {
    // Fetch budget data from the server
    const budg_response = await fetch(`/api/budgets`);
    const budgets = await budg_response.json();

    // Fetch expense data from the server
    const exp_response = await fetch(`/api/expenses`);
    const expenses = await exp_response.json();

    // Group expenses by budgetId
    const groupedExpenses = expenses?.reduce((acc, expense) => {
      acc[expense.budgetId] = acc[expense.budgetId] || [];
      acc[expense.budgetId].push(expense);
      return acc;
    }, {});

    // Update state with the fetched budgets and grouped expenses
    setBudgetList(budgets);
    setExpensesByBudget(groupedExpenses);
  };

  const refreshData = () => {
    toast.success("Budget Details Refreshed!");
    fetchBudgetsAndExpenses();
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

  const { totalBudgets, totalExpenses, remaining } = calculateStats();

  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilters, setTempFilters] = useState({
    categories: [],
    subCategories: [],
    dateRange: { from: "", to: "" },
    amountRange: { min: "", max: "" },
  });
  const selectedCategoryCount = tempFilters.categories
    ? tempFilters.categories.length
    : 0;
  const selectedSubCategoryCount = tempFilters.subCategories
    ? tempFilters.subCategories.length
    : 0;
  const [appliedFilters, setAppliedFilters] = useState({ ...tempFilters });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isSearchActive = searchTerm !== ""; // Check if there is text in the search bar

  const filterCount = useMemo(() => {
    let count = 0;
    count += tempFilters.categories.length;
    count += tempFilters.subCategories.length;
    if (tempFilters.dateRange.from) count += 1;
    if (tempFilters.dateRange.to) count += 1;
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
        (!filtersToApply.dateRange.from ||
          tx.createdAt.split(" ")[0] >= filtersToApply.dateRange.from) &&
        (!filtersToApply.dateRange.to ||
          tx.createdAt.split(" ")[0] <= filtersToApply.dateRange.to);

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
        (!tempFilters.dateRange.from ||
          tx.createdAt.split(" ")[0] >= tempFilters.dateRange.from) &&
        (!tempFilters.dateRange.to ||
          tx.createdAt.split(" ")[0] <= tempFilters.dateRange.to);

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
      dateRange: { from: "", to: "" },
      amountRange: { min: "", max: "" },
    });
    setTempFilters({
      categories: [],
      subCategories: [],
      dateRange: { from: "", to: "" },
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
    (appliedFilters.dateRange.from &&
      appliedFilters.dateRange.from.trim() !== "") ||
    (appliedFilters.dateRange.to &&
      appliedFilters.dateRange.to.trim() !== "") ||
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
      <div className="mb-10 flex items-center justify-between">
        <h2 className="p-2 font-extrabold text-xl md:text-4xl lg:text-3xl xl:text-5xl md:text-left text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-400 to-purple-500">
          My Budget List
        </h2>
        <div className="flex items-center justify-end gap-4">
          <Link href="/dashboard/income">
            <Button className="budg-btn4">Go to Incomes</Button>
          </Link>
          <Button className="[&_svg]:size-6 budg-btn4" onClick={refreshData}>
            <RefreshCcw />
          </Button>
        </div>
      </div>

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
            <Button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white px-3 py-1 rounded-full shadow-md text-sm xs:text-base transition-transform duration-300 bg-gradient-to-r from-blue-500 to-teal-500 dark:from-pink-400 dark:to-yellow-400 hover:scale-110 active:scale-95"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Dialog onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button
                className={`flex items-center gap-2 px-4 py-2 rounded-3xl transition-colors ${
                  filterCount > 0
                    ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 dark:from-violet-700 dark:via-violet-800 dark:to-violet-900 dark:text-white dark:hover:from-violet-800 dark:hover:via-violet-900 dark:hover:to-violet-950"
                    : "bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 text-purple-700 hover:from-purple-200 hover:via-purple-300 hover:to-purple-400 dark:from-violet-900 dark:via-violet-950 dark:to-purple-900 dark:text-violet-300 dark:hover:from-violet-800 dark:hover:via-violet-900 dark:hover:to-purple-950"
                }`}
              >
                <Filter size={20} />
                {filterCount > 0 ? `Filters (${filterCount})` : "Filter"}
              </Button>
            </DialogTrigger>
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,200,255,0.3)] w-[95%] max-w-lg max-h-[80vh] md:max-h-[90vh] overflow-y-auto">
              {/* Background Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-purple-400 via-blue-400 to-transparent dark:from-indigo-800 dark:via-blue-800 dark:to-gray-800 opacity-25 blur-3xl animate-spin-slow"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-teal-300 via-blue-300 to-transparent dark:from-blue-900 dark:via-teal-800 dark:to-gray-800 opacity-30 blur-[120px]"></div>
              </div>
              {/* Filter Heading */}
              <DialogHeader>
                <DialogTitle className="flex gap-2 items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400">
                  Budget Filter
                </DialogTitle>
                <DialogDescription asChild>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select filters to apply to your transactions.
                  </p>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Date Range */}
                <div>
                  <label className="budg-text1">Budget Creation Date Range</label>
                  <div className="mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            "budg-select-field justify-start",
                            !tempFilters.dateRange.from &&
                              "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {tempFilters.dateRange.from ? (
                            tempFilters.dateRange.to ? (
                              <>
                                {format(
                                  new Date(tempFilters.dateRange.from),
                                  "LLL dd, y"
                                )}{" "}
                                -{" "}
                                {format(
                                  new Date(tempFilters.dateRange.to),
                                  "LLL dd, y"
                                )}
                              </>
                            ) : (
                              format(
                                new Date(tempFilters.dateRange.from),
                                "LLL dd, y"
                              )
                            )
                          ) : (
                            <span>Pick a Date Range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={
                            tempFilters.dateRange.from
                              ? new Date(tempFilters.dateRange.from)
                              : new Date()
                          }
                          selected={{
                            from: tempFilters.dateRange.from
                              ? new Date(tempFilters.dateRange.from)
                              : undefined,
                            to: tempFilters.dateRange.to
                              ? new Date(tempFilters.dateRange.to)
                              : undefined,
                          }}
                          onSelect={(e) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              dateRange: {
                                from: e?.from
                                  ? format(e.from, "yyyy-MM-dd")
                                  : "",
                                to: e?.to ? format(e.to, "yyyy-MM-dd") : "",
                              },
                            }))
                          }
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                {/* Amount Range */}
                <div>
                  <label className="budg-text1">Amount Range</label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <Input
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
                      className="budg-input-field rounded-3xl focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                    />
                    <Input
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
                      className="budg-input-field rounded-3xl focus-visible:ring-cyan-400 dark:focus-visible:ring-blue-400 focus-visible:ring-[2px]"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div
                  className="relative max-h-[300px] overflow-y-auto 
                    p-3 shadow-sm rounded-xl border-2 
                    bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900
                    border-cyan-400 dark:border-blue-800 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="budg-text1">
                        Categories ({expenseCategoriesList.length})
                      </label>
                      {/* Show Selected Count Badge */}
                      {selectedCategoryCount > 0 && (
                        <Badge className="border-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-2 py-1 rounded-full text-xs dark:from-green-500 dark:to-green-700 ">
                          Selected: {selectedCategoryCount}
                        </Badge>
                      )}
                    </div>
                    <div>
                      {/* Clear Button */}
                      {selectedCategoryCount > 0 && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            setTempFilters({
                              ...tempFilters,
                              categories: [],
                            })
                          }
                          className="del2"
                          size="sm"
                        >
                          Clear Selection
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {expenseCategoriesList.map((category) => (
                      <Badge
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
                        className={`border-0 rounded-full text-sm cursor-pointer px-3 py-1 transition-all font-bold ${
                          tempFilters.categories.includes(
                            category.toLowerCase()
                          )
                            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sub-Categories (Only Show When Categories Are Selected) */}
                {tempFilters.categories.length > 0 && (
                  <div
                    className="relative max-h-[200px] overflow-y-auto 
                    p-3 shadow-sm rounded-xl border-2 
                    bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900
                    border-cyan-400 dark:border-blue-800 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="budg-text1">
                          Sub-Categories (
                          {
                            new Set(
                              tempFilters.categories.flatMap(
                                (category) =>
                                  expenseSubcategories[category] || []
                              )
                            ).size
                          }
                          )
                        </label>
                        {/* Show Selected Count Badge */}
                        {selectedSubCategoryCount > 0 && (
                          <Badge className="border-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-2 py-1 rounded-full text-xs dark:from-green-500 dark:to-green-700 ">
                            Selected: {selectedSubCategoryCount}
                          </Badge>
                        )}
                      </div>
                      <div>
                        {/* Clear Button */}
                        {selectedSubCategoryCount > 0 && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              setTempFilters({
                                ...tempFilters,
                                subCategories: [],
                              })
                            }
                            className="text-sm rounded-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 dark:border-gray-300"
                            size="sm"
                          >
                            Clear Selection
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Subcategories List */}
                    <div className="mt-3 flex flex-wrap gap-3">
                      {[
                        ...new Set(
                          tempFilters.categories.flatMap(
                            (category) => expenseSubcategories[category] || []
                          )
                        ),
                      ] // Convert Set back to an array to prevent duplicates
                        .map((subCategory) => (
                          <Badge
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
                            className={`border-0 rounded-full text-sm font-bold cursor-pointer px-3 py-1 transition-all ${
                              tempFilters.subCategories.includes(
                                subCategory.toLowerCase()
                              )
                                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            {subCategory}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="del2"
                  >
                    Clear Filters
                  </Button>
                  {hasActiveFilters && (
                    <Button onClick={resetFilters} className="del3">
                      Reset Filters
                    </Button>
                  )}
                  <DialogClose asChild>
                    <Button onClick={applyFilters} className="budg-btn4">
                      Apply Filters
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="del3">
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
                  refreshData={refreshData}
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
