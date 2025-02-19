// routes/locationRoutes.js

const express = require('express');
const router = express.Router();
const locationController = require('../controllers/LocationController');

// Route to get all locations
router.get('/', locationController.getLocations);

// Route to add a new location
router.post('/', locationController.addLocation);

// Route to add multiple locations (Bulk add)
router.post('/bulk', locationController.addMultipleLocations);

// Route to update an existing location
router.put('/:id', locationController.updateLocation);

// Route to delete a location
router.delete('/:id', locationController.deleteLocation);

// Route to delete multiple locations (Bulk delete)
router.delete('/bulk', locationController.deleteMultipleLocations);

module.exports = router;
