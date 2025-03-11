import React from "react";

const ProfileWithProgress = ({ profileData, profileCompletion }) => {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const filledCircumference = (profileCompletion / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        viewBox="0 0 150 150"
      >
        <circle
          cx="75"
          cy="75"
          r={normalizedRadius}
          stroke="#E5E7EB"
          strokeWidth={stroke}
          fill="none"
        />

        <circle
          cx="75"
          cy="75"
          r={normalizedRadius}
          stroke="#3B82F6"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${filledCircumference} ${circumference}`}
          strokeDashoffset={circumference - filledCircumference}
          strokeLinecap="round"
          transform="rotate(-90 75 75)"
        />
      </svg>

      <div className="relative w-36 h-36 mx-auto bg-white rounded-full flex items-center justify-center">
        <img
          src={profileData?.profilePhoto}
          alt="Profile"
          className="w-32 h-32 rounded-full border-2 p-1 shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
      </div>

      {profileCompletion !== null && (
        <div className="absolute bottom-4 right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          {profileCompletion}%
        </div>
      )}
    </div>
  );
};

export default ProfileWithProgress;
