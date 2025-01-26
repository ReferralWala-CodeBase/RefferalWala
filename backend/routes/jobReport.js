const express = require('express');
const router = express.Router();

const { reportJob, getReportedJobs, removeReport } = require('../controllers/JobReportController');

// Report a job (POST request)
router.post('/report', reportJob);

// Get all reported jobs for a specific user (GET request)
router.get('/reported', getReportedJobs); // Using POST here as the userId is in the body

// Remove a report for a specific job and user (DELETE request)
router.delete('/remove', removeReport);

module.exports = router;
