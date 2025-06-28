/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',  // Add this line to enable dark mode with a class
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Optional: extend your colors for dark mode if needed
        darkbg: '#121212',
        darktext: '#e0e0e0',
      },
    },
  },
  plugins: [],
};
