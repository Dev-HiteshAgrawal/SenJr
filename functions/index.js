import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AccessToken } from 'livekit-server-sdk';
import admin from 'firebase-admin';

admin.initializeApp();

const nvidiaApiKey = defineSecret('NVIDIA_API_KEY');
const geminiApiKey = defineSecret('GEMINI_API_KEY');
const livekitApiKey = defineSecret('LIVEKIT_API_KEY');
const livekitApiSecret = defineSecret('LIVEKIT_API_SECRET');

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

function allowCors(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

function getRequestPath(req) {
  const rawPath = req.path || req.url || '/';
  return rawPath.replace(/^\/api\/?/, '/');
}

function getProvider() {
  const hasNvidia = Boolean(nvidiaApiKey.value());
  const hasGemini = Boolean(geminiApiKey.value());

  if (hasNvidia) return 'nvidia';
  if (hasGemini) return 'gemini';
  return null;
}

function getSystemInstruction(tutor) {
  return `You are ${tutor.name}, a friendly and patient AI tutor for ${tutor.subject}. You are talking to a student (could be from India or anywhere globally). Follow these rules: 1) Explain concepts step by step in simple language. 2) Use real-life examples and relatable contexts. 3) After each explanation ask: Did that make sense? Want a practice question? 4) When the student gets something right, celebrate it. 5) If the student is confused, try a different approach. 6) Use emojis occasionally to stay warm. 7) Keep responses focused and avoid walls of text.`;
}

async function generateWithNvidia({ tutor, messages }) {
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
      Authorization: `Bearer ${nvidiaApiKey.value()}`,
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
  const genAI = new GoogleGenerativeAI(geminiApiKey.value());
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

async function handleRuntimeConfig(req, res) {
  if (req.method !== 'GET') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  sendJson(res, 200, {
    aiTutorEnabled: Boolean(getProvider()),
    aiProvider: getProvider(),
    livekitEnabled: Boolean(livekitApiKey.value() && livekitApiSecret.value()),
    adminConfigured: Boolean(process.env.ADMIN_EMAIL),
  });
}

async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

async function handleAiTutor(req, res) {
  if (req.method !== 'POST') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  const user = await verifyAuth(req);
  if (!user) {
    sendError(res, 401, 'Unauthorized. Please provide a valid session token.');
    return;
  }

  const provider = getProvider();
  if (!provider) {
    sendError(res, 500, 'AI tutor is not configured on the server.');
    return;
  }

  const tutor = req.body?.tutor;
  const messages = req.body?.messages;

  if (!tutor?.name || !tutor?.subject || !Array.isArray(messages)) {
    sendError(res, 400, 'Missing tutor details or conversation messages.');
    return;
  }

  const reply =
    provider === 'nvidia'
      ? await generateWithNvidia({ tutor, messages })
      : await generateWithGemini({ tutor, messages });

  sendJson(res, 200, { reply, provider });
}

function cleanRoomName(roomName) {
  return String(roomName || 'senjr-session')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 64);
}

async function handleLiveKitToken(req, res) {
  if (req.method !== 'POST') {
    sendError(res, 405, 'Method not allowed.');
    return;
  }

  const user = await verifyAuth(req);
  if (!user) {
    sendError(res, 401, 'Unauthorized. Please provide a valid session token.');
    return;
  }

  if (!livekitApiKey.value() || !livekitApiSecret.value()) {
    sendError(res, 500, 'LiveKit video service is not configured on the server.');
    return;
  }

  const roomName = cleanRoomName(req.body?.roomName);
  const participantIdentity = String(req.body?.participantIdentity || `user-${Date.now()}`);
  const participantName = String(req.body?.participantName || 'User');

  const token = new AccessToken(livekitApiKey.value(), livekitApiSecret.value(), {
    identity: participantIdentity,
    name: participantName,
    ttl: '2h',
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  sendJson(res, 200, {
    token: await token.toJwt(),
    roomName,
  });
}

export const api = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 120,
    secrets: [nvidiaApiKey, geminiApiKey, livekitApiKey, livekitApiSecret],
  },
  async (req, res) => {
    allowCors(res);

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    const requestPath = getRequestPath(req);

    try {
      if (requestPath === '/runtime-config') {
        await handleRuntimeConfig(req, res);
        return;
      }

      if (requestPath === '/ai-tutor') {
        await handleAiTutor(req, res);
        return;
      }

      if (requestPath === '/livekit-token') {
        await handleLiveKitToken(req, res);
        return;
      }

      sendError(res, 404, 'API route not found.');
    } catch (error) {
      console.error('Firebase API error:', error);
      sendError(res, 500, error.message || 'Unexpected server error.');
    }
  }
);
