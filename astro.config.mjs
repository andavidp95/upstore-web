// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import markdoc from '@astrojs/markdoc';

export default defineConfig({
  integrations: [react(),  markdoc(), tailwind()],
  
  output: 'static',
  adapter: cloudflare(), 
  
  site: 'https://upstore.com.ec',

  build: {
    inlineStylesheets: 'auto',
  },
  
  security: {
    checkOrigin: false
  }
});
