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



const SmallScreenNav = ({ setSelectedCompanies, setSelectedLocations }) => {
  const [modalType, setModalType] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const items = [
    { key: "company", title: "Company", component: ActionModal },
    { key: "location", title: "Location", component: ComedyModal },
  ];

  const ModalComponent = items.find((item) => item.key === modalType)?.component;

  const handleOpenModal = (key, event) => {
    const rect = event.target.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
    setModalType(key);
  };

  return (
    <>
      <div className="sm:hidden flex px-6 text-2xl whitespace-nowrap space-x-6 overflow-x-auto scrollbar-hide mt-4">
        {items.map(({ key, title }) => (
          <h2
            key={key}
            onClick={(e) => handleOpenModal(key, e)}
            className="text-xs cursor-pointer border bg-gray-200 py-1 rounded-full px-5"
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
            left: modalPosition.left,
            zIndex: 50,
          }}
        >
          <ModalComponent
            onClose={() => setModalType(null)}
            onCompanySelect={(comp) => setSelectedCompanies((prev) => [...prev, comp])}
            onLocationSelect={(loc) => setSelectedLocations((prev) => [...prev, loc])}
          />
        </div>
      )}
    </>
  );
};

export default SmallScreenNav;
