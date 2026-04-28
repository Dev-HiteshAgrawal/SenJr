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

const apiKey = process.env.VITE_NVIDIA_API_KEY || process.env.NVIDIA_API_KEY;

if (!apiKey) {
  throw new Error('Missing NVIDIA_API_KEY or VITE_NVIDIA_API_KEY.');
}

const TUTORS = {
  maths: {
    name: 'Nova', emoji: '🧮', subject: 'Maths',
    q1: 'Explain the concept of eigenvalues and eigenvectors in linear algebra and their application in principal component analysis.',
    q2: 'How does finding the highest eigenvalue help reduce dimensionality in a dataset?'
  },
  science: {
    name: 'Atom', emoji: '⚗️', subject: 'Science',
    q1: 'Explain the principles of quantum entanglement and how it defies classical local realism.',
    q2: 'If information cannot travel faster than light, how do we explain the apparent instant state collapse across entangled particles?'
  },
  history: {
    name: 'Sage', emoji: '📜', subject: 'History',
    q1: 'Analyze the geopolitical consequences of the Treaty of Westphalia on the modern concept of nation-states.',
    q2: 'Did it actually create absolute sovereignty, or was that a later historical construct?'
  },
  economics: {
    name: 'Axis', emoji: '📊', subject: 'Economics & Business',
    q1: 'What are the macroeconomic implications of Modern Monetary Theory for a country without the global reserve currency?',
    q2: 'How would hyperinflation risks be mitigated in that scenario?'
  },
  english: {
    name: 'Quill', emoji: '✍️', subject: 'English & Writing',
    q1: 'Deconstruct the use of unreliable narrators in postmodern literature with examples.',
    q2: 'How does this technique alter the reader relationship with truth in the narrative?'
  },
  programming: {
    name: 'CodeBot', emoji: '💻', subject: 'Programming',
    q1: 'Explain the memory management differences between Rust ownership and Go garbage collection.',
    q2: 'In high-throughput microservices, which approach tends to yield more predictable tail latencies and why?'
  },
  geography: {
    name: 'Terra', emoji: '🌍', subject: 'Geography',
    q1: 'Explain the mechanisms of the Milankovitch cycles and their correlation with glacial periods.',
    q2: 'How do anthropogenic climate factors compare to the radiative forcing caused by these orbital variations?'
  },
  biology: {
    name: 'Gene', emoji: '🧬', subject: 'Biology Deep Dive',
    q1: 'Detail the molecular mechanism of the CRISPR-Cas9 system, including the PAM sequence and sgRNA.',
    q2: 'What are the primary off-target cleavage challenges, and how are newer Cas variants addressing them?'
  }
};

async function askTutor(history) {
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta/llama-3.1-70b-instruct',
      messages: history,
      temperature: 0.7,
      max_tokens: 300,
    })
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function runDeepTest() {
  console.log('Senjr AI Tutor - NVIDIA API Deep Test\n');
  console.log('='.repeat(80));

  for (const key of Object.keys(TUTORS)) {
    const tutor = TUTORS[key];
    console.log(`\nTesting tutor: ${tutor.name} ${tutor.emoji} (${tutor.subject})`);

    const history = [
      {
        role: 'system',
        content: `You are ${tutor.name}, an advanced AI tutor for ${tutor.subject}. Keep answers concise, factual, and under 150 words.`
      }
    ];

    try {
      console.log(`\n  Student (Q1): ${tutor.q1}`);
      history.push({ role: 'user', content: tutor.q1 });
      const answerOne = await askTutor(history);
      console.log(`  ${tutor.name} (A1): ${answerOne.replace(/\n/g, ' ')}`);
      history.push({ role: 'assistant', content: answerOne });

      console.log(`\n  Student (Q2): ${tutor.q2}`);
      history.push({ role: 'user', content: tutor.q2 });
      const answerTwo = await askTutor(history);
      console.log(`  ${tutor.name} (A2): ${answerTwo.replace(/\n/g, ' ')}`);

      console.log(`\nPASS: ${tutor.name}`);
    } catch (error) {
      console.log(`\nFAIL: ${tutor.name}: ${error.message}`);
    }

    console.log('-'.repeat(80));
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\nAll deep tests completed.');
}

runDeepTest().catch(console.error);
