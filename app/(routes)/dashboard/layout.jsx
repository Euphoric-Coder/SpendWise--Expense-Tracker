"use client";

import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Budgets } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import DashboardSideNavbar from "@/components/Dashboard/DashboardSideNavbar";
import Loading from "@/components/Loader";
import NotificationTab from "@/components/Dashboard/Notifications";
import DashboardMobile from "@/components/Dashboard/DashboardMobile";

const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const checkUserBudgets = async () => {
      if (pathname === "/dashboard") {
        const result = await db
          .select()
          .from(Budgets)
          .where(
            eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)
          );
        if (result?.length === 0) {
          router.replace("/dashboard/budgets");
        } else {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    };

    user && checkUserBudgets();
  }, [pathname, user, router]);

  if (checking) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen">
      <div className="fixed top-0 left-0 lg:w-80 xl:block hidden w-full h-screen bg-transparent z-10">
        <DashboardSideNavbar />
      </div>

      <div className="flex-1 xl:ml-80">
        <div className="block xl:hidden">
          <DashboardMobile />
        </div>

        <div className="hidden xl:block p-6">
          <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl relative overflow-hidden transition-transform transform hover:scale-y-105 duration-500">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-300 via-teal-300 to-purple-500 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 opacity-30 blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-purple-400 via-indigo-300 to-blue-400 dark:from-gray-600 dark:via-gray-500 dark:to-gray-400 opacity-20 blur-[100px]"></div>
            </div>

            <div className="relative z-10 flex justify-between">
              <h2 className="font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-blue-300 dark:via-purple-400 dark:to-pink-300 animate-gradient-text">
                {getGreeting()}, {user?.fullName || "Valued User"}
              </h2>
              <NotificationTab />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Your dashboard is ready. Let&apos;s take control of your expenses
              today!
            </p>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
