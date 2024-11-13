"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import { Expenses, Incomes } from "@/utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const DeleteIncome = () => {
  const [incomelist, setIncomelist] = useState([]);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [isCheckboxChecked, setCheckboxChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();
  const route = useRouter();

  useEffect(() => {
    user && getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    const result = await db
      .select({
        ...getTableColumns(Incomes),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Incomes)
      .leftJoin(Expenses, eq(Incomes.id, Expenses.budgetId))
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));
    setIncomelist(result);
  };

  const handleDeleteClick = (income) => {
    setSelectedIncome(income);
  };

  // reload the browser when dialog is closed
  const handleDialogClose = (isOpen) => {
    setDialogOpen(isOpen);
    if(isOpen === false) {
      location.reload()
    }
  };

  const confirmDelete = async () => {
    if (isCheckboxChecked && selectedIncome) {
      const incomeName = selectedIncome.name
      await db.delete(Incomes).where(eq(Incomes.id, selectedIncome.id));
      setCheckboxChecked(false);
      toast.success(`Income "${incomeName}" Deleted Successfuly`);
    }
    getIncomelist()
  };

  return (
    <div className="flex gap-2 items-center">
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="flex gap-2">
            <Trash2 />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="mt-5 p-1 flex items-center justify-between">
              <DialogTitle>Select Incomes to Delete</DialogTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => getIncomelist()}
                      variant="outline"
                      className="w-[10%]"
                    >
                      <RefreshCw />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogHeader>
          <ScrollArea className="h-72 w-auto border rounded-lg p-4">
            {incomelist.map((income) => (
              <>
                <div
                  key={income.id}
                  className="flex items-center justify-between mb-4 mt-2"
                >
                  <h3>
                    {income.name} - ${income.amount}
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteClick(income)}
                      >
                        <Trash2 /> Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this income?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="my-4">
                        <p>
                          Income: <strong>{selectedIncome?.name}</strong> of
                          amount ${selectedIncome?.amount}
                        </p>
                      </div>
                      <DialogFooter>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex gap-2">
                            <Checkbox
                              id="confirm-checkbox"
                              checked={isCheckboxChecked}
                              onCheckedChange={(checked) =>
                                setCheckboxChecked(checked)
                              }
                              className="text-red-500 bg-white border-red-500 data-[state=checked]:bg-red-500 focus:ring-red-500"
                            />
                            <label
                              htmlFor="confirm-checkbox"
                              className="text-sm font-medium text-red-600 leading-none cursor-pointer transition duration-150 hover:text-red-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              I Understand & Accept T&C
                            </label>
                          </div>
                          <Button
                            onClick={confirmDelete}
                            disabled={!isCheckboxChecked}
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Separator className='my-2'/>
              </>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Button
        variant="outline"
        onClick={() => {
          location.reload();
        }}
      >
        <RefreshCw />
      </Button>
    </div>
  );
};

export default DeleteIncome;
