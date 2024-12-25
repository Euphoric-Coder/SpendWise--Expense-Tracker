"use client";

import React, { useState } from "react";
import { Trash, Edit } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CsvDataTable = ({ csvData = [], setCsvData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({
    name: "",
    amount: "",
    date: "",
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

  return (
    <div className="mt-6">
      <div className="flex justify-end mb-4">
        {csvData.length > 0 && (
          <Button
            onClick={addAllToExpense}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-blue-600 transition-transform transform hover:scale-105"
          >
            Add All to Expense
          </Button>
        )}
      </div>
      <div className="overflow-y-auto max-h-[400px] scroll">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-yellow-100">
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Amount</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData?.length > 0 ? (
              csvData.map((row, index) => (
                <TableRow key={index} className="hover:bg-yellow-100">
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.date}</TableCell>
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
                              setEditedRow({ ...editedRow, name: e.target.value })
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
                            type="date"
                            value={editedRow.date}
                            onChange={(e) =>
                              setEditedRow({ ...editedRow, date: e.target.value })
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
                    <Button
                      onClick={() => addToExpense(index)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-3 py-1 rounded-md shadow hover:from-orange-600 hover:to-red-600 transition-transform transform hover:scale-105"
                    >
                      Add to Expense
                    </Button>
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
