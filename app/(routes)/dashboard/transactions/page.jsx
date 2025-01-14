"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Timer,
  TrendingUp,
  TrendingDown,
  TimerReset,
  CircleCheck,
} from "lucide-react";
import { expenseCategories, incomeCategories } from "@/data/categories";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const transactions = [
  {
    id: 1,
    desc: "Grocery Shopping",
    amount: -120,
    date: "2024-03-15",
    category: "groceries",
    status: "completed",
    type: "Expense",
    recurring: false,
    frequency: null,
    deletionRemark: null,
  },
  {
    id: 2,
    desc: "Salary Deposit",
    amount: 3500,
    date: "2024-03-14",
    category: "salary",
    status: "completed",
    type: "Income",
    recurring: true,
    frequency: "monthly",
    deletionRemark: null,
  },
  {
    id: 3,
    desc: "Utility Bills",
    amount: -250,
    date: "2024-03-13",
    category: "utilities",
    status: "pending",
    type: "Expense",
    recurring: true,
    frequency: "weekly",
    deletionRemark: null,
  },
  {
    id: 4,
    desc: "Freelance Work",
    amount: 800,
    date: "2024-03-12",
    category: "freelance",
    status: "completed",
    type: "Income",
    recurring: true,
    frequency: "monthly",
    deletionRemark: null,
  },
  {
    id: 5,
    desc: "Restaurant",
    amount: -85,
    date: "2024-03-11",
    category: "food",
    status: "completed",
    type: "Expense",
    recurring: false,
    frequency: null,
    deletionRemark: null,
  },
  {
    id: 6,
    desc: "Transport",
    amount: -30,
    date: "2024-03-10",
    category: "travel",
    status: "completed",
    type: "Expense",
    recurring: false,
    frequency: null,
    deletionRemark: null,
  },
];

