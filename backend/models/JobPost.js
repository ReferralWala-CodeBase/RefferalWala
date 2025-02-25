const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobPostSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobRole: {
    type: String,
    required: false,
  },
  jobUniqueId: {
    type: String,
    required: false,
  },
  companyName: {
    type: String,
    required: false,
  },
  companyLogoUrl: {
    type: String,  
    required: false,
  },
  jobDescription: {
    type: String,
    required: false,
  },
  experienceRequired: {
    type: Number,
    required: false, // Optional
  },
  location: {
    type: String,
    required: false, // Optional
  },
  workMode: {
    type: String,
    required: false, // Optional
  },
  employmentType: {
    type: String,
    required: false, // Optional
  },
  ctc: {
    type: String,
    required: false, // Optional
  },
  noOfReferrals: {
    type: Number,
    required: false, // Optional
  },
  jobLink: {
    type: String,
    required: false, // Optional
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      status: {
        type: String,
        enum: ['applied', 'selected', 'rejected', 'on hold'],
        default: 'applied',
      },
    },
  ],
  
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  endDate: {
    type: Date, 
    required: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobPost', JobPostSchema);
