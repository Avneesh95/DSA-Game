const p1 = require('./seed/problemsData');
const p2 = require('./seed/problemsData11to40');
const p3 = require('./seed/problemsData41to70');
const p4 = require('./seed/problemsData71to100');
const allProblems = [...p1, ...p2, ...p3, ...p4];

const testData = require('./seed/generatedTestData.json');
const { parseJavaSignature, expandStarterCode } = require('./seed/starterCodeGenerator');
const { classifySignature, isGenericallySupported } = require('./execution/signatureUtil');
const { SPECIAL_CASE_DOORS } = require('./execution/specialCases');

console.log(`Analyzing ${allProblems.length} problems...`);

const issues = [];

for (const p of allProblems) {
  const doorNum = p.doorNumber;
  const javaEntry = (p.starterCode || []).find((s) => s.language === 'java');
  
  if (!javaEntry) {
    issues.push({ doorNum, title: p.title, error: 'No Java starter code found' });
    continue;
  }

  const sig = parseJavaSignature(javaEntry.code);
  if (!sig) {
    issues.push({ doorNum, title: p.title, error: 'Failed to parse Java signature' });
    continue;
  }

  const isSpecial = SPECIAL_CASE_DOORS.has(doorNum);
  const classified = classifySignature(sig);

  if (!isSpecial && !isGenericallySupported(classified)) {
    issues.push({
      doorNum,
      title: p.title,
      error: `Not generically supported: return=${classified.returnType.kind}(${classified.returnType.depth}), params=${classified.params.map(pm => pm.kind + '(' + pm.depth + ')').join(',')}`,
    });
  }

  // Check test keys
  const keys = testData[doorNum] || p.keys || [];
  if (!keys || keys.length === 0) {
    issues.push({ doorNum, title: p.title, error: 'No test keys found' });
  } else {
    for (let ki = 0; ki < keys.length; ki++) {
      const k = keys[ki];
      if (!k.argsJson) {
        issues.push({ doorNum, title: p.title, keyIdx: ki, error: `Key has no argsJson (input: ${k.input})` });
      } else {
        try {
          const parsedArgs = JSON.parse(k.argsJson);
          if (!Array.isArray(parsedArgs)) {
            issues.push({ doorNum, title: p.title, keyIdx: ki, error: `argsJson is not an array: ${k.argsJson}` });
          } else if (!isSpecial && parsedArgs.length !== classified.params.length) {
            issues.push({
              doorNum,
              title: p.title,
              keyIdx: ki,
              error: `argsJson length (${parsedArgs.length}) != params length (${classified.params.length}). argsJson=${k.argsJson}`,
            });
          }
        } catch (e) {
          issues.push({ doorNum, title: p.title, keyIdx: ki, error: `Invalid JSON in argsJson: ${k.argsJson}` });
        }
      }

      if (k.expectedJson === undefined || k.expectedJson === null) {
        issues.push({ doorNum, title: p.title, keyIdx: ki, error: `Key has no expectedJson` });
      } else {
        try {
          JSON.parse(k.expectedJson);
        } catch (e) {
          // Could be bare string
        }
      }
    }
  }
}

console.log(`Found ${issues.length} structural issues across 100 doors.`);
if (issues.length > 0) {
  console.log(JSON.stringify(issues, null, 2));
} else {
  console.log('All 100 doors passed structural validation!');
}
