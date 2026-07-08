import mongoose from 'mongoose';

const homeContentSchema = new mongoose.Schema({
  mainHeadline: { type: String, default: "Hello, I'm John Developer" },
  subHeadline: { type: String, default: 'A Senior Software Engineer specializing in crafting high-performance distributed systems and elegant user interfaces.' },
  profileImage: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  resumeFile: { type: String, default: '' },
  metrics: {
    projectsCompleted: { type: Number, default: 0 },
    yearsExperience: { type: Number, default: 0 },
    openSourceContribs: { type: Number, default: 0 },
    happyClients: { type: Number, default: 0 },
  },
  portfolioViews: { type: Number, default: 0 },
}, { timestamps: true });


const HomeContent = mongoose.model('HomeContent', homeContentSchema);
export default HomeContent;
