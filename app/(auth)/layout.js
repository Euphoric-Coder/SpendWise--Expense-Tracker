import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12 font-mono">
        {/* Left Section with Image and Gradient Overlay */}
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Expense Tracking Background"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        {/* Right Section with Sign-In Form */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl text-center">
            {/* Page Heading with Gradient Filled Text */}
            <h1 className="mt-6 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 sm:text-5xl md:text-6xl">
              Welcome to SpendWise
            </h1>

            {/* Page Subtext with Gradient Highlight */}
            <p className="mt-4 leading-relaxed text-gray-700 text-lg font-extrabold">
              Take control of your finances with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 font-semibold">
                SpendWise
              </span>
              . Track your expenses, set savings goals, and gain insights into
              your spending habits.
            </p>

            <p className="mt-2 leading-relaxed text-gray-600">
              Join today and start your journey to financial freedom with
              powerful tools to manage your budget.
            </p>

            {/* Centered SignIn Component with Button Shadow */}
            <div className="mt-8 flex justify-center">
              <div className="shadow-lg rounded-lg overflow-hidden transition duration-300 transform hover:scale-105">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default AuthLayout;
