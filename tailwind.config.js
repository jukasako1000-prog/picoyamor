import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6c9371',
        'primary-hover': '#56755a',
        accent: '#a3cb2a',
        'background-light': '#F2EDE4',
        surface: '#ffffff',
        'text-main': '#3F3D3C',
        'text-muted': '#6c7a6e',
        'wood-brown': '#8B5E3C',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(63, 61, 60, 0.08)',
        hover: '0 20px 40px -10px rgba(63, 61, 60, 0.12)',
      },
    },
  },
  plugins: [forms, containerQueries],
};
