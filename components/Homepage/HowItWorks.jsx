import React from "react";

const steps = [
  { step: "Sign Up", description: "Create your free SpendWise account." },
  {
    step: "Add Your Expenses",
    description: "Easily log your daily, weekly, or monthly expenses.",
  },
  {
    step: "Set Your Budget",
    description: "Define your spending limits for various categories.",
  },
  {
    step: "Track and Analyze",
    description:
      "Monitor your spending and get actionable insights to optimize your budget.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 p-8 cursor-default bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500 dark:from-purple-500 dark:via-pink-500 dark:to-blue-500">
          How It Works
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto text-lg font-mono">
          Follow these simple steps to get started with SpendWise and take
          control of your expenses. Simplify budgeting, track your spending, and
          achieve your financial goals with ease.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-8 bg-gradient-to-r from-white via-indigo-100 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 rounded-3xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-3xl hover:border-pink-400 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-white dark:hover:bg-gradient-to-br dark:hover:from-gray-700 dark:hover:to-gray-600"
          >
            <div
              className={`flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 dark:from-purple-500 dark:to-blue-500 text-white shadow-lg transition-colors duration-300 hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-600`}
            >
              <span className="text-2xl font-bold">{index + 1}</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 dark:from-teal-400 dark:via-purple-400 dark:to-indigo-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-600">
              {step.step}
            </h3>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-3 hover:text-indigo-700 dark:hover:text-pink-400 transition-colors duration-300">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
