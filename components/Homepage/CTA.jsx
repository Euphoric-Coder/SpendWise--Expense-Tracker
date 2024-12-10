import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section
      id="cta"
      className="relative py-20 bg-gradient-to-br from-white via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-24 transition-colors duration-500"
    >
      {/* Background decorative elements */}
      <div className="absolute hidden md:block top-0 left-8 w-16 h-16 bg-gradient-to-r from-yellow-300 to-pink-300 dark:from-purple-600 dark:to-indigo-600 rounded-full shadow-lg"></div>
      <div className="absolute hidden md:block top-20 right-20 w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-300 dark:from-blue-600 dark:to-cyan-400 rounded-full shadow-md"></div>
      <div className="absolute hidden md:block bottom-10 left-16 w-12 h-12 bg-gradient-to-r from-blue-200 to-teal-200 dark:from-gray-600 dark:to-teal-700 rounded-full shadow-md"></div>
      <div className="absolute hidden md:block bottom-20 right-8 w-20 h-20 bg-gradient-to-r from-pink-100 to-yellow-100 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-sm"></div>

      <h2 className="text-5xl font-bold mb-6 p-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-blue-600 to-teal-400 dark:from-teal-400 dark:via-pink-500 dark:to-purple-600">
        Take Control of Your Finances Effortlessly
      </h2>
      <p className="text-lg mb-8 text-gray-700 dark:text-gray-300 max-w-2xl">
        Join thousands of users who trust SpendWise to track their expenses, set
        budgets, and achieve their financial goals with ease.
      </p>
      <Link href={"/dashboard"}>
        <Button className="px-8 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 dark:from-purple-500 dark:via-blue-500 dark:to-indigo-500 text-white hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 dark:hover:from-blue-500 dark:hover:via-teal-500 dark:hover:to-green-400 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105">
          Start Managing Now →
        </Button>
      </Link>
    </section>
  );
};

export default CTASection;
