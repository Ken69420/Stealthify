/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-bg": "url('/assets/simple.jpg')",
        "custom-bg2": "url('/assets/yesmark.gif')",
      },
    },
  },
  plugins: [],
};
