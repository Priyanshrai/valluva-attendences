import React from "react";
import { FaHome, FaPlus } from "react-icons/fa";

const AdminHeader = () => {
  return (
    <div className="bg-gray-100 py-4 px-6 shadow-md rounded-md">
      <div className="flex-col spacing-x-4">
        <div className="justify-center">
          <h1 className="text-black font-poppins font-bold text-5xl">
            Attendance/Schedule
          </h1>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 bg-gray-200 py-2 px-4 rounded-md">
            <button className="flex items-center space-x-2 bg-[#232A69] text-white py-2 px-4 rounded-md">
              <FaHome />
              <span>Home</span>
            </button>
            <button className="text-gray-600 hover:text-black py-2 px-4">
              Time Sheet
            </button>
            <button className="text-gray-600 hover:text-black py-2 px-4">
              Report
            </button>
            <button className="text-gray-600 hover:text-black py-2 px-4">
              Schedule
            </button>
            <button className="text-gray-600 hover:text-black py-2 px-4">
              Settings
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-[#232A69] text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
              <FaPlus />
              <span>Create Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
