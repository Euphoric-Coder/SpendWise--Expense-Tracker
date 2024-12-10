import React from "react";
import Typewriter from "typewriter-effect";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row relative overflow-hidden justify-center items-center font-mono px-6 py-8 md:px-10 md:py-5 lg:px-20 lg:py-10 h-fit gap-1 md:gap-15">
      {/* Floating Pulsing Circles */}
      <div className="absolute top-12 left-12 w-44 h-44 bg-gradient-to-br from-yellow-300 to-pink-400 dark:from-purple-900 dark:to-indigo-700 rounded-full filter blur-2xl opacity-60 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-br from-red-400 to-purple-500 dark:from-indigo-800 dark:to-purple-600 rounded-full filter blur-3xl opacity-50 animate-pulse-slower"></div>
      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-pink-300 to-indigo-300 dark:from-gray-800 dark:to-purple-700 rounded-full filter blur-2xl opacity-40 animate-pulse-slow"></div>

      {/* Soft Background Accents */}
      <div className="absolute top-1/2 left-2/3 w-36 h-36 bg-gradient-to-br from-teal-100 to-yellow-300 dark:from-indigo-900 dark:to-blue-800 rounded-full filter blur-3xl opacity-50 animate-pulse-slowest"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-pink-100 to-yellow-200 dark:from-gray-700 dark:to-purple-900 rounded-full filter blur-3xl opacity-45 animate-pulse-slower"></div>

      {/* Text Section */}
      <div className="relative z-12 w-full md:w-1/2 space-y-6 text-center md:text-left px-4 md:px-8 lg:px-16">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500 dark:from-purple-500 dark:via-pink-500 dark:to-indigo-400">
          Organize and Optimize Your{" "}
          <span className="text-pink-400 dark:text-purple-300">Expenses</span>
        </h2>

        {/* Typewriter Effect */}
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 dark:from-indigo-400 dark:via-purple-500 dark:to-pink-400">
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

        {/* Paragraph */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-mono font-bold text-gray-700 dark:text-gray-300 opacity-90 leading-relaxed text-justify">
          With{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 dark:from-indigo-500 dark:to-purple-500 font-bold">
            SpendWise
          </span>
          , you gain insights into your spending habits and make better
          financial decisions. Whether you're tracking daily{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-teal-500 dark:from-purple-400 dark:to-indigo-400 font-bold">
            expenses
          </span>{" "}
          or setting long-term{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 dark:from-pink-400 dark:to-purple-600 font-bold">
            financial goals
          </span>
          , SpendWise helps you stay on top of your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 dark:from-purple-500 dark:to-blue-500 font-bold">
            budget
          </span>
          . Easily{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 dark:from-indigo-400 dark:to-cyan-400 font-bold">
            categorize
          </span>{" "}
          your expenses, analyze your spending patterns, and receive valuable
          insights to help you save more and spend wisely.
        </p>

        {/* Call to Action Button */}
        <div className="mt-6">
          <Link href={"/dashboard"}>
            <Button className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 text-base sm:text-lg md:text-xl font-bold text-white rounded-full shadow-xl bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 dark:from-purple-500 dark:via-pink-500 dark:to-blue-500 hover:from-green-500 hover:via-teal-500 hover:to-blue-500 dark:hover:from-indigo-500 dark:hover:via-purple-500 dark:hover:to-cyan-400 transition-transform transform hover:scale-105 active:scale-95 duration-300">
              Start Tracking Your Expenses
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative z-12 w-full md:w-1/2 justify-center md:block hidden">
        <Image
          src="/side-image.png"
          alt="Expense Tracking Illustration"
          width={1200}
          height={300}
          className="w-full rounded-2xl transition-transform transform hover:scale-105 duration-500 dark:shadow-lg"
        />
      </div>
    </section>
  );
};

export default Hero;
