import React, { useState, useEffect } from "react";
import axios from "axios";
import PrintIcon from "../icons/print.png";
import DownloadIcon from "../icons/download.png";

const SelfComponent = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterParams, setFilterParams] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [summary, setSummary] = useState({
    expected: 0,
    present: 0,
    tardy: 0,
    expectedHours: "00:00:00",
    variance: "00:00:00",
    overTime: "00:00:00",
  });

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/self-attendance",
        { params: filterParams }
      );
      setAttendanceData(response.data.attendanceData);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilterParams({ ...filterParams, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAttendanceData();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/self-attendance/download",
        {
          params: filterParams,
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "self_attendance.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading attendance data:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Search and Filter Section */}
      <div className="flex justify-end mb-4 space-x-16">
        <form
          onSubmit={handleFilterSubmit}
          className="flex items-center space-x-4"
        >
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Search"
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={filterParams.name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="startDate"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  value={filterParams.startDate}
                  onChange={handleFilterChange}
                />
                <input
                  type="date"
                  name="endDate"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  value={filterParams.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </form>
        <div className="flex-row space-y-4">
          <div>
            <button
              type="submit"
              className="bg-[#2b7765] text-white w-[138px] h-[42.8px] py-[5.4px] px-[13.5px] rounded-l-[8.1px]"
            >
              Filter
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handlePrint}
              className="bg-blue-600 p-2 rounded-lg"
            >
              <img src={PrintIcon} alt="Print" className="w-6 h-6" />
            </button>
            <button
              onClick={handleDownload}
              className="bg-blue-600 p-2 rounded-lg"
            >
              <img src={DownloadIcon} alt="Download" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-32 bg-white"></div>

      {/* Upper section with counts */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 bg-blue-500 text-white rounded-full px-4 py-2">
            <span>Expected</span>
            <span className="bg-white text-black rounded-full px-2">
              {summary.expected}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-500 text-white rounded-full px-4 py-2">
            <span>Present</span>
            <span className="bg-white text-black rounded-full px-2">
              {summary.present}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-500 text-white rounded-full px-4 py-2">
            <span>Tardy</span>
            <span className="bg-white text-black rounded-full px-2">
              {summary.tardy}
            </span>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500 text-white rounded-l-full px-4 py-2">
              Expected
            </span>
            <span className="bg-gray-300 text-black rounded-r-full px-4 py-2">
              {summary.expectedHours} (Hours)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500 text-white rounded-l-full px-4 py-2">
              Variance
            </span>
            <span className="bg-gray-300 text-red-600 rounded-r-full px-4 py-2">
              {summary.variance} (Hours)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500 text-white rounded-l-full px-4 py-2">
              Over Time
            </span>
            <span className="bg-gray-300 text-black rounded-r-full px-4 py-2">
              {summary.overTime} (Hours)
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded">
          <thead className="bg-[#232a69] text-white rounded-lg">
            <tr>
              <th className="border border-gray-300 py-2 px-4">Date</th>
              <th className="border border-gray-300 py-2 px-4">Status</th>
              <th className="border border-gray-300 py-2 px-4">Clock In</th>
              <th className="border border-gray-300 py-2 px-4">Clock Out</th>
              <th className="border border-gray-300 py-2 px-4">Over Time</th>
              <th className="border border-gray-300 py-2 px-4">Worked</th>
              <th className="border border-gray-300 py-2 px-4">Expected</th>
              <th className="border border-gray-300 py-2 px-4">Variance</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {attendanceData.map((record, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4">{record.date}</td>
                <td className={`py-2 px-4 ${getStatusColor(record.status)}`}>
                  {record.status}
                </td>
                <td className="py-2 px-4">{record.clockIn || "-"}</td>
                <td className="py-2 px-4">{record.clockOut || "-"}</td>
                <td className="py-2 px-4">{record.overTime || "-"}</td>
                <td className="py-2 px-4">{record.worked || "-"}</td>
                <td className="py-2 px-4">{record.expected || "-"}</td>
                <td
                  className={`py-2 px-4 ${getVarianceColor(record.variance)}`}
                >
                  {record.variance !== null ? `${record.variance} Hrs` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "present":
      return "text-green-600";
    case "on-leave":
    case "absent":
      return "text-red-600";
    case "holiday":
    case "day-off":
      return "text-blue-600";
    case "late-in/early out":
      return "text-yellow-600";
    default:
      return "";
  }
};

const getVarianceColor = (variance) => {
  if (variance === null || variance === undefined) return "";

  const varianceStr = variance.toString();
  if (varianceStr.startsWith("-")) {
    return "text-red-600";
  } else if (parseFloat(varianceStr) > 0) {
    return "text-green-600";
  }
  return "";
};

export default SelfComponent;
