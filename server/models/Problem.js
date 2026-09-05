const mongoose = require('mongoose');

const ExampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

// A "Key" is what the game calls a test case.
const KeySchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    type: {
      type: String,
      enum: ['Basic Key', 'Edge Case Key', 'Large Input Key', 'Duplicate Case Key', 'Performance Key', 'Boundary Key'],
      required: true,
    },
    isHidden: { type: Boolean, default: false },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    // Machine-executable form of the test case, generated at seed time by
    // server/seed/testDataNormalizer.js (see that file for the canonical
    // JSON convention). `input`/`expectedOutput` above stay human-readable
    // for display; `argsJson`/`expectedJson` are what the judge actually
    // runs against. A key with no argsJson cannot be judged for real and
    // is skipped (never silently marked "passed").
    argsJson: { type: String },
    expectedJson: { type: String },
  },
  { _id: true }
);

const HintSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

// Structured visualization steps. The frontend visualization engine
// interprets these generically per `algorithm` type rather than us
// storing a video per problem.
const VisualizationStepSchema = new mongoose.Schema(
  {
    algorithm: { type: String, required: true }, // e.g. "binary-search", "two-pointer"
    steps: [{ type: mongoose.Schema.Types.Mixed, required: true }],
  },
  { _id: false }
);

const StarterCodeSchema = new mongoose.Schema(
  {
    language: { type: String, enum: ['java', 'python', 'cpp', 'c'], required: true },
    code: { type: String, required: true },
  },
  { _id: false }
);

const ProblemSchema = new mongoose.Schema(
  {
    doorNumber: { type: Number, required: true, unique: true, min: 1, max: 100 },
    title: { type: String, required: true, trim: true },
    topic: { type: String, required: true },
    pattern: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'boss'], required: true },

    description: { type: String, required: true },
    examples: [ExampleSchema],
    constraints: [{ type: String }],
    expectedComplexity: {
      time: { type: String, required: true },
      space: { type: String, required: true },
    },

    starterCode: [StarterCodeSchema],

    keys: [KeySchema],
    hints: [HintSchema],
    visualizationSteps: VisualizationStepSchema,
    solutionExplanation: { type: String },
    referenceSolution: {
      language: { type: String, default: 'java' },
      code: { type: String },
    },

    xp: { type: Number, required: true },
    isBoss: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Note: doorNumber already gets a unique index from `unique: true` above —
// no need to declare it again here.
ProblemSchema.index({ topic: 1, pattern: 1 });

module.exports = mongoose.model('Problem', ProblemSchema);
