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
  getJobsByJobUniqueId,
  getJobPostsByUser
} = require('../controllers/JobPostController');

const jwtMiddleware = require('../middleware/jwtMiddleware'); 

const router = express.Router();

// Create a job post
router.post('/create',jwtMiddleware, createJobPost);

// Get all job posts
router.get('/all',getAllJobPosts);

// Get jobs by user
router.get('/user/:userId',jwtMiddleware, getJobPostsByUser);

// Get a job post by ID
router.get('/:id', jwtMiddleware,getJobPostById);

// Apply for a job post
router.post('/apply/:id',jwtMiddleware, applyForJobPost);

// Get applicants for a job post
router.get('/applicants/:id',jwtMiddleware,getApplicantsForJobPost);

//Get Applicants status on all jobs
router.get('/user/:userId/applications/statuses', jwtMiddleware,getUserApplicationStatuses);

//Get Applicant status on specific job post
router.get('/user/:userId/jobpost/:jobPostId/application/status', jwtMiddleware,getApplicationStatusForJobPost);

// Update applicant status
router.put('/:jobId/applicant/:applicantId/status',jwtMiddleware,updateApplicantStatus);

// Update a job post
router.put('/update/:id',jwtMiddleware, updateJobPost);

// get job by uniqueid
router.get('/unique/:jobUniqueId',jwtMiddleware, getJobsByJobUniqueId);

// Delete a job post
router.delete('/delete/:id',jwtMiddleware, deleteJobPost);

module.exports = router;
