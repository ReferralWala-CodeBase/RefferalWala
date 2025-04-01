const mongoose = require('mongoose');

const rapidJobSchema = new mongoose.Schema({
  jobId: String, 
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

const RapidJob = mongoose.model('RapidJob', rapidJobSchema);

module.exports = RapidJob;