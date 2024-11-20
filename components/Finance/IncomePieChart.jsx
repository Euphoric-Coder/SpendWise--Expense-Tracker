"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const IncomePieChart = ({ incomeList, totalIncome }) => {
  // Generate random colors for each segment
  const colors = incomeList.map(
    (_, index) => `hsl(${(index * 360) / incomeList.length}, 70%, 60%)`
  );

  const pieData = {
    labels: incomeList.map((income) => income.name),
    datasets: [
      {
        data: incomeList.map((income) =>
          ((income.amount / totalIncome) * 100).toFixed(2)
        ),
        backgroundColor: colors,
        hoverBackgroundColor: colors.map((color) =>
          color.replace("60%", "50%")
        ),
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        borderWidth: 1,
        borderColor: "#475569",
        padding: 10,
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 14,
          font: {
            size: 14,
            weight: "500",
          },
          padding: 20,
          color: "#1e3a8a",
          usePointStyle: true,
        },
      },
      datalabels: {
        color: "#ffffff",
        font: {
          size: 14,
          weight: "bold",
        },
        display: (context) => window.innerWidth >= 768,
        formatter: (value) => `${value}%`,
      },
    },
  };

  return (
    <Card
      className="shadow-lg rounded-lg p-6"
      style={{
        background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
        color: "#0f172a",
      }}
    >
      <CardHeader className="mb-6 text-center">
        <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
          Income Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          style={{
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
            aspectRatio: "1.5",
          }}
        >
          <Pie data={pieData} options={pieOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomePieChart;
