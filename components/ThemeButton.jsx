"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme(); // Use resolvedTheme for correct theme detection
  const [mounted, setMounted] = React.useState(false); // Track when the component is mounted

  // Set the mounted state to true when the component mounts
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering the icon until the component is mounted (fix hydration error)
  if (!mounted) {
    return null;
  }

  // Function to toggle between 'light' and 'dark' themes
  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <div
      onClick={toggleTheme}
      className={`relative w-16 h-16 aspect-square p-4 rounded-full cursor-pointer shadow-lg transform transition-all duration-300 group
    ${
      resolvedTheme === "light"
        ? "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 hover:from-blue-200 hover:to-blue-400"
        : "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:to-gray-800"
    }
  `}
    >
      {/* Background Glow */}
      <div
        className={`absolute inset-0 rounded-full opacity-30 blur-lg pointer-events-none 
      ${resolvedTheme === "light" ? "bg-blue-300" : "bg-gray-600"}
    `}
      ></div>

      {/* Icon with Subtle Glow */}
      <div className="flex items-center justify-center relative z-10">
        {resolvedTheme === "light" ? (
          <Moon
            className="text-blue-500 group-hover:text-blue-600 transition-transform duration-300 transform group-hover:scale-110"
            size={28}
          />
        ) : (
          <Sun
            className="text-gray-400 group-hover:text-gray-300 transition-transform duration-300 transform group-hover:scale-110"
            size={28}
          />
        )}
      </div>

      {/* Ring Effect on Hover */}
      <div
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 
      ${
        resolvedTheme === "light"
          ? "ring-2 ring-blue-300"
          : "ring-2 ring-gray-300"
      }
    `}
      ></div>

      {/* Pulse Animation */}
      <div
        className={`absolute inset-0 rounded-full opacity-50 blur-lg animate-pulse pointer-events-none 
      ${resolvedTheme === "light" ? "bg-blue-200" : "bg-gray-700"}
    `}
      ></div>

      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
