import express from 'express';
import { getInquiries, submitInquiry, updateInquiry, deleteInquiry } from '../controllers/Inquiry.controller.js';


const router = express.Router();

router.post('/', submitInquiry);
router.get('/', getInquiries);
router.put('/:id', updateInquiry);
router.delete('/:id', deleteInquiry);

export default router;
