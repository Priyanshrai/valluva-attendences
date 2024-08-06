import React from "react";
import IconAdmin from "../icons/team.png"; // Replace with actual path
import IconTeam from "../icons/team.png"; // Replace with actual path
import IconSelf from "../icons/self.png"; // Replace with actual path

const Sidebar = ({ setView, view }) => {
  return (
    <div className="bg-black h-screen w-24 flex flex-col items-center py-10">
      <div
        className={`mb-16 cursor-pointer ${
          view === "Admin" ? "opacity-100" : "opacity-50"
        }`}
        onClick={() => setView("Admin")} // Set view to "Admin" when clicked
      >
        <img src={IconAdmin} alt="Admin Icon" className="w-12 h-12" />
      </div>
      <div
        className={`mb-16 cursor-pointer ${
          view === "Team" ? "opacity-100" : "opacity-50"
        }`}
        onClick={() => setView("Team")} // Set view to "Team" when clicked
      >
        <img src={IconTeam} alt="Team Icon" className="w-12 h-12" />
      </div>
      <div
        className={`cursor-pointer ${
          view === "Self" ? "opacity-100" : "opacity-50"
        }`}
        onClick={() => setView("Self")} // Set view to "Self" when clicked
      >
        <img src={IconSelf} alt="Self Icon" className="w-12 h-12" />
      </div>
    </div>
  );
};

export default Sidebar;
