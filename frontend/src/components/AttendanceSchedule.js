import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PrintIcon from "../icons/print.png";
import DownloadIcon from "../icons/download.png";
import PresentIcon from "../icons/present.png";
import AbsentIcon from "../icons/absent.png";
import HolidayIcon from "../icons/holiday.png";
import PresentOnHolidayIcon from "../icons/presentonholiday.png";
import HalfDayIcon from "../icons/halfday.png";
import TardyIcon from "../icons/tardy.png";
import OnLeaveIcon from "../icons/onleave.png";
import DayOffIcon from "../icons/dayoff.png";
import PresentOnDayOffIcon from "../icons/presentdayonoff.png";

const AttendanceSchedule = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
    employee_name: "",
    month: "",
    year: "",
  });
  const [error, setError] = useState(null);

  const fetchAttendanceData = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(
        "http://localhost:8000/api/attendances",
        {
          params: {
            ...filterParams,
            employee_name: filterParams.employee_name.trim() || undefined,
          },
        }
      );
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setError("Failed to fetch attendance data. Please try again.");
    }
  }, [filterParams]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleFilterChange = (e) => {
    setFilterParams({ ...filterParams, [e.target.id]: e.target.value });
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
        "http://localhost:8000/api/attendances/download",
        {
          responseType: "blob",
          params: filterParams,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading attendance data:", error);
      setError("Failed to download attendance data. Please try again.");
    }
  };

  const statusIcons = {
    present: <img src={PresentIcon} alt="Present" className="w-4 h-4" />,
    absent: <img src={AbsentIcon} alt="Absent" className="w-4 h-4" />,
    holiday: <img src={HolidayIcon} alt="Holiday" className="w-4 h-4" />,
    presentOnHoliday: (
      <img
        src={PresentOnHolidayIcon}
        alt="Present on Holiday"
        className="w-4 h-4"
      />
    ),
    halfDay: <img src={HalfDayIcon} alt="Half Day" className="w-4 h-4" />,
    tardy: <img src={TardyIcon} alt="Tardy" className="w-4 h-4" />,
    onLeave: <img src={OnLeaveIcon} alt="On Leave" className="w-4 h-4" />,
    dayOff: <img src={DayOffIcon} alt="Day Off" className="w-4 h-4" />,
    presentOnDayOff: (
      <img
        src={PresentOnDayOffIcon}
        alt="Present on Day-Off"
        className="w-4 h-4"
      />
    ),
  };

  return (
    <div className="p-5 bg-white w-full box-border rounded-xl">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Filters and Buttons */}
      <div className="flex justify-end space-x-16 mb-5">
        <form
          onSubmit={handleFilterSubmit}
          className="flex space-x-4 justify-items-center"
        >
          <div className="flex flex-col">
            <label htmlFor="start_date" className="text-sm font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              className="p-2 border border-gray-300 rounded w-36"
              value={filterParams.start_date}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end_date" className="text-sm font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              className="p-2 border border-gray-300 rounded w-36"
              value={filterParams.end_date}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="employee_name" className="text-sm font-medium mb-1">
              Employee Name
            </label>
            <input
              type="text"
              id="employee_name"
              className="p-2 border border-gray-300 rounded w-36"
              value={filterParams.employee_name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="month" className="text-sm font-medium mb-1">
              Month
            </label>
            <select
              id="month"
              className="p-2 border border-gray-300 rounded w-36"
              value={filterParams.month}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="year" className="text-sm font-medium mb-1">
              Year
            </label>
            <select
              id="year"
              className="p-2 border border-gray-300 rounded w-36"
              value={filterParams.year}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </form>
        <div className="flex-row items-end space-y-4">
          <div>
            <button
              type="submit"
              className="bg-[#2b7765] text-white w-[138px] h-[42.8px] py-[5.4px] px-[13.5px] rounded-l-[8.1px] "
            >
              Filter
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handlePrint}
              className="p-2 px-4 bg-blue-500 text-white rounded cursor-pointer flex items-center"
            >
              <img src={PrintIcon} alt="Print" className="w-6 h-6" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 px-4 bg-gray-500 text-white rounded cursor-pointer flex items-center"
            >
              <img src={DownloadIcon} alt="Download" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-4 bg-white"></div>

      {/* Legend */}
      <div className="flex justify-center mb-5 space-x-4">
        {Object.entries(statusIcons).map(([status, icon]) => (
          <div key={status} className="flex items-center">
            {icon}
            <span className="ml-1">
              {status.charAt(0).toUpperCase() +
                status
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead className="bg-[#232a69] text-white">
          <tr>
            <th className="border border-gray-300 p-2 text-center">ID</th>
            <th className="border border-gray-300 p-2 text-center">
              Employee Name
            </th>
            {[...Array(31).keys()].map((day) => (
              <th
                key={day + 1}
                className="border border-gray-300 p-2 text-center"
              >
                {day + 1}
              </th>
            ))}
            <th className="border border-gray-300 p-2 text-center">Total</th>
            <th className="border border-gray-300 p-2 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((employee) => (
            <tr key={employee.id}>
              <td className="border border-gray-300 p-2 text-center">
                {employee.id}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {employee.name}
              </td>
              {[...Array(31).keys()].map((day) => {
                const date = new Date(
                  filterParams.year || new Date().getFullYear(),
                  filterParams.month
                    ? parseInt(filterParams.month) - 1
                    : new Date().getMonth(),
                  day + 1
                )
                  .toISOString()
                  .split("T")[0];
                return (
                  <td
                    key={day}
                    className="border border-gray-300 p-2 text-center"
                  >
                    {statusIcons[employee.days[date]] || statusIcons["absent"]}
                  </td>
                );
              })}
              <td className="border border-gray-300 p-2 text-center">
                {
                  Object.values(employee.days).filter(
                    (status) => status === "present"
                  ).length
                }
                /31
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  className="form-checkbox  h-4 text-blue-600"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceSchedule;
