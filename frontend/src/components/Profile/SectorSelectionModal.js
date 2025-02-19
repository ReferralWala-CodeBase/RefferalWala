import React, { useState } from "react";

const SECTOR_OPTIONS = [
  "Engineering",
  "Medical",
  "IT",
  "Finance",
  "Marketing",
  "Education",
  "Law",
  "Automobile",
  "Other", // Special option for custom input
];

export default function SectorSelectionModal({ onSave, onClose }) {
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [customSector, setCustomSector] = useState("");

  const handleCheckboxChange = (sector) => {
    if (sector === "Other") {
      setSelectedSectors((prev) =>
        prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
      );
    } else {
      setSelectedSectors((prev) =>
        prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
      );
    }
  };

  const handleSave = () => {
    const finalSectors = selectedSectors.includes("Other")
      ? [...selectedSectors.filter((s) => s !== "Other"), customSector]
      : selectedSectors;

    onSave(finalSectors);
  };

 
  return (
    
    <section className="min-h-screen bg-slate-200/90">
    <div className="flex min-h-full flex-1 flex-col justify-center pt-0 md:pt-4 sm:px-6 lg:px-8">
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-120">
        <h2 className="text-xl font-bold mb-3">Select Preferred Sectors</h2>
        
        {SECTOR_OPTIONS.map((sector) => (
          <div key={sector} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={sector}
              checked={selectedSectors.includes(sector)}
              onChange={() => handleCheckboxChange(sector)}
              className="mr-2"
            />
            <label htmlFor={sector}>{sector}</label>
          </div>
        ))}

        {/* Show custom input only if "Other" is selected */}
        {selectedSectors.includes("Other") && (
          <input
            type="text"
            placeholder="Specify your sector"
            value={customSector}
            onChange={(e) => setCustomSector(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          />
        )}

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
    </div>
    </section>
  );
}
