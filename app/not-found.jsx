import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-50 dark:bg-blue-900 text-center text-blue-900 dark:text-blue-100">
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <div className="mb-6">
        <Image
          src="/404.png"
          alt="404 Illustration Light Mode"
          height={200}
          width={200}
          draggable={false}
          className="dark:hidden"
          />
        <Image
          src="/404-dark.png"
          alt="404 Illustration Dark Mode"
          height={200}
          width={200}
          draggable={false}
          className="hidden dark:block"
        />
      </div>
      <Link
        href="/"
        className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Return Home
      </Link>
      <div className="mt-8">
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
          Or try one of these pages:
        </p>
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="text-blue-500 dark:text-blue-200 hover:underline"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/budgets"
              className="text-blue-500 dark:text-blue-200 hover:underline"
            >
              Budget Page
            </Link>
          </li>
          <li>
            <Link
              href="/sign-in"
              className="text-blue-500 dark:text-blue-200 hover:underline"
            >
              Sign-in Page
            </Link>
          </li>
          <li>
            <Link
              href="/sign-up"
              className="text-blue-500 dark:text-blue-200 hover:underline"
            >
              Sign-up Page
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Page;
