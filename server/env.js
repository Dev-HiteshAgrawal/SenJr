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

  // Trim every value — Vercel can inject env vars with \r\n if set via
  // dashboard copy-paste on Windows, which corrupts JWT issuer fields.
  const t = (v) => (v || '').trim();

  return {
    nvidiaApiKey:    t(process.env.NVIDIA_API_KEY    || process.env.VITE_NVIDIA_API_KEY),
    groqApiKey:      t(process.env.GROQ_API_KEY      || process.env.VITE_GROQ_API_KEY),
    livekitApiKey:   t(process.env.LIVEKIT_API_KEY),
    livekitApiSecret: t(process.env.LIVEKIT_API_SECRET),
    adminEmail:      t(process.env.ADMIN_EMAIL       || process.env.VITE_ADMIN_EMAIL),
  };
}
