// models/Location.js

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true, // Ensure city is required
  },
  state: {
    type: String,
    required: true, // Ensure state is required
  },
});

module.exports = mongoose.model('Location', locationSchema);
