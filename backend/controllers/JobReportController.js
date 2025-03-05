const JobReport = require('../models/JobReport');
const JobPost = require('../models/JobPost');

// Report a job
exports.reportJob = async (req, res) => {
  const { jobId, reportReason, userId } = req.body;

  if (!jobId || !reportReason || !userId) {
    return res.status(400).json({ message: 'Job ID, report reason, and user ID are required' });
  }

  try {
    const newReport = new JobReport({
      jobId,
      userId,
      reportReason,
    });

    // Save the report to the database
    await newReport.save();

    res.status(201).json({ message: 'Job reported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reported jobs for a specific user
exports.getReportedJobs = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const reportedJobs = await JobReport.find({ userId }).populate('jobId');  // Populating jobId field with JobPost details

    if (reportedJobs.length === 0) {
      return res.status(404).json({ message: 'No reported jobs found' });
    }

    res.status(200).json({ reportedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Remove a job report
exports.removeReport = async (req, res) => {
  const { jobId, userId } = req.body;

  if (!jobId || !userId) {
    return res.status(400).json({ message: 'Job ID and User ID are required' });
  }

  try {
    const report = await JobReport.findOneAndDelete({ jobId, userId });

    if (!report) {
      return res.status(404).json({ message: 'Report not found or already removed' });
    }

    res.status(200).json({ message: 'Report removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
