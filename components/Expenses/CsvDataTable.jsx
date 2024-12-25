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

const CsvDataTable = ({ csvData = [], setCsvData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({
    name: "",
    amount: "",
    date: "",
    description: "",
  });

  const deleteRow = (index) => {
    const updatedData = csvData.filter((_, i) => i !== index);
    setCsvData(updatedData);
    toast(`Row ${index + 1} has been deleted!`);
  };

  const startEditing = (row, index) => {
    setEditingRowIndex(index);
    setEditedRow({ ...row });
    setIsDialogOpen(true);
  };

  const saveEditedRow = () => {
    const updatedData = csvData.map((row, index) =>
      index === editingRowIndex ? editedRow : row
    );
    setCsvData(updatedData);
    toast(`Row ${editingRowIndex + 1} has been updated!`);
    setIsDialogOpen(false);
    setEditingRowIndex(null);
  };

  const addToExpense = (index) => {
    console.log(csvData[index]);
    const updatedData = csvData.filter((_, i) => i !== index);
    setCsvData(updatedData);
    toast.success(`Row ${index + 1} added to expense successfully!`);
  };

  const addAllToExpense = () => {
    console.log(csvData);
    setCsvData([]); // Clear all data from the table
    toast.success("All rows added to expense successfully!");
  };

  const clearAllData = () => {
    setCsvData([]); // Clear all data from the table
    toast.success("All data cleared successfully!");
  };

  return (
    <div className="mt-6">
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-500">
            CSV Data Table
          </h1>
          <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
            ({" "}
            {csvData.length > 0
              ? `${csvData.length} items available`
              : "No items available"}{" "}
            )
          </span>
        </div>
        {csvData.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              onClick={addAllToExpense}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-blue-600 dark:bg-gradient-to-r dark:from-green-400 dark:to-blue-400 dark:hover:from-green-500 dark:hover:to-blue-500 transition-transform transform hover:scale-105 dark:shadow-md dark:hover:shadow-lg"
            >
              Add All to Expense
            </Button>
            <Button
              onClick={clearAllData}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-blue-600 dark:bg-gradient-to-r dark:from-green-400 dark:to-blue-400 dark:hover:from-green-500 dark:hover:to-blue-500 transition-transform transform hover:scale-105 dark:shadow-md dark:hover:shadow-lg"
            >
              Clear Data
            </Button>
          </div>
        )}
      </div>
      <div className="overflow-y-auto max-h-[400px] scroll">
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
            {csvData?.length > 0 ? (
              csvData.map((row, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-blue-100 dark:hover:bg-blue-950"
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Edit
                                className="text-blue-600 cursor-pointer mr-2 hover:text-purple-800 hover:scale-110 active:scale-90 transition-all duration-500"
                                onClick={() => startEditing(row, index)}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="rounded-full font-bold">
                              <p>Edit the Data</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </DialogTrigger>
                      <DialogContent className="border-2 border-blue-200 p-8 bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl overflow-auto z-50">
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
                            value={editedRow.date}
                            onChange={(e) =>
                              setEditedRow({
                                ...editedRow,
                                date: e.target.value,
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Trash
                            className="text-red-600 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-500"
                            onClick={() => deleteRow(index)}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="rounded-full font-bold z-20">
                          <p>Delete Data</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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

export default CsvDataTable;
