import mongoose from "mongoose";

const researchSchema = new mongoose.Schema({
  title: String,
  description: String,
  skillsRequired: [String],
  membersNeeded: Number,
  membersJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  duration: String, // or { start: Date, end: Date }
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  reachoutemail: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const Research = mongoose.model('Research', researchSchema);

export default Research