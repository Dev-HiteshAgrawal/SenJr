import { GoogleGenerativeAI } from '@google/generative-ai';
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

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing GEMINI_API_KEY or VITE_GEMINI_API_KEY.');
}

const genAI = new GoogleGenerativeAI(apiKey);

const TUTORS = {
  maths: { name: 'Nova', emoji: '🧮', subject: 'Maths', question: 'How do I solve quadratic equations? Give me a simple example.' },
  science: { name: 'Atom', emoji: '⚗️', subject: 'Science', question: 'Why is the sky blue? Explain the science behind it.' },
  history: { name: 'Sage', emoji: '📜', subject: 'History', question: 'What were the main causes of World War 1?' },
  economics: { name: 'Axis', emoji: '📊', subject: 'Economics & Business', question: 'Can you explain supply and demand with an example?' },
  english: { name: 'Quill', emoji: '✍️', subject: 'English & Writing', question: 'How do I write a strong essay introduction?' },
  programming: { name: 'CodeBot', emoji: '💻', subject: 'Programming', question: 'What is a closure in JavaScript? Show me a code example.' },
  geography: { name: 'Terra', emoji: '🌍', subject: 'Geography', question: 'How are mountains formed? What types of mountains exist?' },
  biology: { name: 'Gene', emoji: '🧬', subject: 'Biology Deep Dive', question: 'What is the function of mitochondria in a cell?' },
};

async function testTutor(tutorKey) {
  const tutor = TUTORS[tutorKey];
  const systemInstruction = `You are ${tutor.name}, a friendly and patient AI tutor for ${tutor.subject}. Explain step by step, use simple language, and keep answers concise.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction,
  });

  const chat = model.startChat({ history: [] });

  console.log(`\n${'='.repeat(60)}`);
  console.log(`${tutor.emoji}  ${tutor.name} - ${tutor.subject}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Student: ${tutor.question}`);
  console.log('---');

  try {
    const result = await chat.sendMessage(tutor.question);
    const text = result.response.text();
    console.log(`${tutor.emoji} ${tutor.name}: ${text}`);
    return { tutor: tutor.name, status: 'PASS' };
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    return { tutor: tutor.name, status: `FAIL: ${error.message}` };
  }
}

async function runAllTests() {
  console.log('\nSenjr AI Tutor - Gemini API Health Check');
  console.log(`Testing all ${Object.keys(TUTORS).length} tutors\n`);

  const results = [];
  for (const key of Object.keys(TUTORS)) {
    const result = await testTutor(key);
    results.push(result);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY REPORT');
  console.log(`${'='.repeat(60)}`);
  results.forEach((result) => console.log(`  ${result.status}  ${result.tutor}`));
  const passed = results.filter((result) => result.status === 'PASS').length;
  console.log(`\n  Total: ${passed}/${results.length} tutors working`);
}

runAllTests().catch(console.error);
