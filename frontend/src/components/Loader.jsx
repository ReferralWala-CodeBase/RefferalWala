import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  const messages = [
    "Opportunities grow where trust is sown.",
    "Your network is your net worth; ReferralWala makes it work for you.",
    "Every recommendation is a bridge to success.",
    "Referrals aren't just about business; they're about building communities.",
    "Turn trust into treasure with every referral you make.",
    "Grow connections, build opportunities, and share success.",
    "Your word matters—let it create meaningful change.",
    "In a world of noise, trusted referrals are the clearest signal.",
    "The future of growth lies in the power of genuine recommendations.",
    "Empower others, and watch how it empowers you.",
  ];

  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    // Select a random message
    const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
    setRandomMessage(selectedMessage);
  }, []);

  return (
    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex flex-col justify-center items-center w-full h-full text-center z-50">
      <div className="flex flex-col justify-center items-center space-y-4">
        <p className="text-xl font-medium text-white">{randomMessage}</p>
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    </div>
  );
};

export default Loader;
