import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/shoomis-soundtrack/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        inspector: resolve(import.meta.dirname, 'index.html'),
        player: resolve(import.meta.dirname, 'player.html')
      }
    }
  }
}));
