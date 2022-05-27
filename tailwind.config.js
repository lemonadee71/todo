const defaultTheme = require('tailwindcss/defaultTheme'); //eslint-disable-line

module.exports = {
  content: ['./src/**/*.{html,js}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
  },
  // eslint-disable-next-line
  plugins: [require('@tailwindcss/line-clamp')],
};
