const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    default: 'Programming Languages' 
  },
  icon: { 
    type: String, 
    default: '' 
  },
  order: { 
    type: Number, 
    default: 0 
  },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);