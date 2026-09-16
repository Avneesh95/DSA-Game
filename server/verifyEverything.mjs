import axios from 'axios';
import { formatCode } from '../client/src/utils/algorithmSteps.js';
import { interpretUserCode } from '../client/src/visualizers/codeInterpreter.js';
import { STRIVER_PROBLEMS, STRIVER_TOPICS } from '../client/src/data/striverSheetData.js';
import { NEETCODE_150_PROBLEMS, NEETCODE_TRACKS } from '../client/src/data/neetcode150Data.js';
import { AMAZON_150_PROBLEMS, AMAZON_CATEGORIES } from '../client/src/data/amazon150Data.js';

const API_BASE = 'https://dsa-game-8m8p.onrender.com/api';

async function runAllVerifications() {
  console.log('============================================================');
  console.log('       DSA 100 DOORS — FULL END-TO-END VERIFICATION         ');
  console.log('============================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  // ── TEST GROUP 1: Code Formatter Verification ──
  console.log('📦 TEST GROUP 1: Universal Code Formatter Engine');

  const messyCpp = 'class Solution { public: int maxElement(vector<int>& nums) { int m = nums[0]; for (int i = 0; i < nums.size(); i++) { if (nums[i] > m) m = nums[i]; } return m; } };';
  const formattedCpp = formatCode(messyCpp, 'cpp');
  assert(formattedCpp.includes('class Solution {\npublic:\n    int maxElement'), 'C++ single-line expands with public: on newline and proper indentation');
  assert(formattedCpp.includes('    for (int i = 0; i < nums.size(); i++) {'), 'C++ preserves for-loop header without splitting semicolons');
  assert(formattedCpp.endsWith('};\n'), 'C++ ends with closing semicolon on correct line');

  const messyJava = 'class Solution { public int maxElement(int[] nums) { int m = nums[0]; for (int x : nums) { if (x > m) m = x; } return m; } }';
  const formattedJava = formatCode(messyJava, 'java');
  assert(formattedJava.includes('            if (x > m) m = x;\n        }\n        return m;\n    }\n}'), 'Java indentation nests correctly inside loops and methods');

  const messyPython = 'def max_element(nums):\n  m = nums[0]\n  for x in nums:\n    if x > m:\n      m = x\n  return m';
  const formattedPython = formatCode(messyPython, 'python');
  assert(formattedPython.includes('    for x in nums:'), 'Python normalizes indentation to 4 spaces');

  // ── TEST GROUP 2: Client-side Code Interpreter (Visual Debugger) ──
  console.log('\n📦 TEST GROUP 2: Client-Side Execution Trace & Debugger Engine');

  const traceCode = `class Solution {
public:
    int maxElement(vector<int>& nums) {
        int m = nums[0];
        for (int x : nums) {
            if (x > m) m = x;
        }
        return m;
    }
};`;
  const steps = interpretUserCode(traceCode, '[10, 45, 3, 99, 12]', 'Arrays');
  assert(Array.isArray(steps) && steps.length > 3, `Debugger generates line-by-line steps (Generated ${steps.length} steps)`);
  assert(steps.some((s) => s.action && s.action.includes('Line')), 'Execution trace contains line-by-line actions');
  assert(steps.some((s) => s.vars && s.vars.val !== undefined), 'Execution trace captures variables state in real-time');

  // ── TEST GROUP 3: Roadmaps Dataset Integrity ──
  console.log('\n📦 TEST GROUP 3: Roadmaps & SDE Sheets Dataset Validation');

  assert(STRIVER_PROBLEMS.length >= 140, `Striver SDE Sheet contains ${STRIVER_PROBLEMS.length} problems`);
  assert(STRIVER_TOPICS.length === 27, `Striver SDE Sheet covers all ${STRIVER_TOPICS.length} standard topic modules`);
  assert(STRIVER_PROBLEMS.every((p) => p.id && p.title && p.difficulty && p.topic), 'Every Striver problem has valid id, title, difficulty, and topic');

  assert(NEETCODE_150_PROBLEMS.length === 150, `NeetCode 150 contains exactly ${NEETCODE_150_PROBLEMS.length} problems`);
  assert(NEETCODE_TRACKS.length === 18, `NeetCode 150 covers ${NEETCODE_TRACKS.length} patterns`);

  assert(AMAZON_150_PROBLEMS.length === 150, `Amazon Top 150 contains exactly ${AMAZON_150_PROBLEMS.length} problems`);
  assert(AMAZON_CATEGORIES.length === 8, `Amazon 150 covers ${AMAZON_CATEGORIES.length} categories`);


  // ── TEST GROUP 4: Live Render Backend Compiler Tests ──
  console.log('\n📦 TEST GROUP 4: Live Render Backend Compiler & Submission API');

  try {
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@dsa100doors.dev',
      password: 'Admin1234',
    }, { timeout: 15000 });

    const token = loginRes.data?.token;
    assert(Boolean(token), 'Admin Login on Live Backend succeeded & acquired JWT token');

    const authHeaders = { Authorization: `Bearer ${token}` };

    const door1 = await axios.get(`${API_BASE}/doors/1`, {
      headers: authHeaders,
      timeout: 10000,
    });
    assert(door1.data?.door?.doorNumber === 1 && door1.data?.problem?.keys?.length === 5, 'Door 1 loads with 5 test keys');

    // Run C++ test submission on Door 1
    const cppCode = `class Solution {
public:
    int findMaximum(vector<int>& nums) {
        int m = nums[0];
        for (int x : nums) {
            if (x > m) m = x;
        }
        return m;
    }
};`;

    const runRes = await axios.post(`${API_BASE}/submissions/run`, {
      problemId: door1.data.problem._id,
      code: cppCode,
      language: 'cpp',
    }, {
      headers: authHeaders,
      timeout: 20000,
    });

    assert(runRes.data?.status === 'accepted' && runRes.data?.keyResults?.length === 5, `Live C++ Execution: accepted (${runRes.data.keyResults.filter(k => k.passed).length}/5 keys passed, runtime: ${runRes.data.runtimeMs}ms)`);

    // Run Python test submission on Door 1
    const pyCode = `class Solution:
    def findMaximum(self, nums: list[int]) -> int:
        return max(nums)`;

    const pyRes = await axios.post(`${API_BASE}/submissions/run`, {
      problemId: door1.data.problem._id,
      code: pyCode,
      language: 'python',
    }, {
      headers: authHeaders,
      timeout: 20000,
    });

    assert(pyRes.data?.status === 'accepted', `Live Python Execution: accepted (${pyRes.data.keyResults.filter(k => k.passed).length}/5 keys passed)`);

    // Run Java test submission on Door 1
    const javaCode = `class Solution {
    public int findMaximum(int[] nums) {
        int m = nums[0];
        for (int x : nums) {
            if (x > m) m = x;
        }
        return m;
    }
}`;

    const javaRes = await axios.post(`${API_BASE}/submissions/run`, {
      problemId: door1.data.problem._id,
      code: javaCode,
      language: 'java',
    }, {
      headers: authHeaders,
      timeout: 25000,
    });

    assert(javaRes.data?.status === 'accepted', `Live Java Execution: accepted (${javaRes.data.keyResults.filter(k => k.passed).length}/5 keys passed)`);



  } catch (err) {
    console.error('API Test Error:', err.message);
    assert(false, `Live API execution: ${err.message}`);
  }

  // ── SUMMARY ──
  console.log('\n============================================================');
  console.log(`  VERIFICATION RESULTS: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('============================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL SYSTEMS FULLY OPERATIONAL AND VERIFIED CLEAN!');
  } else {
    process.exit(1);
  }
}

runAllVerifications();
