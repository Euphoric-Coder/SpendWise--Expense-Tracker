"use client";

import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const IncomeVisualization = ({ incomeList, totalIncome }) => {
  const [showLegend, setShowLegend] = useState(true); // State to toggle legend

  // Generate random colors for each segment
  const colors = incomeList.map(
    (_, index) => `hsl(${(index * 360) / incomeList.length}, 70%, 60%)`
  );

  // Data for Pie Chart
  const data = {
    labels: incomeList.map((income) => income.name),
    datasets: [
      {
        data: incomeList.map((income) =>
          ((income.amount / totalIncome) * 100).toFixed(2)
        ),
        backgroundColor: colors,
        hoverBackgroundColor: colors.map((color) =>
          color.replace("60%", "50%")
        ), // Slightly darker on hover
        borderWidth: 1,
      },
    ],
  };

  // Options for Pie Chart
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures custom sizing
    plugins: {
      tooltip: {
        backgroundColor: "#1e293b", // Dark background for tooltip
        titleColor: "#f8fafc", // Light title color
        bodyColor: "#cbd5e1", // Light body text
        borderWidth: 1,
        borderColor: "#475569", // Subtle border
        padding: 10, // Spacing for better appearance
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const value = incomeList[index].amount;
            return ` ${context.label}: $${value.toLocaleString()} (${
              context.raw
            }%)`;
          },
        },
      },
      legend: {
        display: showLegend, // Dynamic display based on state
        position: window.innerWidth >= 1280 ? "right" : "bottom", // Adjust legend position for large screens
        labels: {
          color: "#4ade80", // Futuristic green color
          font: {
            size: 14,
            weight: "bold",
          },
          padding: 20,
          usePointStyle: true, // Rounded legend markers
        },
      },
      datalabels: {
        color: "#ffffff", // White text for labels
        font: {
          size: 14,
          weight: "bold",
        },
        display: (context) => {
          // Hide labels on mobile screens
          return window.innerWidth >= 768;
        },
        formatter: (value) => `${value}%`, // Display percentage
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
  };

  return (
    <Card className="shadow-lg rounded-lg p-6">
      <CardHeader className="flex justify-between items-center mb-6">
        <CardTitle className="text-center text-xl font-semibold">
          Income Breakdown
        </CardTitle>
        <Button
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
          onClick={() => setShowLegend(!showLegend)}
        >
          {showLegend ? "Hide Legend" : "Show Legend"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col xl:flex-row items-center xl:justify-between">
          <div
            className="flex-grow"
            style={{
              width: "100%", // Full width for smaller screens
              maxWidth: "600px", // Bigger size for large screens
              aspectRatio: "1", // Ensures it's a square
            }}
          >
            <Pie data={data} options={options} />
          </div>
          {showLegend && (
            <div
              className="hidden xl:block ml-8 p-4 text-left text-sm w-[30%]"
              style={{
                borderLeft: "2px solid #4ade80", // Futuristic green border
              }}
            >
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Legend
              </h3>
              <ul className="space-y-2">
                {incomeList.map((income, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-gray-400"
                  >
                    <span
                      style={{
                        backgroundColor: colors[index],
                        width: "12px",
                        height: "12px",
                        display: "inline-block",
                        borderRadius: "50%", // Futuristic rounded markers
                      }}
                    ></span>
                    <span>{income.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeVisualization;
