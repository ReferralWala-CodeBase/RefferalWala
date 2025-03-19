const JobPost = require('../models/JobPost');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ApplicantStatus = require('../models/ApplicantStatus');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const getEmailTemplate = (templateName) => {
  const templatePath = path.join(__dirname, '..', 'email_templates', templateName);
  try {
    return fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error('Failed to load email template');
  }
};
require('dotenv').config();

const sendEmailTemplate = async (recipient, subject, templateName, replacements = {}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // Load the email template
  let htmlContent = getEmailTemplate(templateName);

  // Replace placeholders in the template
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${key}}}`, 'g'); // e.g., replace {{name}}
    htmlContent = htmlContent.replace(regex, value);
  }

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: recipient,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};


// @route   POST /job/create
// @desc    Create a new job referral post
exports.createJobPost = async (req, res) => {
  try {
    const { userId, jobRole, jobUniqueId, endDate, companyName, companyLogoUrl, jobDescription, experienceRequired, location, workMode, employmentType, ctc, noOfReferrals, jobLink } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // to avoid duplicates job posting
    const duplicateJob = await JobPost.findOne({
      user: userId,
      jobUniqueId,
    });

    if (duplicateJob) {
      return res.status(400).json({ message: 'You have already posted this job.' });
    }

    // Create a new job post
    const newJobPost = new JobPost({
      user: userId,
      jobRole,
      companyName,
      companyLogoUrl,
      jobDescription,
      experienceRequired,
      location,
      workMode,
      jobUniqueId,
      endDate,
      employmentType,
      ctc,
      noOfReferrals,
      jobLink,
      endDate
    });

    // Save the job post
    await newJobPost.save();

    //To increatment the total job count 
    user.totalJobCount += 1;
    await user.save();

    // Populate followers of the user who created the job post
    const populatedUser = await User.findById(userId).populate('followers');

    // Send notifications to each follower
    populatedUser.followers.forEach(follower => {
      const notification = new Notification({
        user: follower._id,
        message: `${user.firstName} has posted a new job: ${jobRole} at ${companyName}`, // Changed title to jobRole
        post: newJobPost._id,
      });
      notification.save(); // Save the notification
    });

    // Respond with the newly created job post
    res.status(201).json(newJobPost);
  } catch (err) {
    console.error('Error creating job post:', err.message);
    res.status(500).send('Server Error');
  }
};


// @route   GET /job/all
// @desc    Get all job referral posts
exports.getAllJobPosts = async (req, res) => {
  try {
    const userId = req.headers['userid'];

    const currentDate = new Date();
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit per page
    const skip = (page - 1) * limit;

    const { locations, companies, experience, ctc, searchQuery } = req.query;

    let decodedLocations = [];
    if (locations) {
      // Check if locations is an array or a single string
      const locationArray = Array.isArray(locations) ? locations : [locations];

      // Decode and split locations into an array
      decodedLocations = locationArray
        .map(loc => decodeURIComponent(loc).split('%2C').map(locPart => locPart.trim()).join(', ')); // Format and decode each location
    }

    // Update all expired job posts to inactive
    await JobPost.updateMany(
      { endDate: { $lt: currentDate }, status: 'active' },
      { $set: { status: 'inactive' } }
    );

    

    // Build filter conditions based on query parameters
    let filterConditions = { status: 'active' };

    // Apply userId-based filtering if defined
    if (userId && userId !== 'null' && userId.trim() !== '') {
      filterConditions["reportUser.userId"] = { $ne: userId };
    }


    if (decodedLocations.length > 0) {
      // Ensure that the filter uses full location names (city, state)
      filterConditions.location = { $in: decodedLocations };
    }
    if (companies && companies.length) {
      filterConditions.companyName = { $in: companies.split(',') }; // If multiple companies are provided
    }

    if (experience) {
      // Map experience range to numeric boundaries
      const experienceRangeMapping = {
        "0-1 year": [0, 1],
        "2-5 years": [2, 5],
        "6-10 years": [6, 10],
        "10+ years": [10, Infinity]
      };

      const [minExp, maxExp] = experienceRangeMapping[experience] || [0, Infinity];

      // Adjust the filtering to handle the experience string properly
      filterConditions.experienceRequired = {
        $gte: minExp,  // Greater than or equal to the minimum experience
        $lte: maxExp   // Less than or equal to the maximum experience
      };
    }

    if (ctc) {
      // Assuming CTC is provided in ranges like "3-5 LPA"
      const [minCtc, maxCtc] = ctc.split('-').map(Number);
      filterConditions.ctc = { $gte: minCtc, $lte: maxCtc };
    }

    if (searchQuery) {
      filterConditions.$or = [
        { companyName: { $regex: searchQuery, $options: 'i' } },
        { jobRole: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Retrieve filtered and paginated job posts
    const jobPosts = await JobPost.find(filterConditions)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Get total active job count after applying filters (for frontend pagination)
    const totalJobs = await JobPost.countDocuments(filterConditions);

    res.status(200).json({
      jobPosts,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
    });
  } catch (err) {
    console.error('Error fetching job posts:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getJobPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Find job posts associated with the given userId
    const jobPosts = await JobPost.find({ user: userId })
      .populate('user', 'firstName lastName email profilePhoto getreferral givereferral appliedJobs') // Populate user details
      .exec();

    if (jobPosts.length === 0) {
      return res.status(404).json({ message: "Start building your dream team-post your first job!" });
    }

    res.status(200).json(jobPosts);
  } catch (err) {
    console.error('Error fetching job posts by user:', err.message);
    res.status(500).send('Server Error');
  }
};


// @route   GET /job/:id
// @desc    Get a job post by ID
exports.getJobPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await JobPost.findById(id).populate('user', 'firstName lastName email followers');

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    // Check and update the status if the endDate has passed
    if (jobPost.endDate < new Date() && jobPost.status === 'active') {
      jobPost.status = 'inactive';
      await jobPost.save();
    }

    res.status(200).json(jobPost);
  } catch (err) {
    console.error('Error fetching job post:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /job/apply/:id
// @desc    Apply for a job post

exports.applyForJobPost = async (req, res) => {
  try {
    const { id } = req.params; // Job Post ID
    const { userId } = req.body; // User ID applying for the job

    const jobPost = await JobPost.findById(id).populate('user', 'firstName lastName email');
    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    if (jobPost.user._id.toString() === userId) {
      return res.status(400).json({ message: 'You cannot apply for your own job' });
    }

    // Check if the user has already applied
    if (jobPost.applicants.includes(userId)) {
      return res.status(400).json({ message: 'User already applied for this job' });
    }

    // Add the applicant to the job post
    jobPost.applicants.push(userId);
    await jobPost.save();

    // Store the applicant status
    await ApplicantStatus.create({
      userId,
      jobPostId: jobPost._id,
      status: 'applied',
    });

    // Update user's applied jobs
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { appliedJobs: jobPost._id } }, // Use $addToSet to avoid duplicates
      { new: true } // Return the updated document
    );

    // Retrieve user info to get the first name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a notification for the job post creator
    const notification = new Notification({
      user: jobPost.user,
      message: `${user.firstName} has applied for your job: ${jobPost.jobRole} at ${jobPost.companyName}`,
      post: jobPost._id,
    });

    await notification.save();

    res.status(200).json({ message: 'Applied successfully', jobPost });
  } catch (err) {
    console.error('Error applying for job:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params; // Job Post ID
    const { userId } = req.body; // User ID withdrawing the application

    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
      return res.status(404).json({ msg: 'Job post not found' });
    }

    // Check if the user has applied
    if (!jobPost.applicants.includes(userId)) {
      return res.status(400).json({ msg: 'User has not applied for this job' });
    }

    // Remove the applicant from the job post
    jobPost.applicants = jobPost.applicants.filter((applicantId) => applicantId.toString() !== userId);
    await jobPost.save();

    // Remove the applicant status
    await ApplicantStatus.findOneAndDelete({ userId, jobPostId: jobPost._id });

    // Update user's applied jobs
    await User.findByIdAndUpdate(
      userId,
      { $pull: { appliedJobs: jobPost._id } }, // Use $pull to remove the job ID
      { new: true } // Return the updated document
    );

    // Optionally, create a notification for the job post creator
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const notification = new Notification({
      user: jobPost.user,
      message: `${user.firstName} has withdrawn their application for your job: ${jobPost.jobRole} at ${jobPost.companyName}`,
      post: jobPost._id,
    });

    await notification.save();

    res.status(200).json({ msg: 'Application withdrawn successfully', jobPost });
  } catch (err) {
    console.error('Error withdrawing application:', err.message);
    res.status(500).send('Server Error');
  }
};



// @route   GET /job/applicants/:id
// @desc    Get all applicants for a job post
exports.getApplicantsForJobPost = async (req, res) => {
  try {
    const { id } = req.params; // Job Post ID

    // Find the job post with the given ID
    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    // Fetch applicants and their statuses
    const applicants = await ApplicantStatus.find({ jobPostId: jobPost._id })
      .populate('userId', 'firstName lastName email profilePhoto'); // Populate user details

    // Return applicants along with their status
    res.status(200).json(applicants);
  } catch (err) {
    console.error('Error fetching applicants:', err.message);
    res.status(500).send('Server Error');
  }
};



// @route   PUT /job/update/:id
// @desc    Update a job post
exports.updateJobPost = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the job post by ID
    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    // Save the original userId to fetch followers later
    const userId = jobPost.user;

    // Update the job post with new data
    Object.assign(jobPost, updates);

    if (updates.status === "active") {
      jobPost.status = "active";
    }
    else {
      jobPost.status = "inactive";
    }
    await jobPost.save();

    // Fetch the user who created the job post and populate their followers
    const user = await User.findById(userId).populate('followers');

    // Prepare notifications to be sent to each follower
    const notificationPromises = user.followers.map(follower => {
      const notification = new Notification({
        user: follower._id,
        message: `${user.firstName} has updated a job post: ${jobPost.jobRole} at ${jobPost.companyName}`, // Ensure `companyName` is accessible
        post: jobPost._id,
      });
      return notification.save(); // Return the promise for saving the notification
    });

    // Wait for all notifications to be saved
    await Promise.all(notificationPromises);

    res.status(200).json({ message: 'Job post updated', jobPost });
  } catch (err) {
    console.error('Error updating job post:', err.message);
    res.status(500).send('Server Error');
  }
};



// @route   DELETE /job/delete/:id
// @desc    Delete a job post
exports.deleteJobPost = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Deleting job post with ID:', id);

    // Find the job post
    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    const jobRole = jobPost.jobRole;
    const companyName = jobPost.companyName;

    // Get all applicants for the job post
    const applicants = jobPost.applicants;

    // Notify each applicant about the job deletion and remove the job from their appliedJobs field
    const notificationsPromises = applicants.map(async (userId) => {
      // Create a notification for the user
      const notification = new Notification({
        user: userId,
        message: `The job "${jobRole}" at "${companyName}" you applied for has been deleted. You can explore other job postings on our platform.`,
        post: id,
      });

      // Save the notification
      await notification.save();

      // Remove the job from the user's appliedJobs field
      await User.updateOne(
        { _id: userId },
        { $pull: { appliedJobs: id } } // Pull the job ID from the appliedJobs array
      );
    });

    // Remove applicant status records associated with the job post
    const applicantStatusDeletePromise = ApplicantStatus.deleteMany({ jobPostId: id });

    // Clear the job post's applicants array
    jobPost.applicants = [];
    await jobPost.save();

    // Delete the job post from the database
    const jobPostDeletePromise = JobPost.deleteOne({ _id: id });

    // Wait for all operations to complete
    await Promise.all([...notificationsPromises, applicantStatusDeletePromise, jobPostDeletePromise]);

    res.status(200).json({ message: 'Job post deleted successfully, and notifications sent to applicants.' });
  } catch (err) {
    console.error('Error deleting job post:', err.message);
    res.status(500).send('Server Error');
  }
};



exports.getUserApplicationStatuses = async (req, res) => {
  try {
    const { userId } = req.params; // Extract user ID from parameters

    // Validate ObjectId format for userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Find all applicant statuses for the given user
    const applicantStatuses = await ApplicantStatus.find({ userId })
      .populate('jobPostId', 'jobRole companyName jobUniqueId location companyLogoUrl experienceRequired ctc workMode status') // Populate job details
      .exec();

    if (applicantStatuses.length === 0) {
      return res.status(404).json({ message: 'Make Your Career Dreams a Reality' });
    }

    // Return applicant statuses along with job details
    res.status(200).json(applicantStatuses);
  } catch (err) {
    console.error('Error fetching user application statuses:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getApplicationStatusForJobPost = async (req, res) => {
  try {
    const { userId, jobPostId } = req.params; // Extract user ID and job post ID from parameters

    // Validate ObjectId format for userId and jobPostId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobPostId)) {
      return res.status(400).json({ message: 'Invalid user ID or job post ID format' });
    }

    // Find the applicant status for the specified user and job post
    const applicantStatus = await ApplicantStatus.findOne({ userId, jobPostId })
      .populate('jobPostId', 'jobRole companyName jobUniqueId companyLogoUrl location workMode'); // Populate job details

    if (!applicantStatus) {
      return res.status(404).json({ message: 'No application found for this job post' });
    }

    // Return the applicant status along with job details
    res.status(200).json(applicantStatus);
  } catch (err) {
    console.error('Error fetching application status for job post:', err.message);
    res.status(500).send('Server Error');
  }
};


exports.getJobsByJobUniqueId = async (req, res) => {
  try {
    const { jobUniqueId } = req.params; // Extract jobUniqueId from parameters

    // Validate jobUniqueId (optional)
    if (!jobUniqueId) {
      return res.status(400).json({ message: 'Job Unique ID is required' });
    }

    // Find all job posts with the specified jobUniqueId
    const jobs = await JobPost.find({ jobUniqueId }).populate('user', 'firstName lastName email'); // Populate creator's info

    // Check if any jobs were found
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found with this unique ID' });
    }

    // Return the list of jobs with their details
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Error fetching jobs by unique ID:', err.message);
    res.status(500).send('Server Error');
  }
};


// @route   PUT /:jobId/applicant/:applicantId/status
// @desc    Update the status of an applicant for a specific job post


// @route   PUT /:jobId/applicant/:applicantId/status
// @desc    Update the status of an applicant for a specific job post
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params; // Extract job ID and applicant ID from the parameters
    const { status, uploadedFileUrl } = req.body; // New status for the applicant

    // Validate status
    const validStatuses = ['applied', 'selected', 'rejected', 'on hold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Validate ObjectId format for jobId and applicantId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    if (!mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Check if the job post exists
    const jobPost = await JobPost.findById(jobId);
    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    // Check if the applicant has been selected for the same jobUniqueId
    const existingSelection = await ApplicantStatus.findOne({
      userId: applicantId,
      status: 'selected',
      jobPostId: { $ne: jobId } // Exclude the current jobId
    }).populate('jobPostId');

    if (existingSelection && existingSelection.jobPostId.jobUniqueId === jobPost.jobUniqueId) {
      return res.status(400).json({ message: 'User is already selected for another job with the same unique ID.' });
    }

    // Find the applicant status for the specified job and applicant
    const applicantStatus = await ApplicantStatus.findOne({ userId: applicantId, jobPostId: jobId });
    if (!applicantStatus) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Update the status
    applicantStatus.status = status;
    applicantStatus.employer_doc = uploadedFileUrl;
    await applicantStatus.save();

    if (uploadedFileUrl) {
      // Find the user and increment the hiresCount by 1
      await User.findByIdAndUpdate(applicantId, {
        $inc: { getreferral: 1 } // Increment the hiresCount field by 1
      });
    }

    // Optionally, create a notification about the status change
    const user = await User.findById(applicantId);
    if (user) {
      const notification = new Notification({
        user: applicantId,
        message: `Your application status for ${jobPost.jobRole} at ${jobPost.companyName} has been updated to ${status}.`, post: jobPost._id,
      });

      await notification.save();
    }
    // Send email notification to the applicant
    try {
      await sendEmailTemplate(
        user.email,  // Recipient email
        'Your Application Status Has Changed',  // Email subject
        'status_update_template.html',  // Replace with your status update template filename
        {
          applicantName: user.firstName,
          jobRole: jobPost.jobRole,
          companyName: jobPost.companyName,
          status: status,
        }  // Replace placeholders with actual values
      );
      console.log(`Status update email sent to ${user.email}`);
    } catch (err) {
      console.error(`Failed to send status update email:`, err);
      return res.status(500).json({ error: 'Failed to send status update email.' });
    }

    res.status(200).json({ message: 'Applicant status updated successfully', applicantStatus });
  } catch (err) {
    console.error('Error updating applicant status:', err.message);
    res.status(500).send('Server Error');
  }
};

//Uploading Document 
exports.updateEmployeeDocument = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    const { documentUrl } = req.body;

    // Validate request
    if (!documentUrl) {
      return res.status(400).json({ message: "Document URL is required" });
    }

    // Find job and check if the applicant exists
    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicantStatus = await ApplicantStatus.findOne({ userId: userId, jobPostId: jobId });
    if (!applicantStatus) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Update document URL
    applicantStatus.employee_doc = documentUrl;
    await applicantStatus.save();

    const jobPosterUserId = job.user; // Assuming the job model has a field 'userId' referring to the poster's user jobPostId

    // Increment the referralsCount of the job poster by 1
    await User.findByIdAndUpdate(jobPosterUserId, {
      $inc: { givereferral: 1 } // Increment the givereferral by 1
    }, { new: true }); // The 'new' option returns the updated document

    res.status(200).json({ message: "Document updated successfully", documentUrl });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//removing from applicatant list
exports.removeFromJobApplicants = async (req, res) => {
  try {
    const { userId } = req.body; // The ID of the user to be removed from applicants list
    console.log(userId);

    // Find all JobPosts where the user is an applicant
    const jobPostsWithApplicant = await JobPost.find();

    // Loop through each job post and remove the user from applicants list if found
    for (const jobPost of jobPostsWithApplicant) {
      // Find the applicant's index by matching the userId with applicants array
      const applicantIndex = jobPost.applicants.findIndex(applicant =>
        applicant.toString() === userId // Convert ObjectId to string and compare
      );

      if (applicantIndex !== -1) {

        jobPost.applicants.pull(jobPost.applicants[applicantIndex]);  // Remove the userId from the applicants array

        // Save the updated job post
        await jobPost.save();
      }
    }

    res.status(200).json({ message: `User with ID ${userId} has been removed from all job applicants lists` });
  } catch (err) {
    console.error('Error removing user from job applicants list:', err.message);
    res.status(500).send('Server Error');
  }
};



//here struck
exports.withdrawFromJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.body; // Extract jobId from request body
    const userId = req.user.userId; // Assume authenticated user's ID is in req.user.userId

    // Step 1: Remove the user from the job's applicants list
    const jobPostUpdate = JobPost.updateOne(
      { _id: jobId },
      { $pull: { applicants: userId } }
    );

    // Step 2: Remove the job from the user's appliedJobs list
    const userUpdate = User.updateOne(
      { _id: userId },
      { $pull: { appliedJobs: jobId } }
    );

    // Step 3: Remove the entry from ApplicantStatus collection
    const applicantStatusDelete = ApplicantStatus.deleteOne({
      userId,
      jobPostId: jobId,
    });

    // Execute all the operations in parallel
    const [jobPostResult, userResult, deleteResult] = await Promise.all([
      jobPostUpdate,
      userUpdate,
      applicantStatusDelete,
    ]);

    // Response
    return res.status(200).json({ message: `User with ID ${userId} withdrawn from job ${jobId}.` });
  } catch (err) {
    console.error("Error withdrawing user from job applicants:", err.message);
    res.status(500).send("Server Error");
  }
};




// Add job to wishlist
exports.addJobToWishlist = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Validate job existence
    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Add job to wishlist if not already present
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.WishlistJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job is already in the wishlist' });
    }

    user.WishlistJobs.push(jobId);
    await user.save();

    res.status(200).json({ message: 'Job added to wishlist successfully', wishlist: user.WishlistJobs });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// Remove job from wishlist
exports.removeJobFromWishlist = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.WishlistJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job is not in the wishlist' });
    }

    user.WishlistJobs = user.WishlistJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.status(200).json({ message: 'Job removed from wishlist successfully', wishlist: user.WishlistJobs });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// Get wishlist jobs

exports.getWishlistJobs = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('WishlistJobs');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ wishlist: user.WishlistJobs });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
