const https = require('https');

const API_BASE = 'https://dsa-game.onrender.com/api';

function request(url, method, data, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = data ? JSON.stringify(data) : '';
    const req = https.request({
      hostname: u.hostname,
      port: 443,
      path: u.pathname + u.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Length': Buffer.byteLength(body),
      }
    }, (res) => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(chunks) });
        } catch (_) {
          resolve({ status: res.statusCode, raw: chunks });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function testLive() {
  console.log('Testing live backend submission API...');
  
  // Login with demo admin
  const loginRes = await request(`${API_BASE}/auth/login`, 'POST', {
    email: 'admin@dsa100doors.dev',
    password: 'Admin1234'
  });

  if (!loginRes.body || !loginRes.body.token) {
    console.error('Login failed:', loginRes);
    return;
  }
  const token = loginRes.body.token;
  console.log('✅ Logged in successfully. Token acquired.');

  // Fetch door 1
  const doorRes = await request(`${API_BASE}/doors/1`, 'GET', null, token);
  const problemId = doorRes.body?.problem?._id;
  console.log(`✅ Loaded Door 1 (Problem ID: ${problemId})`);

  // Test Python
  const pyCode = `class Solution:\n    def findMaximum(self, nums):\n        return max(nums)\n`;
  console.log('\n--- Testing Python Submission ---');
  const pySub = await request(`${API_BASE}/submissions/submit`, 'POST', {
    problemId,
    code: pyCode,
    language: 'python'
  }, token);
  console.log(`Python Status: ${pySub.body?.status}, Keys: ${pySub.body?.keysCollectedCount}/${pySub.body?.totalKeys}, DoorUnlocked: ${pySub.body?.doorUnlocked}`);

  // Test Java
  const javaCode = `class Solution {\n    public int findMaximum(int[] nums) {\n        int max = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            if (nums[i] > max) max = nums[i];\n        }\n        return max;\n    }\n}\n`;
  console.log('\n--- Testing Java Submission ---');
  const javaSub = await request(`${API_BASE}/submissions/submit`, 'POST', {
    problemId,
    code: javaCode,
    language: 'java'
  }, token);
  console.log(`Java Status: ${javaSub.body?.status}, Keys: ${javaSub.body?.keysCollectedCount}/${javaSub.body?.totalKeys}, DoorUnlocked: ${javaSub.body?.doorUnlocked}`);
  if (javaSub.body?.status !== 'accepted') {
    console.log('Java key results:', javaSub.body?.keyResults);
  }

  // Test C++
  const cppCode = `class Solution {\npublic:\n    int findMaximum(vector<int>& nums) {\n        int mx = nums[0];\n        for (int x : nums) if (x > mx) mx = x;\n        return mx;\n    }\n};\n`;
  console.log('\n--- Testing C++ Submission ---');
  const cppSub = await request(`${API_BASE}/submissions/submit`, 'POST', {
    problemId,
    code: cppCode,
    language: 'cpp'
  }, token);
  console.log(`C++ Status: ${cppSub.body?.status}, Keys: ${cppSub.body?.keysCollectedCount}/${cppSub.body?.totalKeys}, DoorUnlocked: ${cppSub.body?.doorUnlocked}`);
  if (cppSub.body?.status !== 'accepted') {
    console.log('C++ key results:', cppSub.body?.keyResults);
  }
}

testLive().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
