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

// Present Company schema
const PresentCompanySchema = new mongoose.Schema({
  role: {
    type: String,
  },
  companyName: {
    type: String,
  },
  companyEmail:{
    type: String,
  },
  CompanyEmailVerified:{
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
    type: String,
    required: true,
    unique: true,
  },
  googleId: { type: String },
  password: {
    type: String,
    required: true,
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
  profileImg:{
    type: String,
  },
  presentCompany: PresentCompanySchema, 
  education: [EducationSchema],
  experience: [ExperienceSchema], 
  skills: {
    type: [String], 
  },
  achievements: {
    type: [String], 
  },
  preferences: PreferencesSchema, 
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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
