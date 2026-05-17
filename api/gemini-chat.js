import { GoogleGenerativeAI } from '@google/generative-ai';

/* global process */

export default async function handler(req, res) {
  // CORS headers
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://senjr.vercel.app';
  const requestOrigin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', requestOrigin === allowedOrigin ? allowedOrigin : 'https://senjr.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const { messages, systemInstruction } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Valid messages array is required' });
  }
  if (messages.length > 20) {
    return res.status(400).json({ error: 'Please keep the conversation shorter and try again' });
  }
  const hasInvalidMessage = messages.some(message => (
    !message ||
    !['user', 'model'].includes(message.role) ||
    typeof message.content !== 'string' ||
    message.content.length > 4000
  ));
  if (hasInvalidMessage) {
    return res.status(400).json({ error: 'Invalid message format' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Extract the latest message and previous history
    const latestMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      systemInstruction: systemInstruction || 'You are EduPulse AI Tutor, a highly intelligent and encouraging academic assistant designed to help students with their studies, exam prep, and career guidance. Provide clear, concise, and accurate explanations. Use emojis occasionally.',
    });

    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ content: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to process AI response' });
  }
}
