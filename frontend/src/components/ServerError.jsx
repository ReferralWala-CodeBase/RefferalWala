import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // For navigation

const ServerError = () => {
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate(); // Using react-router to navigate

  useEffect(() => {
    const message = "Server not responding";
    setServerMessage(message);
  }, []);

  // Function to navigate to the login page
  const handleLoginClick = () => {
    navigate("/user-login"); // Redirect to login page
  };

  return (
    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex flex-col justify-center items-center w-full h-full text-center z-50">
      <div className="flex flex-col justify-center items-center space-y-4">
        <p className="text-xl font-medium text-white">{serverMessage}</p>
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <button
          onClick={handleLoginClick}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default ServerError;
