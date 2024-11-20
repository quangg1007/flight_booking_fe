/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/**/*.{html,ts}',
    './libs/**/*.{html,ts}', // Include shared libraries
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
