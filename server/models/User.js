import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String, 
    default: '' 
  },
  role: {
    type: String, 
    enum: ['admin', 'user'], 
    default: 'admin' 
  },
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
export default User;
