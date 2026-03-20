import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        deepNavy: '#06101c',
        midnight: '#0c1b2d',
        softTeal: '#4faea5',
        healingCyan: '#8ddde0',
        mist: '#d9e7ee',
        mistMuted: '#9fb4c1',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(141, 221, 224, 0.14), 0 28px 90px rgba(2, 10, 19, 0.62)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(91, 122, 171, 0.28), transparent 30%), radial-gradient(circle at 18% 18%, rgba(79, 174, 165, 0.18), transparent 24%), radial-gradient(circle at 82% 0%, rgba(141, 221, 224, 0.14), transparent 28%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
