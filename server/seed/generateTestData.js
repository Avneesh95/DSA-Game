/**
 * Dev-time script (NOT run during normal `npm run seed` / deploy) that
 * upgrades every problem's authored `keys` into the canonical
 * argsJson/expectedJson format the judge needs, and writes the result to
 * generatedTestData.json. Requires javac/java on PATH (used to compute
 * ground truth for synthesized inputs — see testDataNormalizer.js).
 *
 * Run again any time a problem's `keys`, starter signature, or reference
 * solution changes:
 *   node server/seed/generateTestData.js
 */
const fs = require('fs');
const path = require('path');
const { normalizeProblem } = require('./testDataNormalizer');

const problemsData = [
  ...require('./problemsData'),
  ...require('./problemsData11to40'),
  ...require('./problemsData41to70'),
  ...require('./problemsData71to100'),
];

async function main() {
  const out = {};
  const allStats = [];
  let totalLiteral = 0, totalSynth = 0, totalDropped = 0, totalKeys = 0;

  for (const problem of problemsData) {
    totalKeys += problem.keys.length;
    const { keys, stats } = await normalizeProblem(problem);
    out[problem.doorNumber] = keys;
    allStats.push(stats);
    totalLiteral += stats.literal || 0;
    totalSynth += stats.synthesized || 0;
    totalDropped += stats.dropped || 0;
    const kept = keys.length;
    const flag = kept < problem.keys.length ? '  <-- some keys dropped' : '';
    process.stdout.write(`door ${String(problem.doorNumber).padStart(3)} ${problem.title.padEnd(45)} kept ${kept}/${problem.keys.length}${flag}\n`);
  }

  fs.writeFileSync(path.join(__dirname, 'generatedTestData.json'), JSON.stringify(out, null, 0));

  console.log('\n--- summary ---');
  console.log(`total keys authored: ${totalKeys}`);
  console.log(`literal (parsed directly): ${totalLiteral}`);
  console.log(`synthesized (verified via reference solution / canonicalization): ${totalSynth}`);
  console.log(`dropped (could not be made executable): ${totalDropped}`);

  const withDrops = allStats.filter((s) => s.dropped > 0);
  if (withDrops.length) {
    console.log('\n--- doors with dropped keys ---');
    for (const s of withDrops) {
      console.log(`door ${s.doorNumber}: dropped ${s.dropped}`);
      for (const r of s.reasons) console.log(`  ${r}`);
    }
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
