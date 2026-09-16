const https = require('https');

const API_BASE = 'https://dsa-game-8m8p.onrender.com/api';

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
  console.log('Testing live backend with 3 C++ problem submissions...');
  
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
  console.log('✅ Logged in successfully. Token acquired.\n');

  const problemsToSolve = [
    {
      doorNum: 1,
      title: 'Find Maximum Element',
      code: 'class Solution {\npublic:\n    int findMaximum(vector<int>& nums) {\n        int mx = nums[0];\n        for (int x : nums) if (x > mx) mx = x;\n        return mx;\n    }\n};\n'
    },
    {
      doorNum: 2,
      title: 'Second Largest Element',
      code: 'class Solution {\npublic:\n    int secondLargest(vector<int>& nums) {\n        long long first = -1e18, second = -1e18;\n        for (long long x : nums) {\n            if (x > first) {\n                second = first;\n                first = x;\n            } else if (x < first && x > second) {\n                second = x;\n            }\n        }\n        return second == -1e18 ? -1 : (int)second;\n    }\n};\n'
    },
    {
      doorNum: 3,
      title: 'Reverse Array',
      code: 'class Solution {\npublic:\n    vector<int> reverseArray(vector<int>& nums) {\n        int l = 0, r = nums.size() - 1;\n        while (l < r) {\n            int tmp = nums[l];\n            nums[l] = nums[r];\n            nums[r] = tmp;\n            l++;\n            r--;\n        }\n        return nums;\n    }\n};\n'
    }
  ];

  for (const item of problemsToSolve) {
    console.log('======================================================');
    console.log(`🚀 Submitting C++ Solution for Door ${item.doorNum}: ${item.title}`);

    const doorRes = await request(`${API_BASE}/doors/${item.doorNum}`, 'GET', null, token);
    const problemId = doorRes.body?.problem?._id;

    const t0 = Date.now();
    const subRes = await request(`${API_BASE}/submissions/submit`, 'POST', {
      problemId,
      code: item.code,
      language: 'cpp'
    }, token);
    const duration = Date.now() - t0;

    const data = subRes.body || {};
    console.log(`📡 Response Status Code: ${subRes.status}`);
    console.log(`🏆 Result Status: ${data.status}`);
    console.log(`🔑 Keys Collected: ${data.keysCollectedCount}/${data.totalKeys}`);
    console.log(`🔓 Door Unlocked: ${data.doorUnlocked}`);
    console.log(`⏱️ Round-Trip Time: ${duration}ms`);
    console.log('📊 Key Results:');
    (data.keyResults || []).forEach((k, idx) => {
      console.log(`   - Key #${idx + 1} [${k.keyType}]: Passed=${k.passed}, Output=${k.actualOutput}, Runtime=${k.runtimeMs}ms`);
    });
    console.log('');
  }
}

testLive().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
