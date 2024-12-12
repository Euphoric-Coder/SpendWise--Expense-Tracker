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
    setIsDialogOpen(true); // Open the dialog when editing starts
  };

  const saveEditedRow = () => {
    const updatedData = csvData.map((row, index) =>
      index === editingRowIndex ? editedRow : row
    );
    setCsvData(updatedData);
    toast(`Row ${editingRowIndex + 1} has been updated!`);
    setIsDialogOpen(false); // Close the dialog after saving
    setEditingRowIndex(null); // Reset editing state
  };

  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-yellow-100">
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Amount</TableHead>
            <TableHead className="font-bold">Date</TableHead>
            <TableHead className="font-bold">Action (Edit/Delete)</TableHead>
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
  );
};

export default CsvDataTable;
