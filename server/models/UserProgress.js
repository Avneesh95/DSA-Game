const mongoose = require('mongoose');

// Per-user, per-door progress record. Separate from User so we can
// query/aggregate progress (leaderboards, analytics) without loading
// full user documents.
const UserProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doorNumber: { type: Number, required: true, min: 1, max: 100 },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },

    status: {
      type: String,
      enum: ['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'],
      default: 'AVAILABLE',
    },

    keysCollected: [{ type: mongoose.Schema.Types.ObjectId }], // Key subdocument ids
    totalKeys: { type: Number, default: 0 },

    attempts: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    bestExecutionTimeMs: { type: Number, default: null },

    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },

    xpEarned: { type: Number, default: 0 },
    patternGuessCorrect: { type: Boolean, default: null },
  },
  { timestamps: true }
);

UserProgressSchema.index({ userId: 1, doorNumber: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);
