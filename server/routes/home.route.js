import express from 'express';
import { getHomeContent, updateHomeContent, updateHomeView } from '../controllers/home.controller.js';



const router = express.Router();


router.get('/', getHomeContent);
router.put('/',updateHomeContent);
router.post('/view', updateHomeView);

export default router;
