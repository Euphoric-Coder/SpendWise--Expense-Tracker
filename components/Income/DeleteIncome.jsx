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
import { Incomes } from "@/utils/schema";

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
          <Button variant="destructive">Delete Incomes</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Incomes to Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {incomeData.map((income) => (
              <div key={income.id} className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedIncomes.includes(income.id)}
                  onCheckedChange={() => handleCheckboxChange(income.id)}
                />
                <span>
                  {income.name} - ${income.amount}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={selectedIncomes.length === 0}
                  onClick={() => setIsAlertOpen(true)}
                >
                  Delete Selected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete the following incomes?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="mt-2 space-y-1">
                  {selectedIncomeNames.map((name, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {name}
                    </div>
                  ))}
                </div>
                <AlertDialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setIsAlertOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDelete}>
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
