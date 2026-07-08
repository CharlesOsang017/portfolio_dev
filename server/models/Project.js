import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Project title is required'], 
    trim: true 
  },
  category: { 
    type: String, 
    default: 'Web Development',
    trim: true 
  },
  techStack: {
    type: [String],
    default: []
  },
  description: { 
    type: String, 
    default: '',
    trim: true 
  },
  image: { 
    type: String, 
    default: '' 
  },
  liveUrl: { 
    type: String, 
    default: '' 
  },
  githubUrl: { 
    type: String, 
    default: '' 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  isInternal: { 
    type: Boolean, 
    default: false 
  },
  isPublished: { 
    type: Boolean, 
    default: true 
  },
}, { 
  timestamps: true 
});

const Project = mongoose.model('Project', projectSchema);
export default Project;