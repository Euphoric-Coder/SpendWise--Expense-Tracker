"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import {
  ChartArea,
  DollarSign,
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Wallet,
  Menu,
} from "lucide-react";
import { UserButtonMenu } from "../UserButton";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"; // shadcn Button
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"; // shadcn Drawer
import Link from "next/link";
import NotificationTab from "./Notifications";
import { ModeToggle } from "../ThemeButton";

const DashboardMobile = () => {
  const { user } = useUser();
  const path = usePathname();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Income", icon: DollarSign, path: "/dashboard/income" },
    { id: 3, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
    { id: 4, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
    {
      id: 5,
      name: "Transactions",
      icon: Wallet,
      path: "/dashboard/transactions",
    },
    {
      id: 6,
      name: "Finance Stats",
      icon: ChartArea,
      path: "/dashboard/finance-stats",
    },
    { id: 7, name: "Feedback", icon: ShieldCheck, path: "/dashboard/feedback" },
  ];

  return (
    <div className="bg-gradient-to-r from-white via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-300">
      {/* Top Bar */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-white via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-md backdrop-blur-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <span className="text-gray-700 dark:text-gray-300 text-lg font-bold">
            {user?.fullName || "User"}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <ModeToggle />
          <NotificationTab />
          {/* Hamburger Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="p-2 rounded-md bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 hover:shadow-md dark:from-blue-700 dark:via-purple-700 dark:to-pink-700"
              >
                <Menu
                  size={28}
                  className="text-blue-600 dark:text-blue-300 hover:animate-pulse"
                />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-6 bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-xl rounded-r-lg"
            >
              <SheetHeader>
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                  {/* User Name with Gradient */}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500 text-lg font-extrabold">
                    {user?.fullName || "User"}
                  </span>
                </div>
              </SheetHeader>

              {/* Menu Items */}
              <div className="mt-8 flex flex-col gap-5">
                {menuList.map((menu) => (
                  <Link key={menu.id} href={menu.path}>
                    <div
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-transform duration-300 hover:bg-gradient-to-br from-blue-200/60 via-purple-200/50 to-pink-200/40 dark:hover:bg-gradient-to-br dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 hover:shadow-lg transform hover:scale-105 ${
                        path === menu.path &&
                        "bg-gradient-to-br from-blue-300/70 via-purple-300/60 to-pink-300/50 dark:bg-gradient-to-br dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 shadow-lg"
                      }`}
                    >
                      <menu.icon
                        className="text-blue-600 dark:text-blue-300"
                        size={24}
                      />
                      <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500">
                        {menu.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobile;
