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

// 'use client';

// import Image from "next/image";
// import React from "react";
// import Typewriter from "typewriter-effect";

// const layout = ({ children }) => {
//   return (
//     <div className="flex min-h-screen">
//       {/* Left Section */}
//       <section
//         className="relative hidden w-1/2 lg:flex xl:w-2/5 items-center justify-center"
//         style={{
//           background: "linear-gradient(135deg, #eef2ff, #e0f7fa, #fce4ec)",
//         }}
//       >
//         {/* Subtle Radial Overlays */}
//         <div
//           className="absolute inset-0 bg-gradient-to-b from-purple-200 via-blue-100 to-transparent opacity-40"
//           style={{
//             background:
//               "radial-gradient(circle at top left, rgba(193, 223, 255, 0.3), transparent 70%), radial-gradient(circle at bottom right, rgba(233, 211, 255, 0.3), transparent 80%)",
//           }}
//         ></div>
//         <div className="p-2 z-10 flex max-h-[800px] max-w-[450px] flex-col items-center justify-center space-y-12">
//           {/* Logo */}
//           <Image
//             src="/StorEase.png"
//             alt="logo"
//             width={522}
//             height={200}
//             className="transition-all duration-500 hover:scale-110 drop-shadow-lg"
//           />
//           {/* Gradient Text with Typewriter Effect */}
//           <div className="text-center">
//             <h1
//               className="text-4xl font-extrabold bg-clip-text text-transparent leading-snug"
//               style={{
//                 background:
//                   "linear-gradient(90deg, #6a11cb, #2575fc, #ff8a00, #ff5757)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}
//             >
//               <Typewriter
//                 options={{
//                   strings: [
//                     "Store, Manage, and Share Files Effortlessly",
//                     "Secure Your Files with Advanced Encryption",
//                     "Experience Seamless File Organization",
//                   ],
//                   autoStart: true,
//                   loop: true,
//                   delay: 100,
//                 }}
//               />
//             </h1>
//           </div>
//           <p
//             className="text-lg font-medium leading-relaxed text-gray-700"
//             style={{
//               background:
//                 "linear-gradient(90deg, #6a11cb, #2575fc, #00c9a7, #f5b700)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             Your one-stop solution to securely organize, access, and share files
//             anytime, anywhere.
//           </p>

//           {/* Features Section */}
//           <div className="space-y-6 text-center">
//             <div className="flex items-center space-x-3">
//               <span
//                 className="inline-block w-4 h-4 rounded-full"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #ff8a00, #ff5757, #ff3572)",
//                 }}
//               ></span>
//               <p
//                 className="text-md font-semibold"
//                 style={{
//                   background:
//                     "linear-gradient(90deg, #6a11cb, #2575fc, #00c9a7, #f5b700)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 Super-fast uploads with no lag
//               </p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span
//                 className="inline-block w-4 h-4 rounded-full"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #00c9a7, #6a11cb, #2575fc)",
//                 }}
//               ></span>
//               <p
//                 className="text-md font-semibold"
//                 style={{
//                   background:
//                     "linear-gradient(90deg, #ff8a00, #2575fc, #f5b700, #6a11cb)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 End-to-end encrypted file storage
//               </p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span
//                 className="inline-block w-4 h-4 rounded-full"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #ff8a00, #ff5757, #6a11cb)",
//                 }}
//               ></span>
//               <p
//                 className="text-md font-semibold"
//                 style={{
//                   background:
//                     "linear-gradient(90deg, #6a11cb, #2575fc, #f5b700, #00c9a7)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 Real-time file sharing with teams
//               </p>
//             </div>
//           </div>

//           {/* File Image */}
//           <Image
//             src="/files.png"
//             alt="File Image"
//             width={342}
//             height={342}
//             className="transition-all duration-500 hover:rotate-2 hover:scale-110 drop-shadow-md hover:shadow-lg"
//           />
//         </div>
//       </section>

//       {/* Right Section */}
//       <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
//         <div className="mb-16 lg:hidden">
//           <Image
//             src="/StorEase.png"
//             alt="logo"
//             width={522}
//             height={200}
//             className="h-auto w-[200px] lg:w-[250px] transition-all duration-500 hover:scale-110"
//           />
//         </div>
//         {children}
//       </section>
//     </div>
//   );
// };

// export default layout;

