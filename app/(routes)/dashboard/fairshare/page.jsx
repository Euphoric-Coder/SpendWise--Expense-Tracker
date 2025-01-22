import React from 'react'

const page = () => {
  return (
    <div>
      <div className='text-center text-2xl font-bold text-gray-600 mt-10 animate-pulse'>
        This feature is still in development....
      </div>
    </div>
  )
}

export default page

// import React from "react";
// import {
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
//   Activity,
//   PiggyBank,
//   AlertCircle,
//   Wallet,
//   CreditCard,
// } from "lucide-react";

// const DashboardStats = ({
//   title,
//   amount,
//   trend,
//   icon:Icon,
//   alert,
//   className = "",
// }) => (
//   <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
//     <div className="flex justify-between items-start">
//       <div>
//         <p className="text-gray-500 text-sm">{title}</p>
//         <h3 className="text-2xl font-bold mt-1">{amount}</h3>
//         {trend && (
//           <p
//             className={`flex gap-1 items-center text-sm mt-2 ${
//               trend > 0 ? "text-green-500" : "text-red-500"
//             }`}
//           >
//             {trend > 0 ? <TrendingUp /> : <TrendingDown />}
//             {trend}% from last month
//           </p>
//         )}
//         {alert && (
//           <p
//             className={`text-sm mt-2 ${
//               alert.type === "warning" ? "text-red-500" : "text-yellow-500"
//             }`}
//           >
//             {alert.message}
//           </p>
//         )}
//       </div>
//       <div
//         className={`p-3 rounded-lg ${
//           alert?.type === "warning" ? "bg-red-100" : "bg-purple-100"
//         }`}
//       >
//         <Icon
//           className={
//             alert?.type === "warning" ? "text-red-600" : "text-purple-600"
//           }
//           size={24}
//         />
//       </div>
//     </div>
//   </div>
// );

// const ProgressBar = ({ value, max, className = "" }) => (
//   <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
//     <div
//       className="h-full bg-purple-600 transition-all duration-500"
//       style={{ width: `${(value / max) * 100}%` }}
//     />
//   </div>
// );

// export default function Dashboard() {
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-6">Financial Overview</h1>

//       {/* Main Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <DashboardStats
//           title="Total Budget"
//           amount="₹10.0L"
//           icon={Wallet}
//           trend={5.2}
//         />
//         <DashboardStats
//           title="Total Spend"
//           amount="₹4.3L"
//           icon={TrendingDown}
//           trend={-3.1}
//         />
//         <DashboardStats
//           title="Total Income"
//           amount="₹50.0K"
//           icon={DollarSign}
//           trend={5.2}
//         />
//         <DashboardStats
//           title="Savings"
//           amount="₹0"
//           icon={PiggyBank}
//           alert={{ type: "warning", message: "No savings" }}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Financial Health Card */}
//         <div className="bg-white rounded-xl p-6 shadow-lg lg:col-span-2">
//           <h2 className="text-lg font-semibold mb-4">Financial Health</h2>
//           <div className="space-y-6">
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Budget Utilization</span>
//                 <span className="font-medium">43% used</span>
//               </div>
//               <ProgressBar value={4.3} max={10} />
//             </div>
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Debt-to-Income</span>
//                 <span className="font-medium text-red-500">757.6%</span>
//               </div>
//               <ProgressBar value={75.76} max={100} className="bg-red-100" />
//             </div>
//             <div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Savings Rate</span>
//                 <span className="font-medium text-yellow-500">0%</span>
//               </div>
//               <ProgressBar value={0} max={100} className="bg-yellow-100" />
//             </div>
//           </div>
//         </div>

//         {/* Alerts Card */}
//         <div className="bg-white rounded-xl p-6 shadow-lg">
//           <h2 className="text-lg font-semibold mb-4">Alerts</h2>
//           <div className="space-y-4">
//             <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
//               <AlertCircle className="text-red-500 mt-0.5" size={20} />
//               <div>
//                 <p className="font-medium text-red-700">High Debt Level</p>
//                 <p className="text-sm text-red-600">
//                   Your debt exceeds recommended limits
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
//               <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
//               <div>
//                 <p className="font-medium text-yellow-700">No Savings</p>
//                 <p className="text-sm text-yellow-600">
//                   Consider setting aside some income
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="bg-white rounded-xl p-6 shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Recent Transactions</h2>
//           <button className="text-purple-600 text-sm hover:text-purple-700">
//             View All
//           </button>
//         </div>
//         <div className="space-y-4">
//           {[
//             {
//               desc: "Rent Payment",
//               amount: -27000,
//               date: "Today",
//               type: "Housing",
//             },
//             {
//               desc: "Salary Deposit",
//               amount: 50000,
//               date: "Yesterday",
//               type: "Income",
//             },
//             {
//               desc: "Loan Payment",
//               amount: -15000,
//               date: "2 days ago",
//               type: "Debt",
//             },
//           ].map((tx, i) => (
//             <div
//               key={i}
//               className="flex justify-between items-center border-b pb-4"
//             >
//               <div>
//                 <p className="font-medium">{tx.desc}</p>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-500">{tx.date}</span>
//                   <span
//                     className={`text-xs px-2 py-1 rounded-full ${
//                       tx.type === "Income"
//                         ? "bg-green-100 text-green-700"
//                         : tx.type === "Debt"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-purple-100 text-purple-700"
//                     }`}
//                   >
//                     {tx.type}
//                   </span>
//                 </div>
//               </div>
//               <p
//                 className={`font-semibold ${
//                   tx.amount > 0 ? "text-green-500" : "text-red-500"
//                 }`}
//               >
//                 {tx.amount > 0 ? "+" : ""}₹
//                 {Math.abs(tx.amount).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }