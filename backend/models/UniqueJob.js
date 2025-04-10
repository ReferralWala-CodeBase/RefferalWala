const mongoose = require('mongoose');
const { Schema } = mongoose;

const UniqueJobSchema = new Schema({
  jobUniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  latestJobPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPost',
    required: true,
  },
  jobRole: {
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
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  workMode: {
    type: String,
    required: false,
  },
  employmentType: {
    type: String,
    required: false,
  },
  ctc: {
    type: String,
    required: false,
  },
  jobLink: {
    type: String,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('UniqueJob', UniqueJobSchema);
