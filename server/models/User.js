const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true, minlength: 8, select: false },

    // Progression
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    streak: { type: Number, default: 0, min: 0 },
    lastActiveDate: { type: Date, default: null },

    completedDoors: [{ type: Number }], // door numbers 1-100
    currentDoor: { type: Number, default: 1 },

    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],

    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// XP thresholds: simple increasing curve, level = floor(xp / 1000) + 1
UserSchema.methods.recalculateLevel = function recalculateLevel() {
  this.level = Math.floor(this.xp / 1000) + 1;
  return this.level;
};

module.exports = mongoose.model('User', UserSchema);
