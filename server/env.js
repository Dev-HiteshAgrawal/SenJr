import fs from 'node:fs';
import path from 'node:path';

let loaded = false;

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

export function ensureServerEnv() {
  if (loaded) return;
  loadEnvFile('.env');
  loadEnvFile('.env.local');
  loaded = true;
}

export function getServerEnv() {
  ensureServerEnv();

  return {
    nvidiaApiKey: process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '',
    livekitApiKey: process.env.LIVEKIT_API_KEY || '',
    livekitApiSecret: process.env.LIVEKIT_API_SECRET || '',
    adminEmail: process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || '',
  };
}
