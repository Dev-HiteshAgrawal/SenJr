import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(fileName) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue;
    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) continue;
    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

const API_BASE_URL = 'http://127.0.0.1:5173/api';

async function testRoute(route, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${route}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    const data = await response.json().catch(() => ({}));
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

async function runTests() {
  console.log('Testing API Authentication Hardening...\n');

  // 1. Test /api/ai-tutor without auth
  console.log('1. Testing /api/ai-tutor without auth...');
  const res1 = await testRoute('/ai-tutor', 'POST', { tutor: { name: 'Test', subject: 'Math' }, messages: [] });
  if (res1.status === 401) {
    console.log('✅ PASS: /api/ai-tutor rejected unauthorized request (401)');
  } else {
    console.log(`❌ FAIL: /api/ai-tutor returned ${res1.status} instead of 401`);
    console.log('   Data:', res1.data);
    console.log('   Error:', res1.error);
  }

  // 2. Test /api/daily-room without auth
  console.log('\n2. Testing /api/daily-room without auth...');
  const res2 = await testRoute('/daily-room', 'POST', { durationSeconds: 3600 });
  if (res2.status === 401) {
    console.log('✅ PASS: /api/daily-room rejected unauthorized request (401)');
  } else {
    console.log(`❌ FAIL: /api/daily-room returned ${res2.status} instead of 401`);
    console.log('   Data:', res2.data);
  }

  // 3. Test /api/runtime-config (should still be public)
  console.log('\n3. Testing /api/runtime-config (public)...');
  const res3 = await testRoute('/runtime-config', 'GET');
  if (res3.status === 200) {
    console.log('✅ PASS: /api/runtime-config is still public (200)');
  } else {
    console.log(`❌ FAIL: /api/runtime-config returned ${res3.status} instead of 200`);
    console.log('   Data:', res3.data);
  }

  console.log('\nNote: To test with a valid token, run this script with a FIREBASE_TOKEN env var.');
}

runTests();
