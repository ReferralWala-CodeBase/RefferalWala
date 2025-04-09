const moment = require('moment');
const ApplicantStatus = require('../models/ApplicantStatus');
const JobPost = require('../models/JobPost');
const User = require('../models/User');

const autoConfirmReferrals = async () => {
  try {
    const threeDaysAgo = moment().subtract(3, 'days').toDate();

    const pending = await ApplicantStatus.find({
      status: 'selected',
      autoConfirmed: false,
      updatedAt: { $lte: threeDaysAgo },
      $or: [
        { employer_doc: { $exists: true, $ne: null }, employee_doc: { $exists: false } },
        { employee_doc: { $exists: true, $ne: null }, employer_doc: { $exists: false } }
      ]
    });

    for (const applicant of pending) {
      const jobPost = await JobPost.findById(applicant.jobPostId);

      await User.findByIdAndUpdate(applicant.userId, { $inc: { getreferral: 1 } });
      if (jobPost?.user) {
        await User.findByIdAndUpdate(jobPost.user, { $inc: { givereferral: 1 } });
      }

      applicant.autoConfirmed = true;
      await applicant.save();
    }

    console.log(`Auto-confirmed ${pending.length} applicants.`);
  } catch (err) {
    console.error("Cron error in auto-confirm:", err);
  }
};

module.exports = autoConfirmReferrals;
