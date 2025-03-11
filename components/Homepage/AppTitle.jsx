import Image from "next/image";
import React from "react";

const AppTitle = () => {
  return (
    <header
      id="hero"
      className="text-center space-y-4 py-6 relative w-full flex flex-col items-center justify-center"
    >
      {/* Center-Aligned Title Section at the Top */}
      <div className="flex items-center justify-center gap-3 transition-transform transform duration-500 ease-in-out hover:scale-105 cursor-default">
        <Image
          src="/wallet.png" // Replace with an appropriate icon for BudgetEase
          alt="BudgetEase Icon"
          width={500}
          height={400}
          className="p-2 w-14 sm:w-16 md:w-20 lg:w-24"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-teal-500 hover:via-indigo-500 hover:to-pink-500 dark:from-cyan-400 dark:via-indigo-500 dark:to-purple-600 dark:hover:from-purple-500 dark:hover:via-pink-500 dark:hover:to-blue-500">
          BudgetEase: Expense Tracker
        </h1>
      </div>

      {/* Animated Underline */}
      <div className="relative w-full h-1 mx-auto max-w-md mt-2">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-red-500 rounded-full animate-gradient-move dark:from-purple-500 dark:via-pink-500 dark:to-blue-500" />
      </div>

      <p className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 opacity-90 px-4 md:px-8 lg:px-12 leading-relaxed font-mono">
        Take control of your finances with BudgetEase, your personal expense
        tracking tool.
      </p>
    </header>
  );
};

export default AppTitle;
