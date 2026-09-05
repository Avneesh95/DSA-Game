const generatedTestData = require('./seed/generatedTestData.json');
const p1 = require('./seed/problemsData');
const p2 = require('./seed/problemsData11to40');
const p3 = require('./seed/problemsData41to70');
const p4 = require('./seed/problemsData71to100');
const allProblems = [...p1, ...p2, ...p3, ...p4];

console.log('Inspecting test keys across all 100 doors in generatedTestData.json:');
let totalDoors = Object.keys(generatedTestData).length;
console.log(`Total doors in generatedTestData.json: ${totalDoors}`);

const suspiciousKeys = [];

for (const p of allProblems) {
  const keys = generatedTestData[p.doorNumber];
  if (!keys) {
    suspiciousKeys.push({ door: p.doorNumber, title: p.title, issue: 'No keys in generatedTestData' });
    continue;
  }

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    // Check if argsJson is empty or unparseable
    if (!k.argsJson) {
      suspiciousKeys.push({ door: p.doorNumber, title: p.title, keyIdx: i, issue: 'Missing argsJson', input: k.input });
    }
    // Check if expectedJson is missing or weird
    if (k.expectedJson === undefined || k.expectedJson === null || k.expectedJson === '') {
      suspiciousKeys.push({ door: p.doorNumber, title: p.title, keyIdx: i, issue: 'Missing expectedJson', expected: k.expectedOutput });
    }
    // Check if expectedJson contains descriptive string like "rotated array" or "sorted array" or "no output"
    if (typeof k.expectedJson === 'string' && (
      k.expectedJson.toLowerCase().includes('array') ||
      k.expectedJson.toLowerCase().includes('sorted') ||
      k.expectedJson.toLowerCase().includes('elements') ||
      k.expectedJson.toLowerCase().includes('matrix') ||
      k.expectedJson.toLowerCase().includes('tree') ||
      k.expectedJson.toLowerCase().includes('list')
    )) {
      suspiciousKeys.push({ door: p.doorNumber, title: p.title, keyIdx: i, issue: 'Descriptive text in expectedJson', expectedJson: k.expectedJson, expectedOutput: k.expectedOutput });
    }
  }
}

console.log(`Found ${suspiciousKeys.length} suspicious keys across all doors.`);
if (suspiciousKeys.length > 0) {
  console.log(JSON.stringify(suspiciousKeys, null, 2));
}
