
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/ai-tutor'; // Assuming local dev server runs on 3000

async function testInjection() {
  console.log('--- Testing XSS Payload ---');
  const xssPayload = {
    tutor: { name: 'Arya', subject: 'Maths' },
    messages: [{ role: 'user', content: '<script>alert("XSS")</script>' }],
    stream: false
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer MOCK_TOKEN' // In reality we'd need a valid token or mock verifyAuth
      },
      body: JSON.stringify(xssPayload)
    });
    const data = await res.json();
    console.log('Response status:', res.status);
    console.log('Response body:', data);
  } catch (e) {
    console.error('Error during XSS test:', e.message);
  }

  console.log('\n--- Testing NoSQL Injection Payload ---');
  const nosqlPayload = {
    tutor: { name: 'Arya', subject: 'Maths' },
    messages: [{ role: 'user', content: { "$gt": "" } }],
    stream: false
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer MOCK_TOKEN'
      },
      body: JSON.stringify(nosqlPayload)
    });
    const data = await res.json();
    console.log('Response status:', res.status);
    console.log('Response body:', data);
  } catch (e) {
    console.error('Error during NoSQL test:', e.message);
  }
}

// Note: This script requires a running server and valid auth to fully execute.
// For static analysis, we see that sanitizer.js uses DOMPurify which handles strings.
// If content is an object, it recursively sanitizes keys/values.
console.log('Injection test script created. Requires active environment for execution.');
