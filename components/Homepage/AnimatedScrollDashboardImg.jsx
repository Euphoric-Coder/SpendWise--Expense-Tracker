import React, { useState, useEffect } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import { useTheme } from "next-themes";

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
      return theme === "dark"
        ? "/dashboard-mobile-dark.png"
        : "/dashboard.png";
    } else if (screenSize === "tablet") {
      return theme === "dark"
        ? "/dashboard-tablet-dark.png"
        : "/dashboard-tablet.png";
    }
    return theme === "dark"
      ? "/dashboard-large-dark.png"
      : "/dashboard.png";
  };

  return (
    <div id="ai-features" className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
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
    </div>
  );
};

export default AnimatedScrollDashboardImg;
