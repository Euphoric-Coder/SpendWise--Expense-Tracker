"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Incomes, Transactions } from "@/utils/schema";
import { Trash } from "lucide-react";

const DeleteIncome = ({ incomeData, refreshData }) => {
  const [selectedIncomes, setSelectedIncomes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleCheckboxChange = (incomeId) => {
    setSelectedIncomes((prev) =>
      prev.includes(incomeId)
        ? prev.filter((id) => id !== incomeId)
        : [...prev, incomeId]
    );
  };

  const confirmDelete = async () => {
    try {
      const deletedIncomeNames = [];

      for (const incomeId of selectedIncomes) {
        const income = incomeData.find((item) => item.id === incomeId);
        await db.delete(Transactions).where(eq(Transactions.referenceId, income.id)).returning();
        await db.delete(Incomes).where(eq(Incomes.id, income.id)).returning();
        deletedIncomeNames.push(income?.name);
      }

      setSelectedIncomes([]);
      setIsAlertOpen(false);
      setIsDialogOpen(false); // Close the main dialog
      refreshData();

      toast.success(
        `The following incomes were deleted successfully: ${deletedIncomeNames.join(
          ", "
        )}`
      );
    } catch (error) {
      toast.error("Failed to delete selected incomes");
    }
  };

  const selectedIncomeNames = selectedIncomes
    .map(
      (incomeId) => incomeData.find((income) => income.id === incomeId)?.name
    )
    .filter(Boolean);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-transform dark:from-red-700 dark:via-red-800 dark:to-red-900">
            <Trash className="w-7 h-7" />
            Delete Incomes
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl bg-gradient-to-b from-white via-cyan-50 to-blue-50 p-6 shadow-[0_0_40px_rgba(0,200,255,0.3)] dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-blue-400 via-cyan-400 to-transparent opacity-20 blur-3xl animate-spin-slow"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-cyan-300 via-blue-300 to-transparent opacity-30 blur-[120px]"></div>
          </div>

          {/* Dialog Header */}
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-400">
              Select Incomes to Delete
            </DialogTitle>
          </DialogHeader>

          {/* Income Selection */}
          <div className="space-y-4">
            {incomeData.map((income) => (
              <div
                key={income.id}
                className="flex items-center gap-4 bg-gradient-to-r from-cyan-100 via-blue-50 to-indigo-100 p-4 rounded-lg shadow-sm dark:from-blue-800 dark:via-indigo-800 dark:to-blue-900"
              >
                <Checkbox
                  checked={selectedIncomes.includes(income.id)}
                  onCheckedChange={() => handleCheckboxChange(income.id)}
                  className="text-cyan-500 dark:text-blue-400"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {income.name} - ${income.amount}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Section */}
          <DialogFooter>
            <Button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-medium shadow-sm hover:shadow-md hover:scale-105 transition-transform dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 dark:text-gray-200"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={selectedIncomes.length === 0}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed dark:from-blue-700 dark:via-indigo-700 dark:to-blue-800"
                  onClick={() => setIsAlertOpen(true)}
                >
                  Delete Selected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl bg-gradient-to-b from-white via-cyan-50 to-blue-50 p-6 shadow-[0_0_40px_rgba(0,200,255,0.3)] dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
                {/* Alert Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-radial from-blue-400 via-cyan-400 to-transparent opacity-20 blur-3xl"></div>
                  <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-radial from-cyan-300 via-blue-300 to-transparent opacity-30 blur-[120px]"></div>
                </div>

                {/* Alert Header */}
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-400">
                    Are you sure you want to delete the following incomes?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="mt-2 space-y-1">
                  {selectedIncomeNames.map((name, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      {name}
                    </div>
                  ))}
                </div>
                {/* Alert Footer */}
                <AlertDialogFooter>
                  <Button
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-medium shadow-sm hover:shadow-md hover:scale-105 transition-transform dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 dark:text-gray-200"
                    onClick={() => setIsAlertOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-transform dark:from-red-700 dark:via-red-800 dark:to-red-900"
                    onClick={confirmDelete}
                  >
                    Confirm Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteIncome;
