"use client";

import React from "react";
import Typewriter from "typewriter-effect";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

const Hero = () => {
  const click = () => {
    redirect("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50 text-gray-900 flex flex-col items-center px-5 py-10 space-y-8 overflow-hidden">
      {/* Floating Pulsing Circles */}
      <div className="absolute top-12 left-12 w-44 h-44 bg-gradient-to-br from-yellow-300 to-pink-400 rounded-full filter blur-2xl opacity-60 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-br from-red-400 to-purple-500 rounded-full filter blur-3xl opacity-50 animate-pulse-slower"></div>
      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-pink-300 to-indigo-300 rounded-full filter blur-2xl opacity-40 animate-pulse-slow"></div>

      {/* Soft Background Accents */}
      <div className="absolute top-1/2 left-2/3 w-36 h-36 bg-gradient-to-br from-teal-100 to-yellow-300 rounded-full filter blur-3xl opacity-50 animate-pulse-slowest"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-pink-100 to-yellow-200 rounded-full filter blur-3xl opacity-45 animate-pulse-slower"></div>

      {/* Center-Aligned Title Section at the Top */}
      <header className="text-center space-y-4 py-6 relative w-full flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-3 transition-transform transform duration-500 ease-in-out hover:scale-105">
          <Image
            src="/wallet.png" // Replace with an appropriate icon for SpendWise
            alt="SpendWise Icon"
            width={500}
            height={400}
            className="w-10 sm:w-12 md:w-14 lg:w-16"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-teal-500 hover:via-indigo-500 hover:to-pink-500">
            SpendWise: Expense Tracker
          </h1>
        </div>

        {/* Animated Underline */}
        <div className="relative w-full h-1 mx-auto max-w-md mt-2">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-red-500 rounded-full animate-gradient-move" />
        </div>

        <p className="text-lg md:text-xl lg:text-2xl text-gray-700 opacity-90 px-4 md:px-8 lg:px-12 leading-relaxed font-mono">
          Take control of your finances with SpendWise, your personal expense
          tracking tool.
        </p>
      </header>

      {/* Hero Section Content */}
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-12 mt-8">
        {/* Left Column: Text and Typewriter Effect */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          {/* Main Heading and Typewriter Subheading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500">
            Organize and Optimize Your{" "}
            <span className="text-pink-400">Expenses</span>
          </h2>

          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500">
            <Typewriter
              options={{
                strings: [
                  "Track Your Spending",
                  "Set Financial Goals",
                  "Manage Your Budget",
                  "Analyze Your Expenses",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </div>

          {/* Description Paragraph with Emphasized Keywords */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-mono font-bold text-gray-700 opacity-90 leading-relaxed text-justify">
            With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 font-bold">
              SpendWise
            </span>
            , you gain insights into your spending habits and make better
            financial decisions. Whether you're tracking daily{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-teal-500 font-bold">
              expenses
            </span>{" "}
            or setting long-term{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 font-bold">
              financial goals
            </span>
            , SpendWise helps you stay on top of your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 font-bold">
              budget
            </span>
            . Easily{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-bold">
              categorize
            </span>{" "}
            your expenses, analyze your spending patterns, and receive valuable
            insights to help you save more and spend wisely.
          </p>

          {/* Redirecting to the Dashboard if logged in */}
          <div className="mt-6">
            <Link href={"/dashboard"}>
              <Button
                onClick={click}
                className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 text-base sm:text-lg md:text-xl font-bold text-white rounded-2xl shadow-xl bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 hover:from-green-500 hover:via-teal-500 hover:to-blue-500 transition-transform transform hover:scale-105 active:scale-95 duration-300"
              >
                Start Tracking Expenses
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Illustration */}
        <div className="relative w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            src="/dashboard.png" // Replace with an appropriate image path
            alt="Expense Tracking Illustration"
            className="w-full max-w-2xl rounded-2xl transition-transform transform hover:scale-105 duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
