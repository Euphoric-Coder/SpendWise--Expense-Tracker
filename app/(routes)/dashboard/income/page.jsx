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

      {/* Header Section */}
      {/* <div className="flex justify-between items-center">
        <h2 className="font-extrabold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-400 to-lime-500">
          My Income Sources
        </h2>
        <Link href="/dashboard/budget">
          <Button className="rounded-full text-md bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 text-white px-6 py-3 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform">
            Go to Budget Tab
          </Button>
        </Link>
      </div> */}

      {/* Income List */}
      <div className="mt-8">
        <IncomeList />
      </div>
    </div>
  );
};

export default page;
