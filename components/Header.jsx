"use client";

import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import UserMenu from "./UserButton";

const Header = () => {
  const { user, isSignedIn } = useUser();

  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <Link
        href={"/"}
        className="hover:scale-105 transition-transform duration-300 ease-in"
      >
        <Image
          src={"/logo.png"}
          alt="Logo of Spend Wise"
          width={100}
          height={100}
        />
      </Link>
      {isSignedIn ? (
        <UserMenu />
      ) : (
        <Link href={"/sign-in"}>
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
};

export default Header;
