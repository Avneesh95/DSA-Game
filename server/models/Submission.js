const mongoose = require('mongoose');

const KeyResultSchema = new mongoose.Schema(
  {
    keyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    keyType: { type: String },
    passed: { type: Boolean, required: true },
    isHidden: { type: Boolean, default: false },
    // Only populated for non-hidden keys so we never leak hidden expected output.
    actualOutput: { type: String, default: null },
    runtimeMs: { type: Number, default: null },
  },
  { _id: false }
);

const SubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    doorNumber: { type: Number, required: true },

    code: { type: String, required: true },
    language: { type: String, enum: ['java', 'python', 'cpp', 'c'], default: 'java' },

    mode: { type: String, enum: ['run', 'submit'], required: true },

    status: {
      type: String,
      enum: ['pending', 'running', 'accepted', 'wrong_answer', 'runtime_error', 'compile_error', 'timeout'],
      default: 'pending',
    },

    keyResults: [KeyResultSchema],
    keysCollectedCount: { type: Number, default: 0 },
    totalKeys: { type: Number, default: 0 },

    executionTime: { type: Number, default: null }, // ms
    memory: { type: Number, default: null }, // KB
    hintsUsedAtSubmission: { type: Number, default: 0 },

    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SubmissionSchema.index({ userId: 1, problemId: 1, submittedAt: -1 });

module.exports = mongoose.model('Submission', SubmissionSchema);
