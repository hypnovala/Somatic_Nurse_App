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
        night: '#07111f',
        cyanGlow: '#6ee7f9',
        tealGlow: '#42d7c8',
        blueGlow: '#4f74ff',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(110, 231, 249, 0.12), 0 24px 80px rgba(7, 17, 31, 0.55)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(79, 116, 255, 0.35), transparent 30%), radial-gradient(circle at 20% 20%, rgba(66, 215, 200, 0.24), transparent 25%), radial-gradient(circle at 80% 0%, rgba(110, 231, 249, 0.18), transparent 28%)',
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
