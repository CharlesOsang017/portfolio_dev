const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: { 
    type: String, 
    trim: true, 
    lowercase: true, 
    default: '' 
  },
  location: { 
    type: String, 
    trim: true, 
    default: '' 
  },
  linkedinUrl: { 
    type: String, 
    trim: true, 
    default: '' 
  },
  githubUrl: { 
    type: String, 
    trim: true, 
    default: '' 
  },
  availability: { 
    type: String, 
    enum: ['open', 'unavailable', 'selective'], 
    default: 'open' 
  },
  customStatusMessage: { 
    type: String, 
    trim: true, 
    default: '' 
  },
  timezone: { 
    type: String, 
    trim: true, 
    default: 'Africa/Nairobi' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);