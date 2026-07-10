import mongoose from 'mongoose';

const VALID_CATEGORIES = [
  'JavaScript Libraries & Frameworks',
  'Backend as a Service',
  'Styling UI Components',
  'Databases',
  'DevOps & Tools',
  'Testing',
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
    default: 'JavaScript Libraries & Frameworks' 
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