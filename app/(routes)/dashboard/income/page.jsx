import IncomeList from "@/components/Income/IncomeList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="p-10 bg-gradient-to-br from-white via-cyan-50 to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-lg relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-500 dark:from-blue-800 dark:via-cyan-800 dark:to-teal-700 opacity-25 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 dark:from-blue-800 dark:via-teal-800 dark:to-cyan-700 opacity-30 blur-[100px]"></div>
      </div>

      {/* Income List */}
      <div className="mt-8">
        <IncomeList />
      </div>
    </div>
  );
};

export default page;
