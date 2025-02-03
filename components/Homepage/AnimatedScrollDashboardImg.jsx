import React, { useState, useEffect } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { CreditCard, PieChart, DollarSign } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

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

const AnimatedScrollDashboardImg = () => {
  const { theme } = useTheme(); // Access current theme (light/dark)
  const [screenSize, setScreenSize] = useState("large"); // Default to large screen

  // Update screen size state based on window size
  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth <= 420) {
        setScreenSize("mobile");
      } else if (window.innerWidth <= 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("large");
      }
    };

    // Initial check and resize event listener
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // Determine image URL based on theme and screen size
  const getResponsiveImage = () => {
    if (screenSize === "mobile") {
      return theme === "dark" ? "/dashboard-mobile-dark.png" : "/dashboard.png";
    } else if (screenSize === "tablet") {
      return theme === "dark"
        ? "/dashboard-tablet-dark.png"
        : "/dashboard-tablet.png";
    }
    return theme === "dark" ? "/dashboard-large-dark.png" : "/dashboard.png";
  };

  return (
    <div
      id="ai-features"
      className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500"
    >
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500 dark:from-purple-500 dark:via-pink-500 dark:to-blue-500">
              Empower Your Financial Journey with AI-Driven <br />
              <span className="text-4xl sm:text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-500 font-bold mt-2 leading-none">
                Personal Finance Advisor
              </span>
            </h1>
            <p className="text-md mb-6 sm:text-xl md:text-2xl mt-4 text-gray-700 dark:text-gray-300 font-mono font-semibold text-center">
              Leverage Finora, our advanced AI, to transform the way you manage
              your money. From real-time expense tracking and automated
              budgeting to personalized financial insights, Finora adapts to
              your spending patterns and goals. It identifies trends, predicts
              future expenses, and provides actionable recommendations to
              optimize your finances. Make smarter, faster decisions with the
              power of Finora&apos;s intelligent algorithms designed to simplify
              your financial journey.
            </p>
          </>
        }
      >
        {/* Responsive Image with Theme Support */}
        <div className="relative">
          <Image
            src={getResponsiveImage()} // Dynamically determined URL
            alt="Dashboard Preview"
            height={820}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top shadow-lg dark:shadow-gray-900"
            draggable={false}
          />
        </div>
      </ContainerScroll>

      <section
        id="key-features"
        className="p-16 cursor-default bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl pb-6 font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500 dark:from-purple-500 dark:via-pink-500 dark:to-blue-500">
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 transition-transform transform hover:scale-105 rounded-2xl bg-gradient-to-r from-pink-100 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-600"
            >
              <div className="flex justify-center mb-6">
                <feature.icon className="w-16 h-16 text-indigo-500 dark:text-teal-400" />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-3 bg-clip-text text-center text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 dark:from-teal-400 dark:via-purple-400 dark:to-indigo-400">
                {feature.title}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnimatedScrollDashboardImg;
