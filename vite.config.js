import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
  };

  if (command === 'serve') {
    // Only import server handlers during dev to avoid build-time issues with Node built-ins/firebase-admin
    config.plugins.push({
      name: 'senjr-local-api',
      async configureServer(server) {
        const { aiTutorHandler } = await import('./server/handlers/aiTutor.js');
        const { dailyRoomHandler } = await import('./server/handlers/dailyRoom.js');
        const { runtimeConfigHandler } = await import('./server/handlers/runtimeConfig.js');

        const wrapHandler = (handler) => async (req, res, next) => {
          try {
            await handler(req, res);
          } catch (error) {
            next(error);
          }
        };

        server.middlewares.use('/api/runtime-config', wrapHandler(runtimeConfigHandler));
        server.middlewares.use('/api/ai-tutor', wrapHandler(aiTutorHandler));
        server.middlewares.use('/api/daily-room', wrapHandler(dailyRoomHandler));
      },
    });
  }

  return config;
});
