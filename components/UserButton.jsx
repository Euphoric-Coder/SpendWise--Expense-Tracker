"use client";

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt, Home, Star, TableOfContents } from "lucide-react";

export const UserMenu = () => {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Dashboard"
          labelIcon={<ChartNoAxesGantt size={24} />}
          href="/dashboard"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export const UserButtonMenu = () => {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="Home Page"
          labelIcon={<Home size={24} />}
          href="/"
        />
        <UserButton.Link
          label="My Dashboard"
          labelIcon={<TableOfContents size={24} />}
          href="/dashboard"
        />
        <UserButton.Link
          label="Add a Feedback"
          labelIcon={<Star size={24} />}
          href="/dashboard/feedback"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
};

