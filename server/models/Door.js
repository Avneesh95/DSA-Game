const mongoose = require('mongoose');

// Door is deliberately separate from Problem: Problem holds the DSA
// content, Door holds game-map metadata (world grouping, unlock rules,
// admin lock/unlock toggle). Keeping these separate lets the admin
// panel manage map structure without touching problem content.
const DoorSchema = new mongoose.Schema(
  {
    doorNumber: { type: Number, required: true, unique: true, min: 1, max: 100 },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },

    world: { type: String, required: true }, // e.g. "World 1 — Arrays"
    worldOrder: { type: Number, required: true }, // 1-10, 11 = final dungeon

    isBossDoor: { type: Boolean, default: false },

    // Sequential unlock rule: door N requires door N-1 completed
    // (door 1 has no prerequisite). Admin can override.
    requiresDoorNumber: { type: Number, default: null },

    isLockedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Note: doorNumber already gets a unique index from `unique: true` above —
// no need to declare it again here.
DoorSchema.index({ worldOrder: 1 });

module.exports = mongoose.model('Door', DoorSchema);
