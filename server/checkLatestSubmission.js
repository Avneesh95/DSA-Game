require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Submission = require('./models/Submission');
const Problem = require('./models/Problem');

async function checkLatest() {
  await connectDB();
  const latestSubs = await Submission.find().sort({ createdAt: -1 }).limit(5).populate('problemId', 'title doorNumber');
  console.log(`Found ${latestSubs.length} recent submissions:\n`);

  for (const s of latestSubs) {
    console.log(`----------------------------------------`);
    console.log(`Door ${s.doorNumber} (${s.problemId?.title}) | Lang: ${s.language} | Mode: ${s.mode} | Status: ${s.status}`);
    console.log(`Keys: ${s.keysCollectedCount}/${s.totalKeys} | Date: ${s.createdAt}`);
    console.log(`Code Submitted:\n${s.code}`);
    console.log(`Key Results:`);
    for (const kr of (s.keyResults || [])) {
      console.log(`  - Type: ${kr.keyType}, Passed: ${kr.passed}, Expected: ${kr.expectedOutput || 'hidden'}, Actual: ${kr.actualOutput}`);
    }
  }

  await mongoose.connection.close();
}

checkLatest().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
