import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    default: '' 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    default: null 
  },
  isPresent: { 
    type: Boolean, 
    default: false 
  },
  responsibilities: [{
    type: String
  }],
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;