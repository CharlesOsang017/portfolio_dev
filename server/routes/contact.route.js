import express from 'express';
import { contacts, contactUpdate } from '../controllers/contact.controller.js';

const router = express.Router();

router.get('/', contacts);
router.put('/', contactUpdate);

export default router;
