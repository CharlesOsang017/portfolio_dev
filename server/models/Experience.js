const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  // Changed from String to Date for robust sorting and date manipulation
  startDate: { type: Date, required: true }, 
  endDate: { type: Date, default: null }, // Null is cleaner than an empty string for Date types
  isPresent: { type: Boolean, default: false },
  responsibilities: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);