// const transactions = [];
const categories = ["All Categories", "Food", "Bills", "Income", "Travel"];
const statuses = ["All Statuses", "completed", "pending"];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDescription = (currentIndex) => {
    if (expandedIndex === currentIndex) {
      setExpandedIndex(null); // Collapse if already expanded
    } else {
      setExpandedIndex(currentIndex); // Expand the current index
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm) ||
        tx.date.includes(searchTerm) ||
        tx.category.includes(searchTerm) ||
        tx.status.includes(searchTerm);
      const matchesCategory =
        selectedCategory === "All Categories" ||
        tx.category === selectedCategory.toLowerCase();
      const matchesStatus =
        selectedStatus === "All Statuses" || tx.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, selectedCategory, selectedStatus]);

  console.log(filteredTransactions);

  const exportTransactions = () => {
    const csvContent = [
      ["Name", "Date", "Description", "Category", "Amount", "Status"],
      ...filteredTransactions.map((tx) => [
        tx.name,
        tx.date,
        tx.desc,
        tx.category,
        tx.amount,
        tx.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="md:p-8">
      <div className="flex flex-col md:flex-row justify-center md:justify-between gap-2 items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className={`[&_svg]:size-7 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              showFilters
                ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:from-purple-600 hover:via-purple-700 hover:to-purple-800"
                : "bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 text-purple-700 hover:from-purple-200 hover:via-purple-300 hover:to-purple-400"
            } shadow-md`}
          >
            <Filter size={24} />
            Filter
          </Button>

          <Button
            onClick={exportTransactions}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 via-cyan-600 to-teal-500 hover:from-blue-600 hover:via-cyan-700 hover:to-teal-600 transition-all duration-300 shadow-md"
          >
            <Download size={24} />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="hidden md:block">
          {/* <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 uppercase">
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="">Category</TableHead>
                <TableHead className="">Amount</TableHead>
                <TableHead className="">Recurring</TableHead>
                <TableHead className="">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="flex gap-1 font-medium">
                    INV001{" "}
                    <span>
                      {tx.type === "Income" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-300 hover:scale-105 cursor-pointer transition-all duration-500">
                          Income
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-300 hover:scale-105 cursor-pointer transition-all duration-500">
                          Expense
                        </Badge>
                      )}
                    </span>
                    <span className="md:hidden table-cell">({tx.type})</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tx.desc}
                  </TableCell>
                  <TableCell>{format(tx.date, "PPP")}</TableCell>

                  <TableCell className="">
                    <span className="">
                      {tx.type === "Income" &&
                        (() => {
                          const category = incomeCategories.find(
                            (c) => c.id === tx.category
                          );
                          return category ? (
                            <>
                              <span
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-2"
                                style={{
                                  background: `linear-gradient(90deg, ${category.color} 0%, ${category.color} 100%)`,
                                  color: category.textColor || "white", // Ensure text is readable
                                }}
                              >
                                {category.icon && <category.icon size={18} />}
                                {category.name}
                              </span>
                            </>
                          ) : null;
                        })()}
                      {tx.type === "Expense" &&
                        (() => {
                          const category = expenseCategories.find(
                            (c) => c.id === tx.category
                          );
                          return category ? (
                            <>
                              <span
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-2"
                                style={{
                                  background: `linear-gradient(90deg, ${category.color} 0%, ${category.color} 100%)`,
                                  color: category.textColor || "white", // Ensure text is readable
                                }}
                              >
                                {category.icon && <category.icon size={18} />}
                                {category.name}
                              </span>
                            </>
                          ) : null;
                        })()}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`flex gap-1 px-6 py-4 whitespace-nowrap text-md font-semibold ${
                      tx.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.amount > 0 ? <TrendingUp /> : <TrendingDown />}
                    {tx.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`inline-flex items-center gap-1 rounded-full text-sm font-medium text-center transition duration-200 ease-in-out shadow-sm cursor-pointer ${
                        tx.recurring
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900" // Very light blue with hover effect for recurring
                          : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 hover:text-cyan-900" // Very light cyan with hover effect for non-recurring
                      }`}
                    >
                      {tx.recurring ? (
                        <>
                          <TimerReset className="text-blue-700" size={18} />
                          {tx.frequency.toUpperCase()}
                        </>
                      ) : (
                        <>
                          <Timer className="text-cyan-700" size={18} />
                          One-Time
                        </>
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell className="">
                    <span
                      className={`px-2 inline-flex gap-1 text-xs leading-5 font-semibold rounded-full ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <CircleCheck size={20} />
                      {tx.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}

          <table className="w-full border-collapse text-base rounded-3xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white uppercase">
              <tr>
                <th className="py-4 px-6 font-bold text-left">Name</th>
                <th className="py-4 px-6 font-bold text-left hidden md:table-cell">
                  Description
                </th>
                <th className="py-4 px-6 font-bold text-left">Date</th>
                <th className="py-4 px-6 font-bold text-left">Category</th>
                <th className="py-4 px-6 font-bold text-right">Amount</th>
                <th className="py-4 px-6 font-bold text-left">Recurring</th>
                <th className="py-4 px-6 font-bold text-left">Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredTransactions.map((tx, index) => {
                const category =
                  tx.type === "Income"
                    ? incomeCategories.find((c) => c.id === tx.category)
                    : expenseCategories.find((c) => c.id === tx.category);

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-gradient-to-br hover:from-blue-200 hover:via-blue-100 hover:to-indigo-200 transition-all duration-300 even:bg-blue-50"
                  >
                    {/* Name Column */}
                    <td className="py-4 px-6 font-medium text-gray-700 flex gap-2 items-center">
                      INV001
                      {tx.type === "Income" ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold hover:bg-green-200">
                          Income
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold hover:bg-red-200">
                          Expense
                        </span>
                      )}
                    </td>

                    {/* Description Column */}
                    <td className="py-4 px-6 hidden md:table-cell text-gray-600">
                      {tx.desc && tx.desc.length > 10 ? (
                        <div>
                          <span>
                            {expandedIndex === index
                              ? tx.desc
                              : `${tx.desc.substring(0, 10)}...`}
                          </span>
                          <button
                            onClick={() => toggleDescription(index)}
                            className="ml-2 text-blue-600 hover:underline text-sm"
                          >
                            {expandedIndex === index
                              ? "Show Less"
                              : "Show More"}
                          </button>
                        </div>
                      ) : (
                        tx.desc || "No description"
                      )}
                    </td>

                    {/* Date Column */}
                    <td className="py-4 px-6 text-gray-600">
                      {format(tx.date, "PPP")}
                    </td>

                    {/* Category Column */}
                    <td className="py-4 px-6">
                      {category && (
                        <span
                          className="inline-flex px-3 py-1 rounded-full text-xs font-semibold items-center gap-2"
                          style={{
                            background: `linear-gradient(90deg, ${category.color} 0%, ${category.color} 100%)`,
                            color: category.textColor || "white",
                          }}
                        >
                          {category.icon && <category.icon size={16} />}
                          {category.name}
                        </span>
                      )}
                    </td>

                    {/* Amount Column */}
                    <td
                      className={`py-4 px-6 text-right font-medium ${
                        tx.amount > 0 ? "text-green-600" : "text-red-600"
                      } flex gap-1 items-center`}
                    >
                      {tx.amount > 0 ? <TrendingUp /> : <TrendingDown />}
                      {tx.amount}
                    </td>

                    {/* Recurring Column */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tx.recurring
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                        }`}
                      >
                        {tx.recurring ? (
                          <>
                            <TimerReset size={16} />
                            {tx.frequency.toUpperCase()}
                          </>
                        ) : (
                          <>
                            <Timer size={16} />
                            One-Time
                          </>
                        )}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <CircleCheck size={16} />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && transactions.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found for the selected filters.
            </div>
          )}

          {filteredTransactions.length === 0 && transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found.
            </div>
          )}
        </div>

        <div className="block md:hidden">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis
          culpa quos eveniet, officia nostrum, voluptate dolores nemo amet
          maxime voluptatibus reiciendis similique error blanditiis soluta natus
          vitae hic? Rerum temporibus at enim cum?
        </div>
      </div>
    </div>
  );
}
