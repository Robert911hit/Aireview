import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pulse: {
          bg: '#050b18',
          panel: '#0c1730',
          blue: '#1f7aff',
          cyan: '#25d9ff',
          green: '#22c55e',
        },
      },
      boxShadow: {
        glow: '0 0 60px rgba(37, 217, 255, 0.28)',
      },
    },
  },
  plugins: [],
};

export default config;
