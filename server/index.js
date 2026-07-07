import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/home', require('./routes/home'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/assets', require('./routes/assets'));


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message});
});


