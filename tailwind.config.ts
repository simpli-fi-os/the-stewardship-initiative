import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        eden: {
          'jungle': '#022C22',
          'lush': '#033F32',
          'tidal': '#26A69A',
          'hibiscus': '#D90368',
          'marigold': '#FDB833',
          'orchid': '#FDFDFF',
          'redwood': '#A44A3F',
          'gray': '#D1D5DB',
        },
        sage: '#4A7C6F',
        mist: '#E8F0ED',
        cream: '#FFF9F0',
      },
      animation: {
        'heartbeat': 'heartbeat 2s ease-in-out infinite',
        'fade-in': 'fadeIn 2s ease-in-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
      },
      keyframes: {
        heartbeat: {
          '0%, 45%, 100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.1)' },
          '30%': { transform: 'scale(1.25)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
