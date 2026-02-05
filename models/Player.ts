import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gameCode: { type: String, required: true },
  teamId: { type: String, default: null }, // null means waiting/unassigned
  teamName: { type: String, default: null }, // for easy reference
  isConnected: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

// Index for faster queries
PlayerSchema.index({ gameCode: 1 });
PlayerSchema.index({ teamId: 1 });
PlayerSchema.index({ id: 1 });

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);