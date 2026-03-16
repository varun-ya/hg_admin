import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'season': ['var(--font-season-mix)'],
        'matter': ['var(--font-matter)'],
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
        pageIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        contextIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        pageIn: 'pageIn 0.35s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        slideIn: 'slideIn 0.28s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        contextIn: 'contextIn 0.15s ease-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
