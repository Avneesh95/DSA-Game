const fs = require('fs');
const path = require('path');
const p1 = require('./seed/problemsData');
const p2 = require('./seed/problemsData11to40');
const p3 = require('./seed/problemsData41to70');
const p4 = require('./seed/problemsData71to100');
const allProblems = [...p1, ...p2, ...p3, ...p4];

const generatedTestData = require('./seed/generatedTestData.json');
const { classifySignature, parseJavaSignature, isGenericallySupported } = require('./execution/signatureUtil');
const { buildPythonHarness } = require('./execution/harnesses/python');
const { buildJavaHarness } = require('./execution/harnesses/java');
const { buildCppHarness } = require('./execution/harnesses/cpp');
const { buildCHarness } = require('./execution/harnesses/c');
const { SPECIAL_CASE_DOORS, buildSpecialCaseHarness } = require('./execution/specialCases');
const { jsonValuesEqual } = require('./execution/executionService');

console.log('Testing all 100 doors...');
let testDataErrors = 0;
let harnessErrors = 0;

for (const p of allProblems) {
  const doorNum = p.doorNumber;
  const javaEntry = (p.starterCode || []).find((s) => s.language === 'java');
  if (!javaEntry) {
    console.error(`Door ${doorNum}: Missing Java starter code`);
    harnessErrors++;
    continue;
  }
  const sig = parseJavaSignature(javaEntry.code);
  const isSpecial = SPECIAL_CASE_DOORS.has(doorNum);
  const classified = sig ? classifySignature(sig) : null;

  // Verify harnesses generate without throwing
  try {
    if (isSpecial) {
      buildSpecialCaseHarness(doorNum, 'python', 'def foo(): pass');
      buildSpecialCaseHarness(doorNum, 'java', 'class Solution {}');
      buildSpecialCaseHarness(doorNum, 'cpp', 'class Solution {};');
      buildSpecialCaseHarness(doorNum, 'c', 'void foo() {}');
    } else {
      buildPythonHarness('def foo(): pass', classified);
      buildJavaHarness('class Solution {}', classified);
      buildCppHarness('class Solution {};', classified);
      buildCHarness('void foo() {}', classified, javaEntry.code);
    }
  } catch (err) {
    console.error(`Door ${doorNum} (${p.title}) Harness generation error:`, err.message);
    harnessErrors++;
  }

  // Verify test data
  const keys = generatedTestData[doorNum] || p.keys || [];
  if (!keys || keys.length === 0) {
    console.error(`Door ${doorNum}: No test keys found`);
    testDataErrors++;
  }

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!k.argsJson) {
      console.error(`Door ${doorNum} key ${i}: Missing argsJson`);
      testDataErrors++;
    } else {
      try {
        const parsed = JSON.parse(k.argsJson);
        if (!Array.isArray(parsed)) {
          console.error(`Door ${doorNum} key ${i}: argsJson is not array (${k.argsJson})`);
          testDataErrors++;
        }
      } catch (e) {
        console.error(`Door ${doorNum} key ${i}: Invalid argsJson JSON (${k.argsJson})`);
        testDataErrors++;
      }
    }
  }
}

console.log(`Finished validation: Harness errors: ${harnessErrors}, Test data errors: ${testDataErrors}`);
