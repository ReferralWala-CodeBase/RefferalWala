import { useState, useEffect, useRef } from "react";
import { LocationExport } from '../Location';

const ActionModal = ({ onClose, onCompanySelect }) => {
  const [companySearch, setCompanySearch] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const modalRef = useRef(null);

  const fetchCompanies = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setCompanySuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.logo.dev/search?q=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_LOGO_DEV_SECRET_KEY}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch company suggestions");

      const data = await response.json();
      setCompanySuggestions(data.length > 0 ? data : []);
    } catch (error) {
      console.error(error);
      setCompanySuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    setCompanySearch(e.target.value);
    fetchCompanies(e.target.value);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={modalRef} className="absolute w-64 bg-white p-4 rounded-lg shadow-lg z-50">
      <h2 className="text-lg font-bold">Select Company</h2>
      <input
        type="text"
        placeholder="Search company..."
        value={companySearch}
        onChange={handleInputChange}
        className="border p-2 w-full mt-2"
      />
      {companySuggestions.length > 0 && (
        <ul className="border mt-2 max-h-40 overflow-y-auto">
          {companySuggestions.map((comp, index) => (
            <li
              key={index}
              onClick={() => {
                onCompanySelect(comp.name);
                onClose();
              }}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {comp.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ComedyModal = ({ onClose, onLocationSelect }) => {
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLocationDropdownVisible, setIsLocationDropdownVisible] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setLocationSearch(searchTerm);

    if (searchTerm.length > 2) {
      const filteredLocations = LocationExport.filter((loc) => {
        if (!loc || (!loc.city && !loc.state)) return false; // Ensure `loc` is valid

        const cityMatch = loc.city?.toLowerCase().includes(searchTerm.toLowerCase());
        const stateMatch = loc.state?.toLowerCase().includes(searchTerm.toLowerCase());
        return cityMatch || stateMatch;
      });

      setLocationSuggestions(filteredLocations);
      setIsLocationDropdownVisible(filteredLocations.length > 0);
    } else {
      setLocationSuggestions([]);
      setIsLocationDropdownVisible(false);
    }
  };


  return (
    <div ref={modalRef} className="absolute w-64 bg-white p-4 rounded-lg shadow-lg z-50">
      <h2 className="text-lg font-bold">Select Location</h2>
      <input
        type="text"
        placeholder="Search location..."
        value={locationSearch}
        onFocus={() => setIsLocationDropdownVisible(locationSearch.length > 2 && locationSuggestions.length > 0)}
        onChange={handleInputChange}
        className="border p-2 w-full mt-2"
      />
      {isLocationDropdownVisible && (
        <ul className="absolute left-0 w-full space-y-1 max-h-40 overflow-y-auto custom-scrollbar text-xs border border-gray-300 rounded-lg bg-white shadow-md z-10">
          {locationSuggestions.map((loc, index) => (
            <li
              key={index}
              onClick={() => {
                onLocationSelect({
                  city: loc.city || "",
                  state: loc.state || "",
                });
                onClose();
              }}
              className="cursor-pointer p-2 hover:bg-gray-200 rounded-md"
            >
              {loc.city ? `${loc.city}, ` : ""}{loc.state || ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CtcModal = ({ onClose, onCtcSelect }) => {
  const ctcRanges = [
    "3-5 LPA", "5-8 LPA", "8-12 LPA", "12-15 LPA", "15-20 LPA", "20-25 LPA", "25+ LPA"
  ];

  return (
    <div className="absolute w-64 bg-white p-4 rounded-lg shadow-lg z-50">
      <h2 className="text-lg font-bold">Select CTC</h2>
      <ul className="space-y-1">
        {ctcRanges.map((ctc, index) => (
          <li
            key={index}
            onClick={() => {
              onCtcSelect(ctc);
              onClose();
            }}
            className="cursor-pointer p-2 hover:bg-gray-200 rounded-md"
          >
            {ctc}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ExperienceModal = ({ onClose, onExperienceSelect }) => {
  const experienceRanges = [
    "0-1 year", "2-5 years", "6-10 years", "10+ years"
  ];

  return (
    <div className="absolute w-64 bg-white p-4 rounded-lg shadow-lg z-50">
      <h2 className="text-lg font-bold">Select Experience</h2>
      <ul className="space-y-1">
        {experienceRanges.map((experience, index) => (
          <li
            key={index}
            onClick={() => {
              onExperienceSelect(experience);
              onClose();
            }}
            className="cursor-pointer p-2 hover:bg-gray-200 rounded-md"
          >
            {experience}
          </li>
        ))}
      </ul>
    </div>
  );
};




const SmallScreenNav = ({ setSelectedCompanies, setSelectedLocations, setSelectedCtc, setSelectedExperience }) => {
  const [modalType, setModalType] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const items = [
    { key: "company", title: "Company", component: ActionModal },
    { key: "location", title: "Location", component: ComedyModal },
    { key: "ctc", title: "CTC", component: CtcModal },
    { key: "experience", title: "Experience", component: ExperienceModal }
  ];

  const ModalComponent = items.find((item) => item.key === modalType)?.component;

  const handleOpenModal = (key, event) => {
    const rect = event.target.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
    setModalType(key);
  };

  return (
    <>
      <div className="sm:hidden flex px-4 text-2xl whitespace-nowrap space-x-4 overflow-x-auto scrollbar-hide mt-4">
        {items.map(({ key, title }) => (
          <h2
            key={key}
            onClick={(e) => handleOpenModal(key, e)}
            className="text-xs cursor-pointer border bg-gray-200 py-1 rounded-full px-1"
          >
            {title}
          </h2>
        ))}
      </div>

      {ModalComponent && (
        <div
          style={{
            position: "absolute",
            top: modalPosition.top,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            minWidth: "250px",
            maxWidth: "90vw",
            backgroundColor: "white", // Ensure the modal has a background
            borderRadius: "8px",       // Optional for rounded corners
          }}
        >
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setModalType(null)}
              className="absolute top-2 right-2 text-3xl text-gray-500 hover:text-red-500 p-2"
              style={{
                zIndex: 1000, // Set a very high z-index to bring it forward
                backgroundColor: "white", // Ensure it has a visible background
                borderRadius: "50%", // Optional: make it round
                width: "30px", // Adjust size
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)", // Add slight shadow for visibility
              }}
            >
              ×
            </button>


            {/* Modal Component */}
            <ModalComponent
              onClose={() => setModalType(null)}
              onCompanySelect={(comp) => setSelectedCompanies((prev) => [...prev, comp])}
              onLocationSelect={(loc) => setSelectedLocations((prev) => [...prev, loc])}
              onCtcSelect={(ctc) => setSelectedCtc(ctc)}
              onExperienceSelect={(experience) => setSelectedExperience(experience)}
            />
          </div>
        </div>
      )}



    </>
  );
};


export default SmallScreenNav;
