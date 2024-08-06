import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import AdminHeader from "./components/adminheader";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/maincontent";
import AttendanceSchedule from "./components/AttendanceSchedule";
import SelfComponent from "./components/SelfComponent";

function App() {
  const [view, setView] = useState("Team"); // Default view set to "Team"

  return (
    <div className="flex gap-8 bg-gray-300 min-h-screen">
      <Sidebar setView={setView} view={view} />
      <div className="flex flex-col w-full">
        {/* White Space Section */}
        <div className="bg-white mr-4 rounded-xl mt-8 h-24"></div>

        {/* Gap between white space and header */}
        <div className="h-4"></div>

        {/* Header Section */}
        <div className="bg-white mr-4 rounded-xl shadow-sm ">
          {view === "Admin" ? (
            <AdminHeader />
          ) : (
            <Header setView={setView} view={view} />
          )}
        </div>

        {/* Gap between header and content */}
        <div className="h-4"></div>

        {/* Main Content Section */}
        <div className="flex-1 p-4">
          {view === "Admin" && <MainContent />}
          {view === "Team" && <AttendanceSchedule />}
          {view === "Self" && <SelfComponent />}
        </div>
      </div>
    </div>
  );
}

export default App;
