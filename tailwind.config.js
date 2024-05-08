/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.tsx", "./plugin/index.html"],
  safelist: ["text-green-500", "text-red-500", "text-blue-500"],
  theme: {
    screens: {
      xs: "450px",
      sm: "640px",
      md: "768px",
    },
    extend: {},
  },
  plugins: [],
};
