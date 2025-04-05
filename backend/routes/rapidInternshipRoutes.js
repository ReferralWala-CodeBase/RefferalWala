const express = require('express');
const router = express.Router();
const { getRapidInternships,replaceLast100RapidInternships, getAllRapidInternships, fetchRapidInternshipPagination } = require('../controllers/RapidInternshipController'); 

// Define the route to fetch internships
router.get('/internships', getRapidInternships);
router.post('/replace-last-100', replaceLast100RapidInternships);
router.get('/all-rapid-internships', getAllRapidInternships);
router.get('/fetch-rapid-internship-Pagination', fetchRapidInternshipPagination);


module.exports = router;
