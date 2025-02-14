import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const ServerError = () => {

  const [serverMessage, setServerMessage] = useState("");
  
    useEffect(() => {
        const message = "Server not responding";
        setServerMessage(message);
    }, []);

  return (
    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex flex-col justify-center items-center w-full h-full text-center z-50">
      <div className="flex flex-col justify-center items-center space-y-4">
        <p className="text-xl font-medium text-white">{serverMessage}</p>
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    </div>
  );
};

export default ServerError;
