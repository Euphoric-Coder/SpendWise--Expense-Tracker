"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import {
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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 h-20 flex items-center transition-all duration-300 border-b-2 ${
        isScrolled
          ? "bg-gradient-to-r from-blue-900/80 via-gray-900/60 to-black/80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
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
            width={50}
            height={50}
            className="drop-shadow-lg"
          />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500 font-extrabold text-4xl hover:animate-pulse">
            SpendWise
          </span>
        </Link>

        {/* Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-teal-400 transition-all duration-300 text-2xl"
          >
            {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        {/* Navbar Links (Desktop) */}
        <nav
          className={`hidden md:flex gap-6 ${
            isScrolled ? "text-gray-300" : "text-gray-500"
          }`}
        >
          <a
            href="#hero"
            className="flex items-center gap-2 hover:text-teal-400 transition-all duration-300 font-semibold"
          >
            <AiOutlineHome className="text-lg" />
            Home
          </a>
          <a
            href="#ai-features"
            className="flex items-center gap-2 hover:text-teal-400 transition-all duration-300 font-semibold"
          >
            <AiOutlineThunderbolt className="text-lg" />
            AI Features
          </a>
          <a
            href="#key-features"
            className="flex items-center gap-2 hover:text-teal-400 transition-all duration-300 font-semibold"
          >
            <AiOutlineAppstore className="text-lg" />
            Key Features
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 hover:text-teal-400 transition-all duration-300 font-semibold"
          >
            <AiOutlineExperiment className="text-lg" />
            How It Works
          </a>
          <a
            href="#cta"
            className="flex items-center gap-2 hover:text-teal-400 transition-all duration-300 font-semibold"
          >
            <AiOutlineRocket className="text-lg" />
            Get Started
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex gap-4 items-center">
          {isSignedIn ? (
            <>
              <ModeToggle />
              <Link href={"/dashboard"}>
                <Button
                  variant="outline"
                  className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Dashboard
                </Button>
              </Link>
              <UserMenu />
            </>
          ) : (
            <>
              <Link href={"/sign-in"}>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 hover:border-teal-400 text-gray-300 hover:text-teal-400 transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button className="rounded-full bg-gradient-to-r from-teal-400 via-yellow-500 to-red-500 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="absolute top-20 left-0 w-full bg-gradient-to-r from-blue-900 via-gray-900 to-black shadow-lg py-5 text-center md:hidden">
          <Link
            href="#hero"
            onClick={toggleMenu}
            className="block text-gray-300 hover:text-teal-400 hover:text-xl text-lg font-semibold py-2"
          >
            Home
          </Link>
          <Link
            href="#ai-features"
            onClick={toggleMenu}
            className="block text-gray-300 hover:text-teal-400 hover:text-xl text-lg font-semibold py-2"
          >
            AI Features
          </Link>
          <Link
            href="#key-features"
            onClick={toggleMenu}
            className="block text-gray-300 hover:text-teal-400 hover:text-xl text-lg font-semibold py-2"
          >
            Key Features
          </Link>
          <Link
            href="#how-it-works"
            onClick={toggleMenu}
            className="block text-gray-300 hover:text-teal-400 hover:text-xl text-lg font-semibold py-2"
          >
            How It Works
          </Link>
          <Link
            href="#cta"
            onClick={toggleMenu}
            className="block text-gray-300 hover:text-teal-400 text-lg font-semibold py-2"
          >
            Get Started
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
