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
      server.middlewares.use('/api/runtime-config', wrapHandler(runtimeConfigHandler));
      server.middlewares.use('/api/ai-tutor', wrapHandler(aiTutorHandler));
      server.middlewares.use('/api/livekit-token', wrapHandler(livekitTokenHandler));
    },
  };
}

export default defineConfig({
  plugins: [react(), senjrLocalApiPlugin()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: false,
  },
});
