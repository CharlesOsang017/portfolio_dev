import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'The email address is already taken' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const token = generateToken(user._id);
  res.status(201).json({ message: "User created successfully", user, token });
}

// POST /api/auth/login
export const login = async (req, res) => {
    const {email, password} = req.body;    
    const user = await User.findOne({email});    
    if (!user) return res.status(404).json({message: 'User not found'})
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(400).json({message: 'Invalid password'})
    const token = generateToken(user._id);
    return res.status(200).json({message: 'Login successful', user, token})  
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({ user: updated, token: generateToken(updated._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
