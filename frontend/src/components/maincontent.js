import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const MainContent = () => {
  // Data for the doughnut chart
  const doughnutData = {
    labels: ["Office", "Home", "Others"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ["#6A0DAD", "#FF4081", "#7B1FA2"],
        hoverBackgroundColor: ["#4A0072", "#E91E63", "#6A1B9A"],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  // Data for the bar chart
  const barData = {
    labels: [
      "Administration",
      "Marketing",
      "Finance",
      "Customer Support",
      "IT",
      "Human Resources",
      "Sales",
      "Accounting",
    ],
    datasets: [
      {
        label: "Productivity Rate (%)",
        data: [95.3, 94.97, 87.96, 86.17, 86.11, 84.92, 84.05, 84.03],
        backgroundColor: "#6A0DAD",
        borderColor: "#6A0DAD",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 25, // Increased bar thickness for wider bars
        categoryPercentage: 0.8, // Controls the width of the bars as a percentage of the category width
        barPercentage: 0.9, // Controls the width of individual bars within the category
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Header Section */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">Date</label>
          <input
            type="date"
            className="border rounded p-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">
            Business Unit
          </label>
          <select className="border rounded p-2 text-sm focus:outline-none focus:border-blue-500">
            <option>All</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">
            Department
          </label>
          <select className="border rounded p-2 text-sm focus:outline-none focus:border-blue-500">
            <option>All</option>
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4 shadow hover:bg-blue-600 focus:outline-none">
            Go
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg text-center shadow-sm">
          <p className="text-sm font-medium text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold">30</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center shadow-sm">
          <p className="text-sm font-medium text-gray-600">Over Time (hrs)</p>
          <p className="text-2xl font-bold">08</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center shadow-sm">
          <p className="text-sm font-medium text-gray-600">Grace Time (hrs)</p>
          <p className="text-2xl font-bold">08</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center shadow-sm">
          <p className="text-sm font-medium text-gray-600">
            Break vs Over Time
          </p>
          <div className="flex justify-center mt-2">
            <div className="mr-4">
              <p className="text-red-600">Break</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <div>
              <p className="text-blue-600">Over-Time</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center shadow-sm">
          <p className="text-sm font-medium text-gray-600">
            Late login vs Early Logout
          </p>
          <div className="flex justify-center mt-2">
            <div className="mr-4">
              <p className="text-red-600">Early</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <div>
              <p className="text-blue-600">Late</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section with fixed height and width */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="bg-white shadow-lg rounded-lg p-6"
          style={{ width: "100%", height: "400px" }}
        >
          <p className="text-sm font-medium text-gray-600 mb-4">
            Productivity Rate by Department
          </p>
          <Bar
            data={barData}
            options={{
              indexAxis: "y", // Horizontal bar chart with data on Y-axis
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    color: "#4A4A4A",
                    font: { size: 12 },
                    callback: (value) => `${value}%`, // Add percentage symbol to x-axis values
                  },
                  grid: { display: false },
                  title: {
                    display: true,
                    text: "Productivity Rate (%)",
                    color: "#4A4A4A",
                    font: { size: 14 },
                  },
                },
                y: {
                  ticks: {
                    color: "#4A4A4A",
                    font: { size: 12 },
                    callback: (value, index) => barData.labels[index], // Display department names on the y-axis
                  },
                  grid: { display: false },
                  title: {
                    display: true,
                    text: "Departments",
                    color: "#4A4A4A",
                    font: { size: 14 },
                  },
                },
              },
            }}
          />
        </div>
        <div
          className="bg-white shadow-lg rounded-lg p-6"
          style={{ width: "100%", height: "400px" }}
        >
          <p className="text-sm font-medium text-gray-600 mb-4">
            Employee Count by Work Location
          </p>
          <Doughnut
            data={doughnutData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  labels: {
                    color: "#4A4A4A",
                    font: { size: 12 },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
