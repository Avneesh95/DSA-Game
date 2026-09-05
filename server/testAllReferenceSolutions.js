const p1 = require('./seed/problemsData');
const p2 = require('./seed/problemsData11to40');
const p3 = require('./seed/problemsData41to70');
const p4 = require('./seed/problemsData71to100');
const allProblems = [...p1, ...p2, ...p3, ...p4];
const testData = require('./seed/generatedTestData.json');
const { runAgainstKeys } = require('./execution/executionService');

async function testAll() {
  console.log(`Checking ${allProblems.length} problems for reference solutions...`);
  const withRef = allProblems.filter(p => p.referenceSolution && p.referenceSolution.code);
  console.log(`Found ${withRef.length} problems with referenceSolution.`);

  const failed = [];

  for (const p of withRef) {
    const keys = testData[p.doorNumber] || p.keys;
    const lang = p.referenceSolution.language || 'java';
    const code = p.referenceSolution.code;

    try {
      const result = await runAgainstKeys({ code, language: lang, keys, problem: p });
      const failedKeys = result.keyResults.filter(k => !k.passed);
      if (failedKeys.length > 0 || result.status !== 'accepted') {
        console.error(`❌ Door ${p.doorNumber} (${p.title}) FAILED: status=${result.status}, ${failedKeys.length}/${keys.length} keys failed.`);
        failed.push({ doorNumber: p.doorNumber, title: p.title, status: result.status, failedKeys });
      } else {
        console.log(`✅ Door ${p.doorNumber} (${p.title}) PASSED all ${keys.length} keys.`);
      }
    } catch (err) {
      console.error(`💥 Door ${p.doorNumber} (${p.title}) EXCEPTION:`, err.message);
      failed.push({ doorNumber: p.doorNumber, title: p.title, error: err.message });
    }
  }

  console.log(`\nResults: ${withRef.length - failed.length}/${withRef.length} passed.`);
  if (failed.length > 0) {
    console.log('Failed details:', JSON.stringify(failed, null, 2));
  }
}

testAll().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
