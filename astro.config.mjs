// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

export default defineConfig({
  integrations: [react(), markdoc(), tailwind()],
  
  output: 'static',
  
  site: 'https://upstore.com.ec',

  build: {
    inlineStylesheets: 'auto',
  },
  
  security: {
    checkOrigin: false
  }
});
