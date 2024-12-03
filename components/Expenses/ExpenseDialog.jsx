import React from "react";
import Link from "next/link"; // Import Link for routing
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrencyDashboard } from "@/utils/utilities";
import { Button } from "../ui/button";

const ExpenseDialog = ({ budget, expenses, onClose }) => {
  return (
    <Dialog open={!!budget} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-b from-red-50 via-orange-100 to-yellow-100 text-gray-800 shadow-2xl rounded-3xl border border-orange-300 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 opacity-40 blur-3xl animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-orange-300 via-red-200 to-yellow-200 opacity-30 blur-[100px]"></div>
        </div>

        {/* Dialog Header */}
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500">
            {budget.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 flex justify-between">
            View detailed expenses for this budget.
            <Link href={`/dashboard/expenses/${budget.id}`}>
              <Button className="rounded-3xl text-md bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white px-6 py-3 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform">
                Go to Expense Tab (Budget: {budget.name})
              </Button>
            </Link>
          </DialogDescription>
        </DialogHeader>

        {/* Budget Details */}
        <div className="mt-6 relative z-10">
          <p className="text-lg">
            <span className="font-bold text-orange-600">
              Allocated Budget:
            </span>{" "}
            {formatCurrencyDashboard(budget.amount)}
          </p>
          <p className="text-lg">
            <span className="font-bold text-orange-600">Total Spend:</span>{" "}
            {formatCurrencyDashboard(budget.totalSpend)}
          </p>
          <p className="text-lg">
            <span className="font-bold text-orange-600">Remaining:</span>{" "}
            {formatCurrencyDashboard(budget.amount - budget.totalSpend)}
          </p>
        </div>

        {/* Expense List */}
        <ul className="mt-8 space-y-4 relative z-10">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <li
                key={expense.id}
                className="p-4 rounded-lg bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 flex justify-between items-center shadow-md"
              >
                <div>
                  <p className="font-medium text-gray-800">{expense.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{expense.amount.toLocaleString()} - {expense.createdAt}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No expenses found for this budget.</p>
          )}
        </ul>
        <DialogFooter>
            <button
              className="w-full bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white font-medium py-2 rounded-lg shadow-lg hover:opacity-90 transition transform hover:scale-105"
              onClick={onClose}
            >
              Close
            </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
