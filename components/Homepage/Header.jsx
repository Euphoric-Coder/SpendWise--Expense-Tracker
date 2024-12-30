"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlineThunderbolt,
  AiOutlineExperiment,
  AiOutlineRocket,
} from "react-icons/ai";
import { UserMenu } from "../UserButton";
import { ModeToggle } from "../ThemeButton";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const togleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define nav links array
  const navLinks = [
    { href: "#hero", label: "Home", icon: <AiOutlineHome /> },
    {
      href: "#ai-features",
      label: "AI Features",
      icon: <AiOutlineThunderbolt />,
    },
    {
      href: "#key-features",
      label: "Key Features",
      icon: <AiOutlineAppstore />,
    },
    {
      href: "#how-it-works",
      label: "How It Works",
      icon: <AiOutlineExperiment />,
    },
    { href: "#cta", label: "Get Started", icon: <AiOutlineRocket /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 h-20 flex items-center transition-all duration-300 border-b border-indigo-300 dark:border-cyan-800 ${
        isScrolled
          ? "bg-gradient-to-r from-white via-blue-50 to-indigo-200 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900 shadow-lg"
          : "bg-gradient-to-r from-cyan-50 via-purple-50 to-indigo-50 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-900"
      }`}
    >
      <div className="px-5 flex justify-between items-center max-w-7xl mx-auto w-full">
        {/* Logo Section */}
        <Link
          href="/"
          className="hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-3"
        >
          <Image
            src={"/favicon.png"}
            alt="Logo of SpendWise"
            width={35}
            height={35}
            className="drop-shadow-lg sm:w-[50px] sm:h-[50px]"
          />
          <span className="text-transparent text-xl sm:text-4xl bg-clip-text bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500 font-extrabold hover:animate-pulse dark:from-purple-400 dark:via-pink-500 dark:to-blue-500">
            SpendWise
          </span>
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          {isSignedIn ? (
            <>
              <UserMenu />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:scale-105 hover:shadow-lg transition-all duration-300 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500"
                >
                  Sign In
                </Button>
              </Link>
            </>
          )}
          <button
            onClick={togleMobileMenu}
            className="text-gray-500 hover:text-teal-500 transition-all duration-300 text-2xl dark:text-gray-300 dark:hover:text-purple-500"
          >
            {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        {/* Navbar Links (Desktop) */}
        <nav
          className={`hidden xl:flex gap-6 ${
            isScrolled
              ? "text-gray-700 dark:text-gray-300"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 hover:text-teal-500 dark:hover:text-purple-400 transition-all duration-500 font-semibold hover:font-extrabold hover:scale-110 hover:animate-pulse"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex gap-4 items-center">
          <ModeToggle />
          {isSignedIn ? (
            <>
              <Link href={"/dashboard"}>
                <Button
                  variant="outline"
                  className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-300 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500"
                >
                  Dashboard
                </Button>
              </Link>
              <UserMenu />
              {/* <Link href={"/try-out"}>
                <Button
                  variant="outline"
                  className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-300 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500"
                >
                  Try Out
                </Button>
              </Link> */}
            </>
          ) : (
            <>
              <Link href={"/sign-in"}>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 hover:border-teal-500 text-gray-700 hover:text-teal-500 transition-all duration-300 dark:border-gray-500 dark:hover:border-purple-400 dark:text-gray-300 dark:hover:text-purple-400"
                >
                  Sign In
                </Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button className="rounded-full bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl dark:from-purple-500 dark:via-pink-500 dark:to-blue-500">
                  Get Started
                </Button>
              </Link>
            </>
          )}
          {/* Hamburger Menu for Tablets */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-teal-500 transition-all duration-300 text-2xl dark:text-gray-300 dark:hover:text-purple-500"
            >
              {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Tablet Menu */}
      {isMenuOpen && (
        <nav className="absolute top-20 left-0 w-full bg-gradient-to-r from-teal-300 via-blue-300 to-indigo-400 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900 shadow-lg py-5 text-center xl:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={toggleMenu}
              className="block text-gray-700 hover:text-teal-500 dark:text-gray-300 dark:hover:text-purple-400 hover:text-xl text-lg font-semibold py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="absolute top-20 left-0 w-full bg-gradient-to-r from-teal-300 via-blue-200 to-indigo-200 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900 shadow-lg py-6 text-center xl:hidden">
          {/* Navigation Links */}
          <div className="mt-2 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={togleMobileMenu}
                className="block text-gray-700 hover:text-teal-500 dark:text-gray-300 dark:hover:text-purple-400 text-lg font-semibold py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Dashboard Button */}
          <div className="mt-6 px-6">
            <Link href={"/dashboard"} onClick={togleMobileMenu}>
              <button className="w-full px-4 py-3 text-lg font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 dark:from-purple-500 dark:via-blue-500 dark:to-indigo-500 hover:scale-105 transform transition duration-300">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
