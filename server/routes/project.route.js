import express from 'express';
import { createProject, deleteProject, getProjectById, getPublicProjects, reorderProjects, updateProject } from '../controllers/project.controller.js';

const router = express.Router();

router.get('/', getPublicProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.put('/bulk/reorder', reorderProjects);

export default router;
