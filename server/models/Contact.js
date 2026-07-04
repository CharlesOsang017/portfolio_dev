const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  availability: { type: String, enum: ['open', 'unavailable', 'selective'], default: 'open' },
  customStatusMessage: { type: String, default: '' },
  timezone: { type: String, default: 'America/Los_Angeles' },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
