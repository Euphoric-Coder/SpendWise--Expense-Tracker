"use client";

import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState } from "react";
import Typewriter from "typewriter-effect";

const Layout = ({ children }) => {
  const { signIn } = useSignIn();
  const [disableGuestLogin, setdisableGuestLogin] = useState(false);

  const GuestLogin = async () => {
    setdisableGuestLogin(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: process.env.NEXT_PUBLIC_TEST_USER_EMAIL, // Guest email
        password: process.env.NEXT_PUBLIC_TEST_USER_PASSWORD, // Guest password
      });

      if (signInAttempt.status === "complete") {
        window.location.href = "/dashboard"; // Redirect to a protected page
      } else {
        console.log("Further steps required");
      }
    } catch (err) {
      console.error("Error logging in as guest:", err);
      alert("Unable to log in as guest. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <section
        className="relative hidden w-1/2 lg:flex xl:w-2/5 items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #eef2ff, #e0f7fa, #fce4ec)",
        }}
      >
        {/* Subtle Radial Overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-purple-200 via-blue-100 to-transparent opacity-40"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(193, 223, 255, 0.3), transparent 70%), radial-gradient(circle at bottom right, rgba(233, 211, 255, 0.3), transparent 80%)",
          }}
        ></div>

        {/* Content */}
        <div className="p-2 mx-4 z-10 flex max-h-[800px] max-w-[650px] flex-col items-center justify-center space-y-12">
          {/* Logo */}
          <Image
            src="/favicon.png"
            alt="BudgetEase Logo"
            width={100}
            height={50}
            className="transition-all duration-500 hover:scale-110 drop-shadow-lg"
          />

          {/* Gradient Text with Typewriter Effect */}
          <div className="text-center">
            <h1
              className="text-4xl font-extrabold bg-clip-text text-transparent leading-snug"
              style={{
                background:
                  "linear-gradient(90deg, #6a11cb, #2575fc, #ff8a00, #ff5757)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <Typewriter
                options={{
                  strings: [
                    "Track, Analyze, and Optimize Your Expenses",
                    "Achieve Your Financial Goals Effortlessly",
                    "Master Your Budget with BudgetEase",
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 100,
                }}
              />
            </h1>
          </div>

          {/* Subtext */}
          <p
            className="text-lg font-medium leading-relaxed text-gray-700"
            style={{
              background:
                "linear-gradient(90deg, #6a11cb, #2575fc, #00c9a7, #f5b700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Take control of your finances with real-time tracking, insightful
            analytics, and smart budgeting tools.
          </p>

          {/* Features Section */}
          <div className="space-y-6 text-center">
            <div className="flex items-center space-x-3">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #ff8a00, #ff5757, #ff3572)",
                }}
              ></span>
              <p
                className="text-md font-semibold"
                style={{
                  background:
                    "linear-gradient(90deg, #6a11cb, #2575fc, #00c9a7, #f5b700)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Real-time expense tracking
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #00c9a7, #6a11cb, #2575fc)",
                }}
              ></span>
              <p
                className="text-md font-semibold"
                style={{
                  background:
                    "linear-gradient(90deg, #ff8a00, #2575fc, #f5b700, #6a11cb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Personalized financial insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #ff8a00, #ff5757, #6a11cb)",
                }}
              ></span>
              <p
                className="text-md font-semibold"
                style={{
                  background:
                    "linear-gradient(90deg, #6a11cb, #2575fc, #f5b700, #00c9a7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Set and achieve savings goals
              </p>
            </div>
          </div>

          {/* Illustration */}
          <Image
            src="/login-banner.png"
            alt="Finance Management Illustration"
            width={350}
            height={350}
            className="transition-all duration-500 hover:rotate-2 hover:scale-110 drop-shadow-md hover:shadow-lg"
          />
        </div>
      </section>

      {/* Right Section */}
      <main className="flex flex-1 items-center justify-center px-8 py-12 sm:px-12 lg:px-16 xl:px-20 bg-gray-50 dark:bg-gray-900">
        <div className="relative w-full max-w-lg">
          {/* Glassmorphism Card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md rounded-lg shadow-2xl"></div>
          <div className="relative p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            {/* Page Heading */}
            <div className="text-center">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500">
                Welcome Back!
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Take charge of your finances with{" "}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                  BudgetEase
                </span>
                . Your journey to financial freedom starts here.
              </p>
              <Button
                className="mt-4 login-btn"
                disabled={disableGuestLogin}
                onClick={GuestLogin}
              >
                Login as Guest
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="px-2 text-gray-500 dark:text-gray-400">or</span>
              <div className="w-full h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>

            {/* Login Form */}
            <div className="flex justify-center">{children}</div>

            {/* Footer Section */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't want to use personal credentials?{" "}
                <a
                  onClick={GuestLogin}
                  className="font-medium text-teal-500 hover:underline cursor-pointer"
                >
                  Use Guest Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
