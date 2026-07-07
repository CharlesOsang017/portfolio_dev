import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  senderName: { 
    type: String, 
    required: true 
  },
  senderEmail: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['unread', 'replied', 'archived'], 
    default: 'unread' },
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
