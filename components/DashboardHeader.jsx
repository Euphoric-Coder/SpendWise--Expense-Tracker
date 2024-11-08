import { UserButton } from "@clerk/nextjs";
import React from "react";

const DashboardHeader = () => {
  return (
    <div className="p-5 border-b flex justify-between">
      <div>Search bar</div>
      <div>
        <UserButton />
      </div>
    </div>
  );
};

export default DashboardHeader;
