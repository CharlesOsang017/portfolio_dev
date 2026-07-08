import mongoose from 'mongoose';

const viewLogSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, unique: true }
}, { timestamps: true });

// Optional: Automatically delete IP logs after 30 days if you want to reset unique views over time
// viewLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const ViewLog = mongoose.model('ViewLog', viewLogSchema);
export default ViewLog;