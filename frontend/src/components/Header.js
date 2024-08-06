import React, { useState } from "react";
import Modal from "./Modal"; // Import the Modal component
import teamImage from "../icons/toggle1.png"; // Replace with your image path
import selfImage from "../icons/toggle2.png"; // Replace with your image path

const Header = ({ setView, view }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleView = (selectedView) => {
    setView(selectedView);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleImageClick = () => {
    // Toggle between 'Team' and 'Self' view
    setView(view === "Team" ? "Self" : "Team");
  };

  return (
    <header className="bg-white py-10 px-6 rounded-xl shadow flex items-center justify-end">
      <div className="flex flex-col items-end space-y-2">
        <h1 className="text-5xl font-semibold text-gray-800  leading-[60px] tracking-wide text-left">
          Attendance/Schedule
        </h1>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-200 rounded-full p-1">
            <img
              src={view === "Team" ? teamImage : selfImage}
              alt={view === "Team" ? "Team View" : "Self View"}
              className="w-16 h-8 rounded-full cursor-pointer"
              onClick={handleImageClick}
            />
          </div>
          <button
            className="bg-[#232a69] text-white w-[220px] h-[47px] py-2 px-0 rounded-l-lg shadow "
            onClick={toggleModal}
          >
            + Mark Attendance
          </button>
        </div>
      </div>
      {isModalOpen && <Modal onClose={toggleModal} />}
    </header>
  );
};

export default Header;
