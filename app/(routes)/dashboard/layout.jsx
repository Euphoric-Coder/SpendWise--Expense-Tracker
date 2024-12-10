"use client";

import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Budgets } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardSideNavbar from "@/components/Dashboard/DashboardSideNavbar";
import Loading from "@/components/Loader";
import NotificationTab from "@/components/Dashboard/Notifications";

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

  // Run the budget check directly within the component logic
  useEffect(() => {
    const checkUserBudgets = async () => {
      if (pathname === "/dashboard") {
        const result = await db
          .select()
          .from(Budgets)
          .where(
            eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)
          );
        if (result?.length == 0) {
          router.replace("/dashboard/budgets");
        } else {
          setChecking(false); // Allow rendering if the check passes
        }
      } else {
        setChecking(false); // Allow rendering if not on the target path
      }
    };

    user && checkUserBudgets();
  }, [pathname, user, router]);

  // Render loading state if check is still in progress
  if (checking) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar with increased width for laptops, hidden for mobile devices*/}
      <div className="fixed top-0 left-0 lg:w-72 lg:block hidden w-full h-screen bg-transparent shadow-lg z-10">
        <DashboardSideNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Mobile Header */}
        <div className="block lg:hidden">
          <DashboardHeader />
        </div>

        {/* Greeting Section for Larger Screens */}
        <div className="hidden lg:block p-6">
          <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-3xl shadow-2xl relative overflow-hidden transition-transform transform hover:scale-y-105 duration-500">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-300 via-teal-300 to-purple-500 opacity-30 blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-purple-400 via-indigo-300 to-blue-400 opacity-20 blur-[100px]"></div>
            </div>

            {/* Greeting Section */}
            <div className="relative z-10 flex justify-between">
              <h2 className="font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 animate-gradient-text">
                {getGreeting()}, {user?.fullName || "Valued User"}
              </h2>
              <NotificationTab />
            </div>
              <p className="text-lg text-gray-600 mt-2">
                Your dashboard is ready. Let&apos;s take control of your
                expenses today!
              </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 bg-gradient-to-b from-white via-blue-50 to-indigo-50 rounded-3xl shadow-xl min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
