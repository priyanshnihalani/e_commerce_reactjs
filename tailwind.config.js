/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scaleForward: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        scaleForward: 'scaleForward 1s ease-in infinite',
      },
      fontFamily: {
        playwrite: ['"Playwrite PT"', 'serif'], // Assuming Playfair Display is the closest equivalent
      },
    },
  },
  plugins: [],
}

