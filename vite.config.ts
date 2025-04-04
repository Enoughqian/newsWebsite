import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const PORT =  parseInt(env.VITE_PORT || '3000', 10)
  return {
    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
          dev: { logLevel: ['error'] },
        },
        overlay: {
          position: 'tl',
          initialIsOpen: false,
        },
      }),
    ],
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), 'node_modules/$1'),
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), 'src/$1'),
        },
      ],
    },
    server: { 
      port: PORT, 
      host: true,
      proxy: {
        // "/api": {
        //   target: "http://152.32.218.226:9999/news_server/api",
        //   changeOrigin: true,
        //   secure: false,
        //   rewrite: (path) => path.replace(/^\/api/, ""), // 确保路径不重复
        // },
      },
    },
    preview: { port: PORT, host: true },
  }
});
