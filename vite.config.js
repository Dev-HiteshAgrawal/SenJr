import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { aiTutorHandler } from './server/handlers/aiTutor.js';
import { livekitTokenHandler } from './server/handlers/livekitToken.js';
import { runtimeConfigHandler } from './server/handlers/runtimeConfig.js';

function wrapHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

function senjrLocalApiPlugin() {
  return {
    name: 'senjr-local-api',
    configureServer(server) {
      server.middlewares.use('/api/livekit-token', wrapHandler(livekitTokenHandler));
      server.middlewares.use('/api/runtime-config', wrapHandler(runtimeConfigHandler));
      server.middlewares.use('/api/ai-tutor', wrapHandler(aiTutorHandler));
    },
  };
}

/** Warn on Netlify builds with empty VITE_FIREBASE_* (runtime fallback handles UI gracefully). */
function senjrNetlifyEnvPlugin() {
  return {
    name: 'senjr-netlify-env',
    configResolved() {
      if (process.env.NETLIFY !== 'true') return;
      const required = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID',
      ];
      const missing = required.filter((k) => !process.env[k]?.trim?.());
      if (missing.length) {
        throw new Error(`[senjr] Netlify build missing env: ${missing.join(', ')}. Add them as Netlify Build variables, then redeploy.`);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), senjrNetlifyEnvPlugin(), senjrLocalApiPlugin()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: false,
  },
});
