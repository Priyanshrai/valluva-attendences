import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendanceModal = ({ onClose, onAttendanceMarked }) => {
  const [view, setView] = useState("Individual");
  const [formData, setFormData] = useState({
    business_unit: "",
    department: "",
    designation: "",
    employee_id: "",
    date: "",
    punch_in: "",
    punch_out: "",
    is_late: false,
    is_half_day: false,
    working_from: "",
    attendance_overwrite: false,
  });

  const [employees, setEmployees] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [employeesRes, businessUnitsRes, departmentsRes, designationsRes] =
        await Promise.all([
          axios.get("http://localhost:8000/api/employees"),
          axios.get("http://localhost:8000/api/business-units"),
          axios.get("http://localhost:8000/api/departments"),
          axios.get("http://localhost:8000/api/designations"),
        ]);

      setEmployees(employeesRes.data);
      setBusinessUnits(businessUnitsRes.data);
      setDepartments(departmentsRes.data);
      setDesignations(designationsRes.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      alert("Failed to load employee data. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/mark-attendance",
        formData
      );
      console.log("Attendance marked:", response.data);
      alert("Attendance marked successfully!");
      onAttendanceMarked(response.data);
      onClose();
    } catch (error) {
      console.error("Error marking attendance:", error);
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          const errorMessages = Object.values(
            error.response.data.errors
          ).flat();
          alert(`Validation errors:\n${errorMessages.join("\n")}`);
        } else if (error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred while marking attendance");
        }
      } else {
        alert("An error occurred while marking attendance");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative">
        <div
          className="p-4 rounded-t-lg flex justify-between items-center"
          style={{ backgroundColor: "rgba(26, 114, 167, 1)" }}
        >
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                view === "Individual"
                  ? "bg-white text-blue-600 border border-[rgba(26,114,167,1)]"
                  : "bg-[rgba(26,114,167,1)] text-white"
              }`}
              onClick={() => setView("Individual")}
            >
              Individual
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                view === "Bulk"
                  ? "bg-white text-blue-600 border border-[rgba(26,114,167,1)]"
                  : "bg-[rgba(26,114,167,1)] text-white"
              }`}
              onClick={() => setView("Bulk")}
            >
              Bulk
            </button>
          </div>

          <button className="text-white text-2xl" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-lg font-bold text-blue-600 text-center mb-6">
            Mark Attendance
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Unit
                </label>
                <select
                  name="business_unit"
                  value={formData.business_unit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white"
                >
                  <option value="">Select Business Unit</option>
                  {businessUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Designation
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white"
                >
                  <option value="">Select Designation</option>
                  {designations.map((desig) => (
                    <option key={desig.id} value={desig.id}>
                      {desig.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee
                </label>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white"
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Punch In
                </label>
                <input
                  type="time"
                  name="punch_in"
                  value={formData.punch_in}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Punch Out
                </label>
                <input
                  type="time"
                  name="punch_out"
                  value={formData.punch_out}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {/* Late Toggle */}
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700">
                  Late
                </label>
                <label className="inline-flex items-center ml-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_late"
                    checked={formData.is_late}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:bg-blue-600">
                    <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>
              {/* Half Day Toggle */}
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700">
                  Half Day
                </label>
                <label className="inline-flex items-center ml-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_half_day"
                    checked={formData.is_half_day}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:bg-blue-600">
                    <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>
              {/* Working From Field */}
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700">
                  Working From
                </label>
                <input
                  type="text"
                  name="working_from"
                  value={formData.working_from}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white"
                />
              </div>
              {/* Overwrite Toggle */}
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700">
                  Overwrite
                </label>
                <label className="inline-flex items-center ml-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="attendance_overwrite"
                    checked={formData.attendance_overwrite}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:bg-blue-600">
                    <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-[#232a69] rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
