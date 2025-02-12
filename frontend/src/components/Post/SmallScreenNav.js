import { useState, useEffect } from "react";

const CompanyModal = ({ onClose, onCompanySelect, selectedCompanies }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]);

  const Logo_Dev_Secret_key = process.env.REACT_APP_LOGO_DEV_SECRET_KEY;

  useEffect(() => {
    const fetchCompanies = async () => {
      if (searchTerm.length < 2) {
        setCompanySuggestions([]);
        return;
      }
      try {
        const response = await fetch(`https://api.logo.dev/search?q=${searchTerm}`, {
          headers: { Authorization: `Bearer ${Logo_Dev_Secret_key}` },
        });

        if (!response.ok) throw new Error("Failed to fetch company suggestions");

        const data = await response.json();
        setCompanySuggestions(data || []);
      } catch (error) {
        console.error(error);
        setCompanySuggestions([]);
      }
    };

    fetchCompanies();
  }, [searchTerm]);

  return (
    <div className="z-80 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-2">Search Company</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {companySuggestions.length > 0 && (
          <ul className="border mt-2 max-h-40 overflow-y-auto">
            {companySuggestions.map((comp) => (
              <li
                key={comp.name}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => onCompanySelect(comp.name)}
              >
                {comp.name}
              </li>
            ))}
          </ul>
        )}

        {selectedCompanies.length > 0 && (
          <div className="mt-3">
            <h3 className="font-semibold">Selected Companies:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCompanies.map((company, index) => (
                <div key={index} className="flex items-center bg-gray-300 px-2 py-1 rounded">
                  {company}
                  <button
                    onClick={() => onCompanySelect(company, true)}
                    className="ml-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const SmallScreenNav = ({ setSelectedCompanies, selectedCompanies }) => {
  const [modalType, setModalType] = useState(null);

  const items = [
    { key: "company", title: "Company", component: CompanyModal },
  ];

  const handleCompanySelect = (company, remove = false) => {
    if (remove) {
      setSelectedCompanies((prev) => prev.filter((c) => c !== company));
    } else if (!selectedCompanies.includes(company)) {
      setSelectedCompanies((prev) => [...prev, company]);
    }
  };

  const ModalComponent = items.find((item) => item.key === modalType)?.component;

  return (
    <>
      <div className="sm:hidden flex px-6 text-2xl whitespace-nowrap space-x-6 overflow-x-auto scrollbar-hide mt-4">
        {items.map(({ key, title }) => (
          <h2
            key={key}
            onClick={() => setModalType(key)}
            className="last:pr-22 text-xs cursor-pointer border bg-gray-200 py-1 rounded-full px-5"
          >
            {title}
          </h2>
        ))}
      </div>

      {ModalComponent && (
        <ModalComponent
          onClose={() => setModalType(null)}
          onCompanySelect={handleCompanySelect}
          selectedCompanies={selectedCompanies}
        />
      )}
    </>
  );
};

export default SmallScreenNav;