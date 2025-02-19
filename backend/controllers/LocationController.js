// controllers/locationController.js

const Location = require('../models/Location');

// Get all locations
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching locations' });
  }
};


// Add a new location (prevent duplicate city)
const addLocation = async (req, res) => {
  const { city, state } = req.body;

  if (!city || !state) {
    return res.status(400).json({ message: 'City and state are required' });
  }

  try {
    // Check if city already exists
    const existingLocation = await Location.findOne({ city: city.trim() });
    if (existingLocation) {
      return res.status(400).json({ message: 'City already exists' });
    }

    const newLocation = new Location({ city: city.trim(), state: state.trim() });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(500).json({ message: 'Error creating location' });
  }
};

// Add multiple locations (Bulk add with duplicate check)
const addMultipleLocations = async (req, res) => {
  const locations = req.body; // Expect an array of locations

  if (!Array.isArray(locations) || locations.length === 0) {
    return res.status(400).json({ message: 'You must send an array of locations' });
  }

  // Ensure each location has a city and state
  const invalidLocations = locations.filter(location => !location.city || !location.state);
  if (invalidLocations.length > 0) {
    return res.status(400).json({ message: 'Each location must have both city and state' });
  }

  try {
    // Fetch existing cities from DB
    const existingCities = await Location.find({ city: { $in: locations.map(loc => loc.city.trim()) } }).select('city');

    // Extract city names that already exist
    const existingCityNames = existingCities.map(loc => loc.city);

    // Filter out locations that already exist
    const newLocations = locations
      .map(loc => ({ city: loc.city.trim(), state: loc.state.trim() }))
      .filter(loc => !existingCityNames.includes(loc.city));

    if (newLocations.length === 0) {
      return res.status(400).json({ message: 'All cities already exist' });
    }

    const insertedLocations = await Location.insertMany(newLocations);
    res.status(201).json(insertedLocations);
  } catch (err) {
    res.status(500).json({ message: 'Error creating locations' });
  }
};


// Update a location
const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { city, state } = req.body;

  if (!city || !state) {
    return res.status(400).json({ message: 'City and state are required' });
  }

  try {
    const updatedLocation = await Location.findByIdAndUpdate(id, { city, state }, { new: true });
    
    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(updatedLocation);
  } catch (err) {
    res.status(500).json({ message: 'Error updating location' });
  }
};

// Delete a location
const deleteLocation = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedLocation = await Location.findByIdAndDelete(id);
      
      if (!deletedLocation) {
        return res.status(404).json({ message: 'Location not found' });
      }
  
      res.status(200).json({ message: `City '${deletedLocation.city}' has been deleted successfully.` });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting location' });
    }
  };
  

// Delete multiple locations (Bulk delete)
const deleteMultipleLocations = async (req, res) => {
  const { ids } = req.body; // Expect an array of ids

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'You must send an array of ids' });
  }

  try {
    const result = await Location.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No locations found to delete' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting locations' });
  }
};

module.exports = {
  getLocations,
  addLocation,
  addMultipleLocations,
  updateLocation,
  deleteLocation,
  deleteMultipleLocations
};
