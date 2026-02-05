import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gameCode: { type: String, required: true },
  score: { type: Number, default: 0 },
  strikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

// Index for faster queries
TeamSchema.index({ gameCode: 1 });
TeamSchema.index({ id: 1 });

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);