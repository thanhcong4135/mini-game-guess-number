/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        panel: '#ffffff',
        mist: '#eef3f8',
        accent: '#2563eb',
      },
    },
  },
  plugins: [],
};
