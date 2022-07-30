/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './componentry/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        "BreezeHeader": ["Inter"],
        "BreezeText": ["Readex Pro"],
        "BreezeMono": ["Space Mono"],
        "BreezeAltHeader": ["Readex Pro"]
      },
      colors: {
      }
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
}