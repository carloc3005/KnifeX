/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./api/**/*.{js,ts}",
    "./src/styles.css",
  ],
  safelist: [
    // Keep important classes that might be used dynamically
    'bg-gray-800',
    'text-white',
    'flex',
    'items-center',
    'justify-between',
    'p-2',
    'px-4',
    'py-2',
    'hover:bg-gray-700',
    'focus:ring-2',
    'focus:ring-white',
    'rounded-md',
    'relative',
    'absolute',
    'z-50',
    'shadow-lg',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
