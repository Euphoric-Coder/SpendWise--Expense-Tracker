import React, { useState, useRef, useCallback } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { processReciept } from "@/utils/aiRecieptScanner";

const RecieptUpload = ({ onFileSelect }) => {
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidFile, setIsValidFile] = useState(false);

  const fileInputRef = useRef(null); // Reference for the file input element

  // Reset the state and file input
  const resetState = () => {
    setImageFile(null);
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
      if (file && file.type.startsWith("image/")) {
        resetState(); // Reset the state before processing
        try {
          const recieptData = await processReciept(file);
          setImageFile(file);
          setIsValidFile(true);
          onFileSelect(recieptData);
          toast.success("Image file processed successfully!");
        } catch (error) {
          resetState(); // Reset state after error
          toast.error(error);
        }
      } else {
        toast.error("Please upload a valid image file.");
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
    if (file && file.type.startsWith("image/")) {
      resetState(); // Reset the state before processing
      try {
        const recieptData = await processReciept(file);
        setImageFile(file);
        setIsValidFile(true);
        onFileSelect(recieptData);
        toast.success("Image file processed successfully!");
      } catch (error) {
        resetState(); // Reset state after error
        toast.error(error);
      }
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  if (isValidFile) {
    // Reduced View with File Info and Reupload Button
    return (
      <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-800 font-medium">
              <strong>Uploaded File:</strong> {imageFile.name}
            </p>
            <p className="text-sm text-gray-500">
              File size: {(imageFile.size / 1024).toFixed(2)} KB
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
        htmlFor="reciept-upload"
        className="absolute left-6 text-lg font-semibold text-blue-100 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 px-3 py-1 rounded-full shadow-md transform -translate-y-12 -translate-x-1/5 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105"
      >
        Upload Image File
      </Label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-xl cursor-pointer transition-all ${
          isDragging
            ? "border-blue-600 bg-gradient-to-br from-cyan-100 to-indigo-200"
            : "border-blue-300 bg-gradient-to-br from-cyan-50 to-indigo-100"
        } shadow-md hover:shadow-lg`}
      >
        <FiUploadCloud className="text-blue-600 text-6xl mb-4" />
        <div className="text-center">
          {imageFile ? (
            <p className="text-base font-semibold text-blue-900">
              {imageFile.name}{" "}
              <span className="text-green-600 font-semibold">(Selected)</span>
            </p>
          ) : (
            <p className="text-blue-800 text-lg font-semibold">
              Drag & Drop your Image file here
              <br />
              (all image formats accepted)
            </p>
          )}
          <p className="text-md text-indigo-500 mt-1">
            or click to browse files
          </p>
        </div>

        <Label
          htmlFor="reciept-upload"
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <Input
          ref={fileInputRef} // Attach the reference
          type="file"
          accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
          onChange={handleFileChange}
          className="hidden"
          id="reciept-upload"
        />
      </div>
    </div>
  );
};

export default RecieptUpload;
