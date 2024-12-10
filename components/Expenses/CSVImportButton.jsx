"use client";

import React, { useState, useEffect } from "react";
import CsvUpload from "./CSVImportCard";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Shadcn UI Checkbox
import { db } from "@/utils/dbConfig"; // Assume dbConfig is set up for your database
import { Settings } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

const CSVImportButton = () => {
  const [showTutorialDialog, setShowTutorialDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentTutorialPage, setCurrentTutorialPage] = useState(0);
  const [showCSVImport, setShowCSVImport] = useState(true); // Default to true
  const { user } = useUser();

  const progressColors = [
    "bg-gradient-to-r from-yellow-400 to-orange-400",
    "bg-gradient-to-r from-orange-500 to-red-500",
    "bg-gradient-to-r from-red-600 to-yellow-600",
  ];

  const tutorialPages = [
    {
      title: "Step 1: CSV File Format",
      content: (
        <div className="p-6">
          <p className="text-gray-800 text-lg">
            Ensure your CSV file has the following columns in the exact order:
          </p>
          <ul className="list-disc mt-4 space-y-3 text-gray-700">
            <li>
              <span className="font-semibold text-orange-600">Date</span> - The
              date of the expense.
            </li>
            <li>
              <span className="font-semibold text-orange-600">Name</span> - A
              short description of the expense.
            </li>
            <li>
              <span className="font-semibold text-orange-600">Amount</span> -
              The monetary value of the expense.
            </li>
          </ul>
          <p className="mt-6 text-gray-600">
            Each row should represent a single expense record.
          </p>
        </div>
      ),
      image: "/sampleCSV.png", // Replace with your actual image path
    },
    {
      title: "Step 2: Date Format",
      content: (
        <div className="text-center">
          <p className="text-gray-800 text-lg">
            The <span className="font-semibold text-red-600">Date</span> column
            must follow the format:
          </p>
          <p className="mt-4 text-orange-500 font-mono text-2xl">YYYY-MM-DD</p>
          <p className="mt-6 text-gray-700">
            Examples:
            <ul className="list-disc list-inside mt-3 space-y-3">
              <li>
                <code className="text-red-500 font-mono">2024-01-01</code> for
                January 1, 2024.
              </li>
              <li>
                <code className="text-red-500 font-mono">2024-02-15</code> for
                February 15, 2024.
              </li>
            </ul>
          </p>
        </div>
      ),
      image: "/images/date-format.png", // Replace with your actual image path
    },
    {
      title: "Step 3: Example File",
      content: (
        <div className="text-center">
          <p className="text-gray-800 text-lg">
            Here’s an example of how your CSV file should look:
          </p>
          <pre className="mt-6 bg-gradient-to-br from-yellow-50 via-orange-100 to-red-100 p-6 rounded-lg text-sm text-left shadow-lg text-gray-800">
            {`date,name,amount
2024-01-01,Groceries,150
2024-01-02,Transport,50
2024-01-03,Utilities,100`}
          </pre>
          <p className="mt-6 text-gray-600">
            Make sure the file is saved with the extension
            <strong className="text-orange-600"> .csv</strong>.
          </p>
        </div>
      ),
      image: "/images/example-file.png", // Replace with your actual image path
    },
    {
      title: "Step 4: Ready to Upload",
      content: (
        <div className="text-center">
          <p className="text-gray-800 text-lg">
            Once your file is ready, click{" "}
            <span className="font-semibold text-red-500">Next</span> to proceed
            to the upload screen.
          </p>
          <p className="mt-6 text-gray-600">
            Ensure your file is in the correct format before uploading. Invalid
            files may not be processed.
          </p>
        </div>
      ),
      image: "/images/ready-to-upload.png", // Replace with your actual image path
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
        // If no entry exists, insert a new one with default `showcsvimport` value
        await db.insert(Settings).values({
          createdBy: user.primaryEmailAddress.emailAddress,
          showcsvimport: true, // Default to showing the tutorial
        });
        setShowCSVImport(true); // Set the state to match the default value
      } else {
        // If entry exists, set `showCSVImport` based on the fetched value
        setShowCSVImport(result[0].showcsvimport);
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
      setCurrentTutorialPage(0)
    }
  };

  const handleSkipTutorial = async () => {
    setShowTutorialDialog(false);
    setShowUploadDialog(true);
  };

  const handleCheckboxChange = async (checked) => {
    const newShowCSVImportValue = !checked; // Checkbox indicates "Don't show tutorial"

    setShowCSVImport(newShowCSVImportValue);

    // Update the `showcsvimport` value in the database
    const result = await db
      .select()
      .from(Settings)
      .where(eq(Settings.createdBy, user?.primaryEmailAddress?.emailAddress));

    if (result.length === 0) {
      // Insert a new entry if none exists
      await db.insert(Settings).values({
        createdBy: user?.primaryEmailAddress?.emailAddress,
        showcsvimport: newShowCSVImportValue,
      });
    } else {
      // Update the existing entry
      await db
        .update(Settings)
        .set({ showcsvimport: newShowCSVImportValue })
        .where(eq(Settings.createdBy, user?.primaryEmailAddress?.emailAddress));
    }
  };

  const handleImportClick = () => {
    if (showCSVImport) {
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

  return (
    <div>
      <Button
        className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-lg shadow-lg hover:from-orange-600 hover:to-yellow-600 transition-transform transform hover:scale-105"
        onClick={handleImportClick}
      >
        Import CSV
      </Button>

      {/* Tutorial Dialog */}
      <Dialog
        open={showTutorialDialog}
        onOpenChange={handleTutorialDialogClose}
      >
        <DialogContent
          className="fixed rounded-3xl bg-gradient-to-b from-yellow-50 via-orange-100 to-red-100 p-6 shadow-2xl overflow-hidden"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          {/* Tutorial Header */}
          <h2 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-yellow-500 animate-gradient-text mb-4">
            {tutorialPages[currentTutorialPage].title}
          </h2>
          {/* Tutorial Content */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full ${progressColors[currentTutorialPage]}`}
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
          <p className="text-gray-700">
            {tutorialPages[currentTutorialPage].content}
          </p>
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Button
              disabled={currentTutorialPage === 0}
              className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-red-400 to-orange-500 rounded-lg shadow hover:from-red-500 hover:to-orange-600"
              onClick={() => setCurrentTutorialPage((prev) => prev - 1)}
            >
              Back
            </Button>
            <Button
              className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow hover:from-yellow-500 hover:to-orange-600"
              onClick={handleNextPage}
            >
              {currentTutorialPage < tutorialPages.length - 1
                ? "Next"
                : "Continue"}
            </Button>
          </div>
          {/* Checkbox */}
          <div className="mt-4">
            <Checkbox
              id="show-tutorial"
              checked={!showCSVImport} // Checkbox indicates "Don't show tutorial"
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="show-tutorial"
              className="ml-2 text-sm text-gray-600"
            >
              Don't show this tutorial again
            </label>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={showUploadDialog}
        onOpenChange={() => setShowUploadDialog(false)}
      >
        <DialogContent
          className="rounded-3xl bg-gradient-to-b from-yellow-50 via-orange-100 to-red-100 p-6 shadow-2xl overflow-hidden"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          <h2 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-yellow-500 animate-gradient-text mb-4">
            Upload Your Expense CSV
          </h2>
          <CsvUpload
            onFileSelect={(expenses) =>
              console.log("Uploaded Expenses:", expenses)
            }
          />
          <Button
            className="mt-4 px-4 py-2 font-semibold text-white bg-gradient-to-r from-red-400 to-orange-500 rounded-lg shadow hover:from-red-500 hover:to-orange-600"
            onClick={() => setShowUploadDialog(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CSVImportButton;
