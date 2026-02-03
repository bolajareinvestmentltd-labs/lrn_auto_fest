export default {
  mode: 'jit', // Explicitly enable JIT mode
  content: [
    "./src/**/*.{js,ts,jsx,tsx,css}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontSize: {
        '7xl': '5rem', // Correct size for 7xl
      },
    },
  },
  plugins: [],
  // Dummy change to force rebuild
};