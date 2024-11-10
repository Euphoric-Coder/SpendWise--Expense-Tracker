import BudgetList from "@/components/BudgetList";
import React from "react";

const page = () => {
  return (
    <div className="p-10 bg-gradient-to-b from-white via-blue-100 to-indigo-100 rounded-3xl shadow-xl">
      <h2 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-purple-500 mb-6">
        My Budget Category List
      </h2>
      <BudgetList />
    </div>
  );
};

export default page;
