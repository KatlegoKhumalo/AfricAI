import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '../', '');
    return {
      define: {
        // Prefer GEMINI_API_KEY, fallback to VITE_GEMINI_API_KEY for start-frontend.bat
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        port: 5173,
        proxy: {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false
          }
        }
      },
    };
});
