"use client";

import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Budgets } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import DashboardSideNavbar from "@/components/Dashboard/DashboardSideNavbar";
import Loading from "@/components/Loader";
import DashboardMobile from "@/components/Dashboard/DashboardMobile";

const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

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
      <div className="fixed top-0 left-0 lg:w-80 lg:block hidden w-full h-screen bg-transparent z-10">
        <DashboardSideNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        <div className="block lg:hidden">
          <DashboardMobile />
        </div>
        <div className="p-6 bg-gradient-to-r from-white via-blue-50 to-blue-50 dark:from-black dark:via-gray-800 dark:to-gray-800 min-h-screen transition-colors duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
