import BudgetList from "@/components/Budgets/BudgetList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="p-10 bg-gradient-to-br from-white via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-lg relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 dark:from-blue-800 dark:via-purple-700 dark:to-yellow-600 opacity-25 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 dark:from-indigo-800 dark:via-purple-700 dark:to-blue-700 opacity-30 blur-[100px]"></div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
        <h2 className="p-2 font-extrabold text-xl md:text-4xl lg:text-3xl xl:text-5xl text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-400 to-purple-500">
          My Budget Category List
        </h2>
        <Link href="/dashboard/expenses">
          <Button className="rounded-full text-md bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 dark:from-blue-800 dark:via-teal-600 dark:to-purple-800 text-white px-6 py-3 font-semibold shadow-md hover:shadow-[0_4px_20px_rgba(0,200,255,0.5)] dark:hover:shadow-[0_4px_20px_rgba(100,150,255,0.5)] hover:scale-105 transition-transform">
            Go to Expense Tab
          </Button>
        </Link>
      </div>

      {/* Budget List */}
      <div className="mt-8">
        <BudgetList />
      </div>
    </div>
  );
};

export default page;
