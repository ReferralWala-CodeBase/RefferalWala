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
  getJobPostsByUser,
  withdrawApplication,
  updateEmployeeDocument,
  addJobToWishlist, removeJobFromWishlist, getWishlistJobs
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
router.get('/:id', getJobPostById);

// Apply for a job post
router.post('/apply/:id',jwtMiddleware, applyForJobPost);

// Withdraw applyiction
router.post('/withdraw/:id',jwtMiddleware, withdrawApplication);

// Get applicants for a job post
router.get('/applicants/:id',jwtMiddleware,getApplicantsForJobPost);

//Get Applicants status on all jobs
router.get('/user/:userId/applications/statuses', jwtMiddleware,getUserApplicationStatuses);

//Get Applicant status on specific job post
router.get('/user/:userId/jobpost/:jobPostId/application/status', jwtMiddleware,getApplicationStatusForJobPost);

// Update applicant status
router.put('/:jobId/applicant/:applicantId/status',jwtMiddleware,updateApplicantStatus);

// Upload verification document 
router.put("/:jobId/applicant/:userId/document", jwtMiddleware, updateEmployeeDocument);

// Update a job post
router.put('/update/:id',jwtMiddleware, updateJobPost);

// get job by uniqueid
router.get('/unique/:jobUniqueId',jwtMiddleware, getJobsByJobUniqueId);

// Delete a job post
router.delete('/delete/:id', jwtMiddleware, deleteJobPost);

// Route to add a job to the wishlist
router.post('/wishlist/add', jwtMiddleware, addJobToWishlist);

// Route to remove a job from the wishlist
router.delete('/wishlist/remove',jwtMiddleware, removeJobFromWishlist);

// Route to get all wishlist jobs
router.get('/wishlist/:userId',jwtMiddleware, getWishlistJobs);

module.exports = router;
