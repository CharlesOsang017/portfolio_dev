import mongoose from 'mongoose';

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

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;