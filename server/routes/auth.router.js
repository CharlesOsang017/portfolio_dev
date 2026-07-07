import express from 'express';
import { getMe, login, register, updateProfile } from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.put('/profile', updateProfile);



export default router;