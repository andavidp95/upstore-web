/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Usa la clase 'dark' para el modo oscuro
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
}