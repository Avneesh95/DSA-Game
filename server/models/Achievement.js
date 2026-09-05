const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "first_door"
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'trophy' },

    // Criteria is interpreted by the achievement-evaluation service,
    // kept generic so new achievement types don't require schema changes.
    criteria: {
      type: { type: String, required: true }, // e.g. "doors_completed", "streak", "topic_mastery"
      threshold: { type: Number, required: true },
      topic: { type: String, default: null },
    },

    xpBonus: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', AchievementSchema);
