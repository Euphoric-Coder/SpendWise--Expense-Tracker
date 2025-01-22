"use client";

import { useClerk } from "@clerk/nextjs";
import {
  ChartArea,
  IndianRupee,
  LayoutGrid,
  LucideShieldCheck,
  ReceiptIndianRupee,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { usePathname } from "next/navigation";
import { UserButtonMenu } from "../UserButton";

const DashboardSideNavbar = () => {
  const { openUserProfile } = useClerk();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Income", icon: IndianRupee, path: "/dashboard/income" },
    {
      id: 3,
      name: "Budgets",
      icon: ReceiptIndianRupee,
      path: "/dashboard/budgets",
    },
    {
      id: 4,
      name: "Transactions",
      icon: Wallet,
      path: "/dashboard/transactions",
    },
    { id: 5, name: "Fair Share", icon: Users, path: "/dashboard/fairshare" },
    {
      id: 6,
      name: "Finance Stats",
      icon: ChartArea,
      path: "/dashboard/finance-stats",
    },
  ];

  const path = usePathname();
  console.log(path);
  console.log(path.startsWith(`/dashboard/expenses/`));

  return (
    <div className="h-screen w-80 p-6 shadow-xl bg-gradient-to-br from-white/80 via-blue-50/60 to-purple-100/40 border border-gray-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:border-gray-600 rounded-3xl backdrop-blur-3xl flex flex-col items-center space-y-10 font-sans text-gray-700 dark:text-gray-300">
      {/* Logo Section */}
      <Link
        href="/"
        className="hover:scale-110 transition-transform duration-300 ease-in-out flex items-center gap-4"
      >
        <Image
          src="/favicon.png"
          alt="SpendWise Logo"
          width={60}
          height={60}
          draggable={false}
          className="drop-shadow-xl dark:drop-shadow-neon"
        />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-extrabold text-4xl hover:animate-glow">
          SpendWise
        </span>
      </Link>

      {/* Menu List */}
      <div className="w-full flex flex-col space-y-6">
        {menuList.map((menu) => (
          <Link key={menu.id} href={menu.path}>
            <div
              className={`flex items-center gap-5 px-6 py-4 rounded-3xl cursor-pointer transition-transform duration-500 hover:bg-gradient-to-br from-blue-200/60 via-purple-200/50 to-pink-200/40 dark:hover:bg-gradient-to-br dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 hover:shadow-lg dark:hover:shadow-[0px_10px_40px_rgba(100,150,255,0.3)] transform hover:scale-105 ${
                (path === menu.path ||
                  (menu.path === "/dashboard/budgets" &&
                    path.startsWith(`/dashboard/budgets/`)) ||
                  (menu.path === "/dashboard/income" &&
                    path.startsWith(`/dashboard/income/`))) &&
                "bg-gradient-to-br from-blue-300/70 via-purple-300/60 to-pink-300/50 dark:bg-gradient-to-br dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 shadow-lg dark:shadow-[0px_5px_20px_rgba(100,100,255,0.4)]"
              }`}
            >
              <menu.icon
                className="text-indigo-600 dark:text-blue-300"
                size={30}
              />
              <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500">
                {menu.name}{" "}
                <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                  {/* <br /> */}
                  {(menu.name === "Transactions" ||
                    menu.name === "Fair Share") &&
                    " (beta)"}
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Profile Section */}
      <div className="w-full mt-auto">
        <div className="relative mx-auto w-[95%] px-6 py-5 bg-gradient-to-br from-white/70 via-blue-100/50 to-purple-200/40 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-500 rounded-3xl shadow-xl hover:shadow-2xl dark:shadow-[0px_15px_50px_rgba(100,150,255,0.2)] dark:hover:shadow-[0px_20px_60px_rgba(150,200,255,0.4)] transition-transform duration-300 flex items-center gap-5 backdrop-blur-3xl">
          {/* User Avatar */}
          <UserButtonMenu />

          {/* Profile Info */}
          <div className="flex flex-col flex-1">
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
              Your Profile
            </span>
            <button
              onClick={() => openUserProfile()}
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors duration-200"
            >
              Manage your account
            </button>
            {/* Styled HoverCard */}
            <HoverCard>
              <HoverCardTrigger>
                <button className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:underline transition-colors duration-200">
                  More Actions →
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-60 bg-gradient-to-br from-white/70 via-blue-100/60 to-purple-200/50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-500 rounded-3xl shadow-xl p-4">
                <div className="flex flex-col gap-4">
                  {/* Feedback Option */}
                  <div className="flex items-center gap-5 cursor-pointer text-sm font-bold text-gray-900 dark:text-gray-300 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 rounded-3xl px-4 py-2 shadow hover:shadow-lg hover:scale-105 transition-transform duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400">
                    <LucideShieldCheck className="inline text-indigo-600 dark:text-blue-300" />
                    <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500">
                      {" "}
                      <Link href={"/dashboard/feedback"} className="block">
                        Feedback
                      </Link>
                    </span>
                  </div>
                  {/* Settings Option */}
                  <div className="flex items-center gap-5 cursor-pointer text-sm font-bold text-gray-900 dark:text-gray-300 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 rounded-3xl px-4 py-2 shadow hover:shadow-lg hover:scale-105 transition-transform duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400">
                    <Settings className="inline text-indigo-600 dark:text-blue-300" />
                    <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500">
                      {" "}
                      Settings
                    </span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Subtle Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 to-purple-500 dark:from-blue-700 dark:to-purple-700 opacity-25 blur-lg pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideNavbar;
