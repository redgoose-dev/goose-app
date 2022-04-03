import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// docs: https://vitejs.dev/config

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    build: {
      outDir: 'assets/dist',
      lib: {
        // formats: [ 'es', 'umd' ],
        entry: path.resolve(__dirname, 'assets/js/app.js'),
        name: 'App',
        fileName: format => `app.${format}.js`,
      },
      minify: true,
      watch: {
        exclude: 'node_modules/**',
      },
      rollupOptions: {},
      assetsDir: 'assets',
    },
  };
});
