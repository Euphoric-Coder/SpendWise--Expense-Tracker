"use client";

import React, { useState } from "react";
import { Trash, Edit, ListPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RecieptDataTable = ({ recieptData = [], setRecieptData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({
    name: "",
    amount: "",
    description: "",
    createdAt: "",
  });

  const deleteRow = (index) => {
    const updatedData = recieptData.filter((_, i) => i !== index);
    setRecieptData(updatedData);
    toast(`Row ${index + 1} has been deleted!`);
  };

  const startEditing = (row, index) => {
    setEditingRowIndex(index);
    setEditedRow({ ...row });
    setIsDialogOpen(true);
  };

  const saveEditedRow = () => {
    const updatedData = recieptData.map((row, index) =>
      index === editingRowIndex ? editedRow : row
    );
    setRecieptData(updatedData);
    toast(`Row ${editingRowIndex + 1} has been updated!`);
    setIsDialogOpen(false);
    setEditingRowIndex(null);
  };

  const addToExpense = (index) => {
    console.log(recieptData[index]);
    const updatedData = recieptData.filter((_, i) => i !== index);
    setRecieptData(updatedData);
    toast.success(`Row ${index + 1} added to expense successfully!`);
  };

  const addAllToExpense = () => {
    console.log(recieptData);
    setRecieptData([]); // Clear all data from the table
    toast.success("All rows added to expense successfully!");
  };

  return (
    <div className="mt-6">
      <div className="flex justify-end mb-4">
        {recieptData.length > 0 && (
          <Button
            onClick={addAllToExpense}
            className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 dark:from-blue-500 dark:via-purple-600 dark:to-pink-500 rounded-lg shadow-xl hover:from-blue-500 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-transform transform hover:scale-110 hover:backdrop-brightness-125 dark:hover:backdrop-brightness-110"
          >
            Add All to Expense
          </Button>
        )}
      </div>
      <div className="overflow-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-blue-100 dark:hover:bg-blue-950">
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Amount</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recieptData?.length > 0 ? (
              recieptData.map((row, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-blue-100 dark:hover:bg-blue-950"
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Edit
                          className="text-blue-600 cursor-pointer mr-2 hover:text-purple-800 hover:scale-110 active:scale-90 transition-all duration-500"
                          onClick={() => startEditing(row, index)}
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Row</DialogTitle>
                          <DialogDescription>
                            Update the details for this row.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 mt-4">
                          <input
                            type="text"
                            value={editedRow.name}
                            onChange={(e) =>
                              setEditedRow({
                                ...editedRow,
                                name: e.target.value,
                              })
                            }
                            placeholder="Name"
                            className="border p-2 rounded-md"
                          />
                          <input
                            type="number"
                            value={editedRow.amount}
                            onChange={(e) =>
                              setEditedRow({
                                ...editedRow,
                                amount: e.target.value,
                              })
                            }
                            placeholder="Amount"
                            className="border p-2 rounded-md"
                          />
                          <input
                            type="text"
                            value={editedRow.description}
                            onChange={(e) =>
                              setEditedRow({
                                ...editedRow,
                                description: e.target.value,
                              })
                            }
                            placeholder="Description"
                            className="border p-2 rounded-md"
                          />
                          <input
                            type="date"
                            value={editedRow.createdAt}
                            onChange={(e) =>
                              setEditedRow({
                                ...editedRow,
                                createdAt: e.target.value,
                              })
                            }
                            placeholder="Date"
                            className="border p-2 rounded-md"
                          />
                          <button
                            onClick={saveEditedRow}
                            className="bg-blue-500 text-white p-2 rounded-md"
                          >
                            Save
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <span className="text-gray-400">|</span>
                    <Trash
                      className="text-red-600 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-500"
                      onClick={() => deleteRow(index)}
                    />
                    <span className="text-gray-400">|</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <ListPlus
                            onClick={() => addToExpense(index)}
                            size={30}
                            className="text-blue-600 cursor-pointer hover:text-indigo-600 hover:scale-110 active:scale-90 transition-transform duration-500"
                          />
                        </TooltipTrigger>
                        <TooltipContent className="rounded-full font-bold z-20">
                          <p>Add to Expenses</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* <Button
                      onClick={() => addToExpense(index)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-3 py-1 rounded-md shadow hover:from-orange-600 hover:to-red-600 transition-transform transform hover:scale-105"
                    >
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="4" className="text-center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecieptDataTable;
