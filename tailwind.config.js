const defaultTheme = require('tailwindcss/defaultTheme'); //eslint-disable-line

module.exports = {
  content: ['./src/**/*.{html,js}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  // eslint-disable-next-line
  plugins: [require('@tailwindcss/line-clamp')],
};
