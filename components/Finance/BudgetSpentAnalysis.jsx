import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrencyDashboard } from "@/utils/utilities";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md p-2 rounded-md border border-gray-200">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        {payload.map((item, index) => (
          <p
            key={index}
            className="text-sm"
            style={{
              color: item.dataKey === "totalSpend" ? "#1e90ff" : "#87cefa",
              fontWeight: "600",
            }}
          >
            {item.name === "Amount" ? "Allocated Budget" : item.name}:{" "}
            {formatCurrencyDashboard(item.value)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default function BudgetSpentChart({ budgetList }) {
  const [selectedChart, setSelectedChart] = useState("bar"); // Default chart type

  const renderChart = () => {
    switch (selectedChart) {
      case "bar":
        return (
          <BarChart
            data={budgetList}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="totalSpend"
              name="Total Spend"
              stackId="a"
              fill="url(#gradient1)"
            />
            <Bar
              dataKey="amount"
              name="Amount"
              stackId="a"
              fill="url(#gradient2)"
            />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart
            data={budgetList}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              dataKey="totalSpend"
              name="Total Spend"
              type="monotone"
              fill="url(#gradient1)"
              stroke="#1e90ff"
            />
            <Area
              dataKey="amount"
              name="Amount"
              type="monotone"
              fill="url(#gradient2)"
              stroke="#87cefa"
            />
          </AreaChart>
        );
      case "line":
        return (
          <LineChart
            data={budgetList}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              dataKey="totalSpend"
              name="Total Spend"
              type="monotone"
              stroke="#1e90ff"
              strokeWidth={3}
            />
            <Line
              dataKey="amount"
              name="Amount"
              type="monotone"
              stroke="#87cefa"
              strokeWidth={3}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-10">
      {/* Card */}
      <Card className="mt-4 border shadow-lg rounded-2xl p-5 bg-gradient-to-br from-white to-blue-100">
        <CardHeader className="relative flex justify-center items-center">
          {/* Card Title in the Center */}
          <CardTitle className="font-extrabold text-2xl text-gray-500">
            Budget Spent Analysis
          </CardTitle>
          {/* Select Component on the Left */}
          <div className="flex gap-2 items-center justify-center relative xl:absolute left-0">
              <p className="font-bold mb-2 text-gray-500 xl:text-lg text-sm">
                Choose your Preferred Chart:
              </p>
            <Select
              value={selectedChart}
              onValueChange={(value) => setSelectedChart(value)}
            >
              <SelectTrigger className="w-[200px] border-2 border-gray-200 rounded-md bg-white hover:shadow">
                <SelectValue placeholder="Select Chart" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
          {/* Gradient Definitions for Blue Theme */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e90ff" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#1e90ff" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#87cefa" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#87cefa" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </svg>
        </CardContent>
      </Card>
    </div>
  );
}
