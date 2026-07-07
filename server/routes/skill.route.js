import express from 'express';
import { allSkills, createSkill, deleteSkill, updateSkill } from '../controllers/skill.controller.js';

const router = express.Router();

router.get('/', allSkills);
router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id',deleteSkill);

export default router;
