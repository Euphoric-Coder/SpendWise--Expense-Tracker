import React from "react";
import { CreditCard, PieChart, DollarSign } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Track Expenses",
    description:
      "Log and categorize your expenses with ease for better financial management.",
  },
  {
    icon: PieChart,
    title: "Analyze Spending",
    description:
      "Get insights into your spending patterns with detailed reports and charts.",
  },
  {
    icon: DollarSign,
    title: "Set Budgets",
    description:
      "Create and monitor budgets to stay on track with your financial goals.",
  },
];

const KeyFeatures = () => {
  return (
    <section className="p-16 cursor-default">
      <h2 className="text-3xl sm:text-4xl md:text-5xl pb-6 font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500">
        Key Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-8 transition-transform transform hover:scale-105 rounded-2xl bg-gradient-to-r from-pink-100 via-white to-indigo-100 border-2"
          >
            <div className="flex justify-center mb-6">
              <feature.icon className="w-16 h-16 text-indigo-500" />
            </div>
            <h3 className="text-3xl font-semibold text-gray-900 mb-3 bg-clip-text text-center text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400">
              {feature.title}
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyFeatures;
