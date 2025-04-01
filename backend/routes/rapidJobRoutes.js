const express = require('express');
const router = express.Router();
const { getRapidJobs,replaceLast100RapidJobs, getAllRapidJobs, fetchRapidJobPagination } = require('../controllers/RapidJobController'); 

// Define the route to fetch jobs
router.get('/jobs', getRapidJobs);
router.post('/replace-last-100', replaceLast100RapidJobs);
router.get('/all-rapid-jobs', getAllRapidJobs);
router.get('/fetch-rapid-job-Pagination', fetchRapidJobPagination);


module.exports = router;
