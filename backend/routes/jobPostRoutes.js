const express = require('express');
const {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  applyForJobPost,
  getApplicantsForJobPost,
  updateJobPost,
  deleteJobPost,
  updateApplicantStatus,
  getUserApplicationStatuses,
  getApplicationStatusForJobPost,
  getJobsByJobUniqueId
} = require('../controllers/JobPostController');

const jwtMiddleware = require('../middleware/jwtMiddleware'); 

const router = express.Router();

// Create a job post
router.post('/create',jwtMiddleware, createJobPost);

// Get all job posts
router.get('/all',getAllJobPosts);

// Get a job post by ID
router.get('/:id', getJobPostById);

// Apply for a job post
router.post('/apply/:id', applyForJobPost);

// Get applicants for a job post
router.get('/applicants/:id',getApplicantsForJobPost);

//Get Applicants status on all jobs
router.get('/user/:userId/applications/statuses', getUserApplicationStatuses);

//Get Applicant status on specific job post
router.get('/user/:userId/jobpost/:jobPostId/application/status', getApplicationStatusForJobPost);

// Update applicant status
router.put('/:jobId/applicant/:applicantId/status',updateApplicantStatus);

// Update a job post
router.put('/update/:id', updateJobPost);

// get job by uniqueid
router.get('/unique/:jobUniqueId', getJobsByJobUniqueId);

// Delete a job post
router.delete('/delete/:id',jwtMiddleware, deleteJobPost);

module.exports = router;
