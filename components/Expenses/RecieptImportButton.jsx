"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Shadcn UI Checkbox
import { db } from "@/utils/dbConfig"; // Assume dbConfig is set up for your database
import { Settings } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ScanText } from "lucide-react";
import CsvDataTable from "./CsvDataTable";
import RecieptUpload from "./RecieptUpload";
import RecieptDataTable from "./RecieptDataTable";

const RecieptImportButton = () => {
  const { v4: uuidv4 } = require("uuid");
  const [showTutorialDialog, setShowTutorialDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentTutorialPage, setCurrentTutorialPage] = useState(0);
  const [showRecieptImport, setShowRecieptImport] = useState(true); // Default to true
  const [recieptData, setRecieptData] = useState([]);
  const [reuploadReset, setReuploadReset] = useState(false)
  const { user } = useUser();

  const progressColors = [
    "bg-gradient-to-r from-yellow-400 to-orange-400",
    "bg-gradient-to-r from-orange-500 to-red-500",
    "bg-gradient-to-r from-red-600 to-yellow-600",
  ];

  const tutorialPages = [
    {
      title: "Step 1: Capture a Clear Image",
      content: (
        <div className="text-center">
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-500 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400">
            Start by taking a clear photo of your receipt.
          </p>
          <ul className="mt-6 space-y-4 text-left">
            <li className="flex items-start">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-600 via-teal-500 to-indigo-500 rounded-full mt-1 mr-3 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"></span>
              <span className="text-lg text-gray-800 dark:text-gray-300">
                Ensure good lighting and avoid shadows over the receipt.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-600 via-teal-500 to-indigo-500 rounded-full mt-1 mr-3 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"></span>
              <span className="text-lg text-gray-800 dark:text-gray-300">
                The text on the receipt should be legible without any blur.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-600 via-teal-500 to-indigo-500 rounded-full mt-1 mr-3 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"></span>
              <span className="text-lg text-gray-800 dark:text-gray-300">
                If the receipt is long, capture multiple overlapping images.
              </span>
            </li>
          </ul>
          <p className="mt-6 text-gray-500 dark:text-gray-400">
            A clear image ensures accurate extraction of receipt details.
          </p>
        </div>
      ),
      image: "/images/capture-receipt.png",
    },
    {
      title: "Step 2: Upload Your Receipt",
      content: (
        <div className="text-center">
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-500 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400">
            Upload your receipt image to the AI Receipt Scanner.
          </p>
          <ul className="mt-6 space-y-4 text-left">
            <li className="flex items-start">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-600 via-teal-500 to-indigo-500 rounded-full mt-1 mr-3 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"></span>
              <span className="text-lg text-gray-800 dark:text-gray-300">
                Drag and drop the image into the upload area or click the{" "}
                <strong className="text-blue-500 dark:text-blue-300">
                  Upload
                </strong>{" "}
                button to select the file.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-600 via-teal-500 to-indigo-500 rounded-full mt-1 mr-3 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"></span>
              <span className="text-lg text-gray-800 dark:text-gray-300">
                Supported formats include{" "}
                <code className="font-mono px-1 py-0.5 bg-gray-200 rounded dark:bg-gray-700">
                  .jpg
                </code>
                ,{" "}
                <code className="font-mono px-1 py-0.5 bg-gray-200 rounded dark:bg-gray-700">
                  .png
                </code>
                , and{" "}
                <code className="font-mono px-1 py-0.5 bg-gray-200 rounded dark:bg-gray-700">
                  .jpeg
                </code>
                .
              </span>
            </li>
          </ul>
          <p className="mt-6 text-gray-500 dark:text-gray-400">
            The image will be analyzed, and key details like date, vendor, and
            amount will be extracted.
          </p>
        </div>
      ),
      image: "/images/upload-receipt.png",
    },
    {
      title: "Step 3: Review Extracted Data",
      content: (
        <div className="text-center">
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-500 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400">
            Verify and edit the extracted data.
          </p>
          <ul className="mt-6 space-y-4 text-left">
            <li className="flex items-start">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-600 via-teal-500 to-indigo-500 rounded-full mt-1 mr-3 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"></span>
              <span className="text-lg text-gray-800 dark:text-gray-300">
                Check if the date, vendor, and amount details are correct.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-600 via-teal-500 to-indigo-500 rounded-full mt-1 mr-3 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"></span>
              <span className="text-lg text-gray-800 dark:text-gray-300">
                You can make edits if any data is incorrectly extracted.
              </span>
            </li>
          </ul>
          <p className="mt-6 text-gray-500 dark:text-gray-400">
            Accurate data ensures seamless expense management.
          </p>
        </div>
      ),
      image: "/images/review-data.png",
    },
    {
      title: "Step 4: Save and Continue",
      content: (
        <div className="text-center">
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-500 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400">
            Save the extracted data to your records.
          </p>
          <ul className="mt-6 space-y-4 text-left">
            <li className="flex items-start">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-600 via-teal-500 to-indigo-500 rounded-full mt-1 mr-3 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"></span>
              <span className="text-lg text-gray-800 dark:text-gray-300">
                Once verified, click the{" "}
                <strong className="text-blue-500 dark:text-blue-300">
                  Save
                </strong>{" "}
                button to store the data.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-600 via-teal-500 to-indigo-500 rounded-full mt-1 mr-3 dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"></span>
              <span className="text-lg text-gray-800 dark:text-gray-300">
                Your receipt details will now be part of your expense history.
              </span>
            </li>
          </ul>
          <p className="mt-6 text-gray-500 dark:text-gray-400">
            You can add more receipts or view your expense summary anytime.
          </p>
        </div>
      ),
      image: "/images/save-data.png",
    },
  ];



  useEffect(() => {
    const fetchOrCreateSettings = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const result = await db
        .select()
        .from(Settings)
        .where(eq(Settings.createdBy, user.primaryEmailAddress.emailAddress));

      if (result.length === 0) {
        // If no entry exists, insert a new one with default `showrecieptimport` value
        await db.insert(Settings).values({
          id: uuidv4(),
          createdBy: user.primaryEmailAddress.emailAddress,
        });
        setShowRecieptImport(true); // Set the state to match the default value
      } else {
        // If entry exists, set `showRecieptImport` based on the fetched value
        setShowRecieptImport(result[0].showrecieptimport);
      }
    };

    fetchOrCreateSettings();
  }, [user]);

  const handleNextPage = () => {
    if (currentTutorialPage < tutorialPages.length - 1) {
      setCurrentTutorialPage((prev) => prev + 1);
    } else {
      setShowTutorialDialog(false);
      setShowUploadDialog(true);
      setCurrentTutorialPage(0);
    }
  };

  const handleSkipTutorial = async () => {
    setShowTutorialDialog(false);
    setShowUploadDialog(true);
  };

  const handleCheckboxChange = async (checked) => {
    const newShowRecieptImportValue = !checked; // Checkbox indicates "Don't show tutorial"

    setShowRecieptImport(newShowRecieptImportValue);

    // Update the `showrecieptimport` value in the database
    const result = await db
      .select()
      .from(Settings)
      .where(eq(Settings.createdBy, user?.primaryEmailAddress?.emailAddress));

    if (result.length === 0) {
      // Insert a new entry if none exists
      await db.insert(Settings).values({
        id: uuidv4(),
        createdBy: user?.primaryEmailAddress?.emailAddress,
        showrecieptimport: newShowRecieptImportValue,
      });
    } else {
      // Update the existing entry
      await db
        .update(Settings)
        .set({ showrecieptimport: newShowRecieptImportValue })
        .where(eq(Settings.createdBy, user?.primaryEmailAddress?.emailAddress));
    }
  };

  const handleImportClick = () => {
    if (showRecieptImport) {
      setShowTutorialDialog(true);
    } else {
      setShowUploadDialog(true);
    }
  };

  // Reset progress when the tutorial dialog closes
  const handleTutorialDialogClose = (isOpen) => {
    if (!isOpen) {
      setCurrentTutorialPage(0);
    }
    setShowTutorialDialog(isOpen);
  };

  const handleFileSelect = (data) => {
    setRecieptData(data); // Populate table with CSV data
    console.log(recieptData);
  };

  return (
    <div>
      <Button
        className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 dark:from-blue-500 dark:via-purple-600 dark:to-pink-500 rounded-xl shadow-xl hover:from-blue-500 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-transform transform hover:scale-110 hover:backdrop-brightness-125 dark:hover:backdrop-brightness-110"
        onClick={handleImportClick}
      >
        <ScanText className="mr-1 w-9 h-9" /> Import Reciept
      </Button>

      {/* Tutorial Dialog */}
      <Dialog
        open={showTutorialDialog}
        onOpenChange={handleTutorialDialogClose}
      >
        <DialogContent
          className="fixed rounded-3xl bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6 shadow-2xl overflow-hidden"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "1400px",
          }}
        >
          {/* Tutorial Header */}
          <h2 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-400 animate-gradient-text mb-4">
            {tutorialPages[currentTutorialPage].title}
          </h2>
          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400`}
              style={{
                width: `${
                  ((currentTutorialPage + 1) / tutorialPages.length) * 100
                }%`,
              }}
            ></div>
          </div>
          {tutorialPages[currentTutorialPage].image && (
            <img
              src={tutorialPages[currentTutorialPage].image}
              alt="Tutorial Step"
              className="w-full h-auto rounded-2xl mb-4 shadow-lg hover:scale-105 transition-transform duration-500"
            />
          )}
          <p className="text-gray-700 dark:text-gray-400">
            {tutorialPages[currentTutorialPage].content}
          </p>
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Button
              disabled={currentTutorialPage === 0}
              className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-indigo-400 to-blue-500 dark:from-blue-500 dark:to-indigo-500 rounded-lg shadow hover:from-indigo-500 hover:to-blue-600"
              onClick={() => setCurrentTutorialPage((prev) => prev - 1)}
            >
              Back
            </Button>
            <Button
              className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-purple-400 to-indigo-500 dark:from-purple-500 dark:to-indigo-600 rounded-lg shadow hover:from-purple-500 hover:to-indigo-600"
              onClick={handleNextPage}
            >
              {currentTutorialPage < tutorialPages.length - 1
                ? "Next"
                : "Continue"}
            </Button>
          </div>
          {/* Checkbox */}
          <div className="mt-4 flex items-center">
            <Checkbox
              id="show-tutorial"
              checked={!showRecieptImport} // Checkbox indicates "Don't show tutorial"
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="show-tutorial"
              className="ml-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Don't show this tutorial again
            </label>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={showUploadDialog}
        onOpenChange={() => {
          setShowUploadDialog(false);
          setRecieptData([]);
        }}
      >
        <DialogContent
          className="rounded-3xl bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 max-w-4xl dark:via-gray-800 dark:to-gray-700 p-6 shadow-2xl overflow-auto"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
          }}
        >
          <h2 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-400 animate-gradient-text mb-4">
            Upload Your Expense CSV
          </h2>
          <RecieptUpload
            onFileSelect={handleFileSelect}
            reuploadReset={reuploadReset}
            setReuploadReset={setReuploadReset}
            setRecieptData={setRecieptData}
          />
          {recieptData?.length > 0 && (
            <RecieptDataTable
              recieptData={recieptData}
              setRecieptData={setRecieptData}
            />
          )}
          {/* {recieptData?.length > 0 && (
            <div>
              {recieptData?.map((reciept, index) => (
                <div>
                  {reciept.name}
                  <br />
                  {reciept.amount}
                  <br />
                  {reciept.description}
                  <br />
                  {reciept.createdAt}
                  <br />
                </div>
              ))}
            </div>
          )} */}
          <DialogClose asChild>
            <Button
              className="mt-4 px-4 py-2 font-semibold text-white bg-gradient-to-r from-purple-400 to-indigo-500 dark:from-purple-500 dark:to-indigo-600 rounded-lg shadow hover:from-purple-500 hover:to-indigo-600"
              onClick={() => setShowUploadDialog(false)}
            >
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecieptImportButton;
