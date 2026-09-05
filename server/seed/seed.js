require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Problem = require('../models/Problem');
const Door = require('../models/Door');
const Achievement = require('../models/Achievement');

const problemsData = [
  ...require('./problemsData'), // Doors 1-10
  ...require('./problemsData11to40'), // Doors 11-40
  ...require('./problemsData41to70'), // Doors 41-70
  ...require('./problemsData71to100'), // Doors 71-100
];
const achievementsData = require('./achievementsData');
const { expandStarterCode } = require('./starterCodeGenerator');

// Canonical judge test data (argsJson/expectedJson per key), generated
// ahead of time by `node server/seed/generateTestData.js` — see that file
// and testDataNormalizer.js for how it's produced. Falls back to the
// authored (human-readable-only) keys if it hasn't been generated yet,
// in which case those doors just won't be judgeable until it's run.
let generatedTestData = {};
try {
  generatedTestData = require('./generatedTestData.json');
} catch (e) {
  console.warn('[SEED] generatedTestData.json not found — run `node server/seed/generateTestData.js` first for real judging. Seeding with un-judgeable keys for now.');
}

// World groupings for the full 100-door map.
const WORLD_RANGES = [
  { world: 'World 1 — Arrays', worldOrder: 1, start: 1, end: 15 },
  { world: 'World 2 — Hashing', worldOrder: 2, start: 16, end: 22 },
  { world: 'World 3 — Two Pointers', worldOrder: 3, start: 23, end: 29 },
  { world: 'World 4 — Sliding Window', worldOrder: 4, start: 30, end: 36 },
  { world: 'World 5 — Binary Search', worldOrder: 5, start: 37, end: 44 },
  { world: 'World 6 — Linked List', worldOrder: 6, start: 45, end: 52 },
  { world: 'World 7 — Stack & Queue', worldOrder: 7, start: 53, end: 60 },
  { world: 'World 8 — Recursion & Backtracking', worldOrder: 8, start: 61, end: 68 },
  { world: 'World 9 — Trees & BST', worldOrder: 9, start: 69, end: 80 },
  { world: 'World 10 — Graphs', worldOrder: 10, start: 81, end: 90 },
  { world: 'Final Dungeon — Dynamic Programming & Advanced', worldOrder: 11, start: 91, end: 100 },
];

function getWorldForDoor(doorNumber) {
  return WORLD_RANGES.find((w) => doorNumber >= w.start && doorNumber <= w.end);
}

// Guards against a typo/gap/duplicate across the four hand-authored
// problem data files before anything touches the database.
function validateProblemSet(problems) {
  const doorNumbers = problems.map((p) => p.doorNumber).sort((a, b) => a - b);
  const expected = Array.from({ length: 100 }, (_, i) => i + 1);
  const missing = expected.filter((n) => !doorNumbers.includes(n));
  const seen = new Set();
  const duplicates = doorNumbers.filter((n) => (seen.has(n) ? true : (seen.add(n), false)));

  if (missing.length > 0) {
    throw new Error(`[SEED] Missing door numbers: ${missing.join(', ')}`);
  }
  if (duplicates.length > 0) {
    throw new Error(`[SEED] Duplicate door numbers: ${duplicates.join(', ')}`);
  }
  if (doorNumbers.length !== 100) {
    throw new Error(`[SEED] Expected exactly 100 problems, found ${doorNumbers.length}`);
  }
}

async function seed() {
  validateProblemSet(problemsData);
  await connectDB();

  console.log('[SEED] Clearing existing Problem, Door, and Achievement collections...');
  await Promise.all([Problem.deleteMany({}), Door.deleteMany({}), Achievement.deleteMany({})]);

  console.log(`[SEED] Inserting ${problemsData.length} problems (expanding to Java/Python/C++/C starters)...`);
  const problemsWithAllLanguages = problemsData.map((p) => ({
    ...p,
    starterCode: expandStarterCode(p),
    keys: generatedTestData[p.doorNumber] || p.keys,
  }));
  const insertedProblems = await Problem.insertMany(problemsWithAllLanguages);

  console.log('[SEED] Creating door map entries...');
  const doorDocs = insertedProblems.map((problem) => {
    const worldInfo = getWorldForDoor(problem.doorNumber);
    return {
      doorNumber: problem.doorNumber,
      problem: problem._id,
      world: worldInfo ? worldInfo.world : 'Unassigned',
      worldOrder: worldInfo ? worldInfo.worldOrder : 0,
      isBossDoor: problem.isBoss,
      requiresDoorNumber: problem.doorNumber === 1 ? 0 : problem.doorNumber - 1,
    };
  });
  await Door.insertMany(doorDocs);

  console.log(`[SEED] Inserting ${achievementsData.length} achievements...`);
  await Achievement.insertMany(achievementsData);

  // Optional: create a demo admin account for exploring the admin panel locally.
  const adminEmail = 'admin@dsa100doors.dev';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    console.log('[SEED] Creating demo admin account (admin@dsa100doors.dev / Admin1234)...');
    await User.create({
      name: 'Dungeon Master',
      email: adminEmail,
      password: 'Admin1234',
      role: 'admin',
    });
  }

  console.log('[SEED] Done. All 100 doors are fully playable in Java, Python, C++, and C.');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[SEED] Failed:', err);
  process.exit(1);
});
