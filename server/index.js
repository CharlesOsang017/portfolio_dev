import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDb } from './config/db.js';
import authRoutes from './routes/auth.router.js';
import homeRoutes from './routes/home.route.js';
import projectRoutes from './routes/project.route.js';
import experienceRoutes from './routes/experience.route.js'
import skillRoutes from './routes/skill.route.js';
import contactRoutes from './routes/contact.route.js';
import inquiryRoutes from './routes/inquiry.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT
// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home',  homeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/inquiries', inquiryRoutes);
// app.use('/api/assets', require('./routes/assets'));


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message});
});


app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
  connectToDb()
});