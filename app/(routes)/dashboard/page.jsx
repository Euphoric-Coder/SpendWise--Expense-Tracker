'use client'

import { useUser } from "@clerk/nextjs";
import React from "react";

const page = () => {
  const {user} = useUser();
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour > 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18 && currentHour > 12) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  return <div className="p-8">
    <h2 className="font-bold text-3xl">{getGreeting()}, {user?.fullName}</h2>
    <p className="text-gray-500">Here's what happening with your money, Let's Manage your expense</p>
  </div>;
};

export default page;
