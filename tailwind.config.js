/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C4DFF',
          50: '#f3f0ff',
          100: '#e8e0ff',
          200: '#d4c6ff',
          300: '#b49aff',
          400: '#9466ff',
          500: '#7C4DFF',
          600: '#5c24e6',
          700: '#4a1ac9',
          800: '#3b16a3',
          900: '#2f137f',
        },
        'background-dark': '#0B0B0F',
        'background-light': '#f5f8f8',
        'glass-border': 'rgba(124, 77, 255, 0.2)',
        'glass-bg': 'rgba(11, 11, 15, 0.7)',
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        dark: {
          100: '#1e293b',
          200: '#1a2332',
          300: '#151c2a',
          400: '#111827',
          500: '#0B0B0F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        korean: ['Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 77, 255, 0.4)',
        'glow-lg': '0 0 40px rgba(124, 77, 255, 0.3)',
        'neon': '0 0 10px rgba(124, 77, 255, 0.6)',
        'neon-cyan': '0 0 10px rgba(0, 229, 255, 0.4)',
      },
    },
  },
  plugins: [],
};
