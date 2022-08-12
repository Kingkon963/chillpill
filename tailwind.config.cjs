/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"],
  // important: true,
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
};
