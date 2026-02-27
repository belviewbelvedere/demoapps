/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        receiving: '#22c55e',
        dispatch: '#f97316',
        quality: '#eab308',
        production: '#3b82f6',
        'prod-input': '#a78bfa',
        'prod-supermarket': '#7c3aed',
        'lp-tracking': '#06b6d4',
        bulk: '#92400e',
        staging: '#64748b',
        pack: '#ec4899',
      },
    },
  },
  plugins: [],
};
