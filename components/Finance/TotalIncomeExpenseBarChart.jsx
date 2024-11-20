"use client";

import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TotalIncomeExpenseBarChart = ({ totalIncome, totalExpense }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const ctx = chart.ctx;

      // Create gradient for Total Income
      const incomeGradient = ctx.createLinearGradient(0, 0, 0, 400);
      incomeGradient.addColorStop(0, "rgba(173, 216, 230, 1)"); // Light Blue
      incomeGradient.addColorStop(1, "rgba(138, 43, 226, 1)"); // Purple

      // Create gradient for Total Expenses
      const expenseGradient = ctx.createLinearGradient(0, 0, 0, 400);
      expenseGradient.addColorStop(0, "rgba(255, 182, 193, 1)"); // Light Pink
      expenseGradient.addColorStop(1, "rgba(138, 43, 226, 1)"); // Purple

      chart.data.datasets[0].backgroundColor = [
        incomeGradient,
        expenseGradient,
      ];
      chart.update();
    }
  }, [totalIncome, totalExpense]);

  const barData = {
    labels: ["Total Income", "Total Expenses"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [totalIncome, totalExpense],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#1e3a8a",
          font: {
            size: 14,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: "#e5e7eb", // Subtle grid lines
        },
        ticks: {
          color: "#1e3a8a",
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 14,
          font: {
            size: 14,
          },
          color: "#1e3a8a",
        },
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
        <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br via-orange-400 from-yellow-300 to-green-400">
          Total Income Vs Total Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="h-60"
          style={{
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <Bar ref={chartRef} data={barData} options={barOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalIncomeExpenseBarChart;
