/** @type {import('tailwindcss').Config} */
import { createRouter } from 'vue-router'
import { createWebHistory } from 'vue-router'
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/element-plus/lib/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

