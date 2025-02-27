const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Education schema
const EducationSchema = new mongoose.Schema({
  level: {
    type: String,
  },
  schoolName: {
    type: String,
  },
  yearOfPassing: {
    type: Number,
  },
});

// Experience schema
const ExperienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  position: {
    type: String,
  },
  yearsOfExperience: {
    type: Number,
  },
});

const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
  },
  details: {
    type: String,
  },
  repoLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
});

// Present Company schema
const PresentCompanySchema = new mongoose.Schema({
  role: {
    type: String,
  },
  companyName: {
    type: String,
  },
  companyLogoUrl: {
    type: String,  
  },
  companyEmail: {
    type: String,
  },
  CompanyEmailVerified: {
    type: Boolean,
    default: false
  },
  yearsOfExperience: {
    type: Number,
  },
  location: {
    type: String,
  },
  currentCTC: {
    type: Number,
  },
  otp: {
    type: String,
    default: null,
  },
});

// Preferences schema
const PreferencesSchema = new mongoose.Schema({
  preferredCompanyName: {
    type: String,
  },
  preferredCompanyURL:{
    type: String,
  },
  preferredPosition: {
    type: String,
  },
  expectedCTCRange: {
    type: String,
  },
});

// Links schema
const LinksSchema = new mongoose.Schema({
  github: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  other: {
    type: String,
  },
});

// Combined User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: Number,
    unique: false,
    default: null,
  },
  mobileNumberVerified: {
    type: Boolean,
    default: false
  },
  googleId: { type: String },
  password: {
    type: String,
    // required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  isOTPVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  aboutMe: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  presentCompany: PresentCompanySchema,
  education: [EducationSchema],
  experience: [ExperienceSchema],
  project: [ProjectSchema],
  skills: {
    type: [String],
  },
  achievements: {
    type: [String],
  },
  preferences: [PreferencesSchema],
  links: LinksSchema,
  resume: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // New fields for followers and following
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for followers
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for following
  }],
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost',
    },
  ],
  WishlistJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPost'
  }],  
  isActivate:{
    type: Boolean,
    default: true
  },
  getreferral: {
    type: Number, // no of time he become employee 
    default: 0
  },
  givereferral: {
    type: Number,  // user hire another 
    default: 0
  },  
  preferredSectors: [
    {
      type: String, 
    },
  ],
});

// userSchema.js

userSchema.methods.calculateProfileCompletion = function () {
  let totalWeight = 0;
  let completedWeight = 0;

  // Basic Info (30%)
  const basicFields = ["firstName", "lastName", "email", "mobileNumber", "profilePhoto", "aboutMe"];
  totalWeight += 30;
  completedWeight += basicFields.filter(field => this[field]).length * (30 / basicFields.length);

  // Education (15%)
  totalWeight += 15;
  if (this.education.length > 0) completedWeight += 15;

  // Experience (15%)
  totalWeight += 15;
  if (this.experience.length > 0) completedWeight += 15;

  // Projects (10%)
  totalWeight += 10;
  if (this.project.length > 0) completedWeight += 10;

  // Skills (5%) - If any skill is written
  totalWeight += 5;
  if (this.skills.length > 0) completedWeight += 5;

  // Links (5%) - At least one important link
  totalWeight += 5;
  if (
    this.links &&
    (this.links.github || this.links.linkedin || this.links.portfolio)
  ) {
    completedWeight += 5;
  }

  // Resume (10%)
  totalWeight += 10;
  if (this.resume) completedWeight += 10;

  // Present Company Email Verification (10%)
  totalWeight += 10;
  if (this.presentCompany && this.presentCompany.companyEmailVerified) completedWeight += 10;

  // Calculate percentage
  return Math.round((completedWeight / totalWeight) * 100);
};

// userSchema.js



const User = mongoose.model('User', userSchema);

module.exports = User;
