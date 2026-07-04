const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'replied', 'archived'], default: 'unread' },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
