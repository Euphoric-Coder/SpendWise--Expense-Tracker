"use client";

import { UserButton, useClerk } from "@clerk/nextjs";
import { ChartArea, DollarSign, LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButtonMenu } from "../UserButton";

const DashboardSideNavbar = () => {
  const { openUserProfile } = useClerk();

  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Income",
      icon: DollarSign,
      path: "/dashboard/income",
    },
    {
      id: 4,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 5,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 3,
      name: "Transactions",
      icon: ReceiptText,
      path: "/dashboard/transactions",
    },
    {
      id: 6,
      name: "Finance Stats",
      icon: ChartArea,
      path: "/dashboard/finance-stats",
    },
    {
      id: 7,
      name: "Feedback",
      icon: ShieldCheck,
      path: "/dashboard/feedback",
    },
  ];

  const path = usePathname();

  return (
    <div className="h-screen p-6 border shadow-2xl bg-gradient-to-b from-white via-blue-50 to-indigo-50 rounded-3xl flex flex-col items-center space-y-8 font-mono text-gray-800">
      {/* Logo */}
      {/* <Image
        src={"/logo.svg"}
        alt="Logo of SpendWise"
        width={160}
        height={100}
        className="mb-8"
      /> */}
      <div className="flex flex-row items-center gap-2">
        <Image src={"/favicon.png"} alt="logo" width={60} height={25} />
        <span className="text-blue-800 font-bold text-2xl">SpendWise</span>
      </div>

      {/* Menu List */}
      <div className="w-full flex flex-col space-y-3">
        {menuList.map((menu) => (
          <Link key={menu.id} href={menu.path}>
            <div
              key={menu.id}
              className={`flex items-center gap-4 px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gradient-to-r from-teal-100 to-indigo-100 hover:shadow-md transform hover:scale-105 ${
                path == menu.path &&
                "bg-gradient-to-r from-teal-100 to-indigo-100"
              }`}
            >
              <menu.icon className="text-indigo-500" />
              <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500">
                {menu.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Refined Profile Section */}
      <div className="mt-auto w-full flex justify-center fixed bottom-12">
        <div className="relative mx-4 px-6 py-4 bg-gradient-to-r from-white to-indigo-50 rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 flex items-center gap-4 border border-transparent bg-clip-padding backdrop-filter backdrop-blur-lg">
          {/* User Avatar */}
          <UserButtonMenu />

          {/* Profile Info */}
          <div className="flex flex-col">
            <span className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 whitespace-nowrap">
              Your Profile
            </span>
            <button
              onClick={() => openUserProfile()}
              className="text-sm text-gray-600 cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 whitespace-nowrap"
            >
              Manage your account
            </button>
          </div>

          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 opacity-20 blur-lg pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideNavbar;
