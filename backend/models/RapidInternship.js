const mongoose = require('mongoose');

const rapidInternshipSchema = new mongoose.Schema({
  internshipId: String, 
  title: String, 
  url: String, 
  referenceId: String, 
  posterId: String, 
  company: {
    name: String, 
    logo: String, 
    url: String, 
    staffCountRange: String, 
  },
  location: String, 
  type: String, 
  postDate: String, 
  benefits: String, 
  dateFetched: { type: Date, default: Date.now }, 
});

const RapidInternship = mongoose.model('RapidInternship', rapidInternshipSchema);

module.exports = RapidInternship;