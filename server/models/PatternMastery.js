const mongoose = require('mongoose');

const PatternMasterySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pattern: { type: String, required: true }, // e.g. "Two Pointer", "Sliding Window"

    problemsSolved: { type: Number, default: 0 },
    patternGuessesCorrect: { type: Number, default: 0 },
    patternGuessesTotal: { type: Number, default: 0 },

    accuracy: { type: Number, default: 0 }, // patternGuessesCorrect / patternGuessesTotal
    masteryPercentage: { type: Number, default: 0 }, // 0-100, drives topic mastery bars
  },
  { timestamps: true }
);

PatternMasterySchema.index({ userId: 1, pattern: 1 }, { unique: true });

module.exports = mongoose.model('PatternMastery', PatternMasterySchema);
