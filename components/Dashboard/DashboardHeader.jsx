'use client'

import { useUser } from "@clerk/nextjs";
import React from "react";
import { UserButtonMenu } from "../UserButton";

const DashboardHeader = () => {
  const {user} = useUser();
  return (
    <div className="p-5 border-b flex justify-between">
      <div>{user?.fullName}</div>
      <div>
        <UserButtonMenu />
      </div>
    </div>
  );
};

export default DashboardHeader;
