const mongoose = require('mongoose');

const ApplicantStatus = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPost',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'selected', 'rejected', 'on hold'],
    default: 'applied',
  },
  employer_doc:{
    type: String,
  },
  employee_doc:{
    type: String,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  autoConfirmed: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ApplicantStatus', ApplicantStatus);
