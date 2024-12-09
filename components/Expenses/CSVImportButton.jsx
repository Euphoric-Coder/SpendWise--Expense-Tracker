"use client";

import React, { useState, useEffect } from "react";
import CsvUpload from "./CSVImportCard";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Shadcn UI Checkbox
import { db } from "@/utils/dbConfig"; // Assume dbConfig is set up for your database
import { Settings } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";

const CSVImportButton = () => {
  const [showTutorialDialog, setShowTutorialDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentTutorialPage, setCurrentTutorialPage] = useState(0);
  const [showCSVImport, setShowCSVImport] = useState(true); // Default to true
  const {user} = useUser();

  const progressColors = [
    "bg-gradient-to-r from-yellow-400 to-orange-400",
    "bg-gradient-to-r from-orange-500 to-red-500",
    "bg-gradient-to-r from-red-600 to-yellow-600",
  ];

  const tutorialPages = [
    {
      title: "Step 1: CSV File Format",
      content: (
        <p>
          Your CSV file must have the following columns in the exact order:
          <strong> Date, Name, Amount</strong>. Each row should represent a
          single expense.
        </p>
      ),
      image: "/images/csv-format.png", // Replace with your image path
    },
    {
      title: "Step 2: Date Format",
      content: (
        <p>
          Ensure the <strong>Date</strong> column is in the format:
          <strong> YYYY-MM-DD</strong>. For example, <code>2024-01-01</code>.
        </p>
      ),
      image: "/images/date-format.png", // Replace with your image path
    },
    {
      title: "Step 3: Example File",
      content: (
        <pre className="bg-gray-100 p-4 rounded-md">
          {`date,name,amount
2024-01-01,Groceries,150
2024-01-02,Transport,50
2024-01-03,Utilities,100`}
        </pre>
      ),
      image: null,
    },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      // Fetch the `showcsvimport` value from the database for the current user
      const result = await db
        .select({ showcsvimport: Settings.showcsvimport })
        .from(Settings)
        .where(Settings.createdBy.eq(user.primaryEmailAddress?.emailAddress)); // Assuming `user.email` is the user ID
      setShowCSVImport(result?.[0]?.showcsvimport ?? true);
    };
    fetchSettings();
  }, [user]);

  const handleNextPage = () => {
    if (currentTutorialPage < tutorialPages.length - 1) {
      setCurrentTutorialPage((prev) => prev + 1);
    } else {
      setShowTutorialDialog(false);
      setShowUploadDialog(true);
    }
  };

  const handleSkipTutorial = async () => {
    setShowTutorialDialog(false);
    setShowUploadDialog(true);
  };

  const handleCheckboxChange = async (checked) => {
    setShowCSVImport(checked);

    // Update the `showcsvimport` value in the database
    await db
      .update(Settings)
      .set({ showcsvimport: checked })
      .where(Settings.createdBy.eq(user.email)); // Assuming `user.email` is the user ID
  };

  return (
    <div>
      {showCSVImport && (
        <Dialog open={showTutorialDialog} onOpenChange={setShowTutorialDialog}>
          <DialogTrigger asChild>
            <Button
              className="px-4 py-2 font-semibold text-white bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-lg shadow-lg hover:from-orange-600 hover:to-yellow-600 transition-transform transform hover:scale-105"
              onClick={() => setShowTutorialDialog(true)}
            >
              Import CSV
            </Button>
          </DialogTrigger>
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
                className="w-full h-auto rounded-md mb-4 shadow-lg"
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
                checked={showCSVImport}
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
      )}

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
