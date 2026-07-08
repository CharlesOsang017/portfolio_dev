import mongoose from 'mongoose';

const VALID_CATEGORIES = [
  'Programming Languages',
  'DevOps & Tools',
  'JavaScript Libraries & Frameworks',
  'Web Frameworks',
  'Backend as a Service',
  'Databases',
  'Testing'
];

const skillSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true,
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: {
      values: VALID_CATEGORIES,
      message: '{VALUE} is not a valid skill category'
    },
    default: 'Programming Languages' 
  },
  icon: { 
    type: String, 
    default: ''
  },
  order: {
    type: Number,
    default: 0 
  }
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;