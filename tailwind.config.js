/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'kodic-purple': '#8B5CF6',
        'kodic-fuchsia': '#D946EF',
        'kodic-pink': '#EC4899',
        'kodic-orange': '#F97316',
        'kodic-green': '#10B981',
        'kodic-blue': '#3B82F6',
        'kodic-amber': '#F59E0B',
        'kodic-red': '#EF4444'
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
