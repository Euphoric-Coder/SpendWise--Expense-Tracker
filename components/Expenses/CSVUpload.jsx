import React, { useState, useRef, useCallback } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { processCsv } from "@/utils/csvParser";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CsvUpload = ({
  onFileSelect,
  reuploadReset,
  setReuploadReset,
  setCsvData,
}) => {
  const [csvFile, setCsvFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidFile, setIsValidFile] = useState(false);

  const fileInputRef = useRef(null); // Reference for the file input element

  // Reset the state and file input
  const resetState = () => {
    setCsvFile(null);
    setIsValidFile(false);
    setReuploadReset(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleDrop = useCallback(
    async (event) => {
      event.preventDefault();
      setIsDragging(false);

      const file = event.dataTransfer.files[0];
      if (file && file.type === "text/csv") {
        resetState(); // Reset the state before processing
        try {
          const expenses = await processCsv(file);
          setCsvFile(file);
          setIsValidFile(true);
          onFileSelect(expenses);
          toast.success("CSV file processed successfully!");
        } catch (error) {
          resetState(); // Reset state after error
          toast.error(error);
        }
      } else {
        toast.error("Please upload a valid CSV file.");
      }
    },
    [onFileSelect]
  );

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      resetState(); // Reset the state before processing
      try {
        const expenses = await processCsv(file);
        setCsvFile(file);
        setIsValidFile(true);
        onFileSelect(expenses);
        toast.success(`CSV file "${file.name}" processed successfully!`);
      } catch (error) {
        resetState(); // Reset state after error
        toast.error(error);
      }
    } else {
      toast.error("Please upload a valid CSV file.");
    }
  };

  const resetData = () => {
    setReuploadReset(true);
    resetState();
    setCsvData([]);
    toast.success("All Data has been reset successfully!");
  };

  if (isValidFile && reuploadReset !== true) {
    // Reduced View with File Info and Reupload Button
    return (
      <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-800 font-medium">
              <strong>Uploaded File:</strong> {csvFile.name}
            </p>
            <p className="text-sm text-gray-500">
              File size: {(csvFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={resetState}
              className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 dark:from-blue-500 dark:via-purple-600 dark:to-pink-500 rounded-xl shadow-xl hover:from-blue-500 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-transform transform hover:scale-110 hover:backdrop-brightness-125 dark:hover:backdrop-brightness-110"
            >
              Reupload
            </Button>
            <Button
              onClick={resetData}
              className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 dark:from-blue-500 dark:via-purple-600 dark:to-pink-500 rounded-xl shadow-xl hover:from-blue-500 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-transform transform hover:scale-110 hover:backdrop-brightness-125 dark:hover:backdrop-brightness-110"
            >
              Reset Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Label
        htmlFor="csv-upload"
        className="absolute left-6 text-lg font-semibold text-blue-100 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 px-3 py-1 rounded-full shadow-md transform -translate-y-12 -translate-x-1/5 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105"
      >
        Upload CSV
      </Label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-xl cursor-pointer transition-all ${
          isDragging
            ? "border-blue-600 bg-gradient-to-br from-cyan-100 to-indigo-200 dark:border-blue-500 dark:from-gray-700 dark:to-gray-800"
            : "border-blue-300 bg-gradient-to-br from-cyan-50 to-indigo-100 dark:border-gray-600 dark:from-gray-800 dark:to-gray-900"
        } shadow-md hover:shadow-lg hover:shadow-slate-600`}
      >
        <FiUploadCloud className="text-blue-600 dark:text-blue-400 text-6xl mb-4" />
        <div className="text-center">
          <p className="text-blue-800 dark:text-blue-300 text-lg font-semibold">
            Drag & Drop your Image file here
            <br />
            (.csv only)
          </p>
          <p className="text-md text-indigo-500 dark:text-indigo-400 mt-1">
            or click to browse files
          </p>
        </div>

        <Label
          htmlFor="csv-upload"
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <Input
          ref={fileInputRef} // Attach the reference
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
      </div>
    </div>
  );
};

export default CsvUpload;
