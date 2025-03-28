import { useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ExperienceCarousel = ({ experience = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    if (currentIndex + itemsPerPage < experience.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prevSlide = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  const calculateExperience = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A"; // Handle missing dates
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (end < start) return "Invalid Dates"; // Prevent negative experience
  
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
  
    // Adjust for negative days
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
  
    // Adjust for negative months
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  
    // Build the experience string dynamically
    let experienceString = "";
    if (years > 0) experienceString += `${years} year${years > 1 ? "s" : ""} `;
    if (months > 0) experienceString += `${months} month${months > 1 ? "s" : ""} `;
    
    // Show days only if years and months are both zero
    if (!years && !months && days > 0) {
      experienceString += `${days} day${days > 1 ? "s" : ""}`;
    }
  
    return experienceString.trim() || "0 days"; // Default to "0 days" if nothing
  };
  
  

  return (
    <div className="w-full mx-auto">
      <h3 className="text-small font-semibold text-gray-900 mb-4">Experience</h3>
      {experience.length ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {experience.slice(currentIndex, currentIndex + itemsPerPage).map((exp, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-2xl">
                    <FaBuilding size={18} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{exp.companyName || "Company Name"}</h4>
                    <p className="text-gray-500">{exp.position || "Position"}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 text-sm">
                  <span className="font-medium">Experience:</span> {calculateExperience(exp.dateOfJoining, exp.dateOfLeaving)}
                </p>

              </div>
            ))}
          </div>
          {experience.length > itemsPerPage && (
            <div className="flex justify-start mt-3 mb-4">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-1 bg-blue-600 text-white rounded-full disabled:opacity-50 mx-2"
              >
                <IoIosArrowBack size={20} />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex + itemsPerPage >= experience.length}
                className="p-1 bg-blue-600 text-white rounded-full disabled:opacity-50 mx-2"
              >
                <IoIosArrowForward size={20} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Step into the spotlight and redefine what’s possible.</p>
      )}
    </div>
  );
};

export default ExperienceCarousel;
