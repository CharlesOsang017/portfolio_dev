import express from 'express';
import { getHomeContent, updateHomeContent, updateHomeView, downloadResume } from '../controllers/home.controller.js';



const router = express.Router();


router.get('/', getHomeContent);
router.put('/', updateHomeContent);
router.post('/view', updateHomeView);
router.get('/resume/download', downloadResume);

export default router;
