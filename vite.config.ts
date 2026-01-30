import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ''
      }
    }
  },
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger']
  },
  ssr: {
    noExternal: ['gsap']
  }
});
