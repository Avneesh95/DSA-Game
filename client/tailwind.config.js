/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dungeon: {
          950: '#000000', // Pure Black (Apple Background)
          900: '#0a0a0a', // Almost Black
          800: '#1c1c1e', // Apple Card Gray
          700: '#2c2c2e', // Apple Secondary Gray
          600: '#3a3a3c', // Apple Border Gray
        },
        glow: {
          purple: '#ff9500', // Apple Orange (Primary Accent)
          cyan: '#f5f5f7',   // Apple Silver / White
          gold: '#ffcc00',   // Apple Yellow
          emerald: '#34c759', // Apple Green
          rose: '#ff3b30',   // Apple Red
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 149, 0, 0.4)',
        'glow-gold': '0 0 20px rgba(255, 204, 0, 0.4)',
        'glow-cyan': '0 0 20px rgba(245, 245, 247, 0.15)',
      },
      backgroundImage: {
        'dungeon-radial': 'radial-gradient(circle at 50% 0%, #1c1c1e 0%, #000000 70%)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      screens: {
        xs: '420px',
      },
    },
  },
  plugins: [],
};
