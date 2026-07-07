import express from 'express';
import { getExperience, createExperience, updateExperience, deleteExperience } from '../controllers/experience.controller.js';

const router = express.Router();


router.get('/', getExperience);
router.post('/', createExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

export default router;
