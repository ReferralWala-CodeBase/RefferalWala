import React, { useState } from "react";

const JobLocationFilter = ({ locations, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Filter locations based on the search term
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationSelect = (location) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const handleLocationRemove = (location) => {
    setSelectedLocations(selectedLocations.filter(item => item !== location));
  };

  // Notify parent about the selected locations
  React.useEffect(() => {
    onFilterChange(selectedLocations);
  }, [selectedLocations, onFilterChange]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", width: "300px" }}>
      <h4>Filter by Job Location</h4>
      <input
        type="text"
        placeholder="Search locations..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />

      <ul
        style={{
          maxHeight: "150px",
          overflowY: "auto",
          padding: "0",
          listStyle: "none",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        {filteredLocations.map((location) => (
          <li
            key={location}
            style={{
              padding: "8px",
              cursor: "pointer",
              backgroundColor: selectedLocations.includes(location)
                ? "#d3f3d3"
                : "#fff",
            }}
            onClick={() => handleLocationSelect(location)}
          >
            {location}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "10px" }}>
        <h5>Selected Locations:</h5>
        {selectedLocations.map((location) => (
          <div
            key={location}
            style={{
              display: "inline-block",
              background: "#007bff",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "20px",
              margin: "5px",
              fontSize: "14px",
            }}
          >
            {location}
            <span
              style={{
                marginLeft: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => handleLocationRemove(location)}
            >
              &times;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobLocationFilter;