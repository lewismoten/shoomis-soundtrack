import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/shoomis-soundtrack/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
}));
