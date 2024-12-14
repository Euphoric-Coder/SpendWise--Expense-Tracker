import React, { useState, useRef, useCallback } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { processCsv } from "@/utils/csvParser";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CsvUpload = ({ onFileSelect }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidFile, setIsValidFile] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const fileInputRef = useRef(null); // Reference for the file input element

  // Reset the state and file input
  const resetState = () => {
    setCsvFile(null);
    setIsValidFile(false);
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
        toast.success("CSV file processed successfully!");
      } catch (error) {
        resetState(); // Reset state after error
        toast.error(error);
      }
    } else {
      toast.error("Please upload a valid CSV file.");
    }
  };

  if (isValidFile) {
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
          <Button
            onClick={resetState}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-md shadow hover:from-red-600 hover:to-yellow-600 transition-all"
          >
            Reupload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Label
        htmlFor="csv-upload"
        className="absolute left-6 text-lg font-semibold text-blue-100 bg-gradient-to-r from-orange-500 via-red-400 to-yellow-500 px-3 py-1 rounded-full shadow-md transform -translate-y-12 -translate-x-1/5 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105"
      >
        Upload CSV
      </Label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-xl cursor-pointer transition-all ${
          isDragging
            ? "border-orange-600 bg-gradient-to-br from-yellow-100 to-red-200"
            : "border-orange-300 bg-gradient-to-br from-yellow-50 to-red-100"
        } shadow-md hover:shadow-lg`}
      >
        <FiUploadCloud className="text-orange-600 text-6xl mb-4" />
        <div className="text-center">
          {csvFile ? (
            <p className="text-base font-semibold text-orange-900">
              {csvFile.name}{" "}
              <span className="text-green-600 font-semibold">(Selected)</span>
            </p>
          ) : (
            <p className="text-yellow-800 text-lg font-semibold">
              Drag & Drop your CSV file here
              <br />
              (.csv only)
            </p>
          )}
          <p className="text-md text-orange-500 mt-1">
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
