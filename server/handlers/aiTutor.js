import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerEnv } from '../env.js';
import { allowCors, readJsonBody, sendError, sendJson } from '../http.js';
import { verifyIdToken } from '../auth.js';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

function getSystemInstruction(tutor) {
  return `You are ${tutor.name}, a friendly and patient AI tutor for ${tutor.subject}. You are talking to a student (could be from India or anywhere globally). Follow these rules: 1) Explain concepts step by step in simple language. 2) Use real-life examples and relatable contexts. 3) After each explanation ask: Did that make sense? Want a practice question? 4) When the student gets something right, celebrate it. 5) If the student is confused, try a different approach. 6) Use emojis occasionally to stay warm. 7) Keep responses focused and avoid walls of text.`;
}

function getProvider() {
  const { nvidiaApiKey, geminiApiKey } = getServerEnv();
  if (nvidiaApiKey) return 'nvidia';
  if (geminiApiKey) return 'gemini';
  return null;
}

async function generateWithNvidia({ tutor, messages }) {
  const { nvidiaApiKey } = getServerEnv();
  const apiMessages = [
    { role: 'system', content: getSystemInstruction(tutor) },
    ...messages.map((message) => ({
      role: message.role === 'model' ? 'assistant' : 'user',
      content: message.content,
    })),
  ];

  const response = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${nvidiaApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta/llama-3.1-70b-instruct',
      messages: apiMessages,
      temperature: 0.5,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function generateWithGemini({ tutor, messages }) {
  const { geminiApiKey } = getServerEnv();
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const transcript = messages
    .map((message) => `${message.role === 'model' ? tutor.name : 'Student'}: ${message.content}`)
    .join('\n\n');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: getSystemInstruction(tutor),
  });

  const result = await model.generateContent([
    'Continue this tutoring conversation and reply as the tutor.',
    transcript,
  ].join('\n\n'));

  return result.response.text().trim();
}

export async function aiTutorHandler(req, res) {
  allowCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  const decodedToken = await verifyIdToken(req);
  if (!decodedToken) {
    sendError(res, 401, 'Unauthorized: Missing or invalid authentication token.');
    return;
  }

  const provider = getProvider();
  if (!provider) {
    sendError(res, 500, 'AI tutor is not configured on the server.');
    return;
  }

  try {
    const body = await readJsonBody(req);

    // Explicit destructuring to prevent mass assignment
    const { tutor, messages } = body || {};

    if (!tutor?.name || !tutor?.subject || !Array.isArray(messages)) {
      sendError(res, 400, 'Missing tutor details or conversation messages.');
      return;
    }

    // Sanitize tutor input
    const sanitizedTutor = {
      name: String(tutor.name),
      subject: String(tutor.subject)
    };

    // Sanitize messages
    const sanitizedMessages = messages.map(m => ({
      role: String(m.role),
      content: String(m.content)
    }));

    const reply =
      provider === 'nvidia'
        ? await generateWithNvidia({ tutor: sanitizedTutor, messages: sanitizedMessages })
        : await generateWithGemini({ tutor: sanitizedTutor, messages: sanitizedMessages });

    sendJson(res, 200, { reply, provider });
  } catch (error) {
    console.error('AI tutor handler error:', error);
    sendError(res, 500, error.message || 'Failed to generate tutor reply.');
  }
}
