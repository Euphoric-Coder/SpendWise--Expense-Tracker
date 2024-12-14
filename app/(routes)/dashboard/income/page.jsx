import IncomeList from "@/components/Income/IncomeList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="p-10 bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-3xl shadow-lg relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 opacity-25 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 opacity-30 blur-[100px]"></div>
      </div>
      {/* Income List */}
      <div className="mt-8">
        <IncomeList />
      </div>
    </div>
  );
};

export default page;
