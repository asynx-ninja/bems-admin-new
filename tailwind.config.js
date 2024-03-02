/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    screens: {
      sm: "320px",
      md: "640px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1536px",
      xxxl: "1920px",
    },
    extend: {
      screens: {
        sm: "320px",
        md: "640px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1536px",
        xxxl: "1920px",
      },
      colors: {
        'white': '#FFFFFF',
        'custom-green-header': '#295141',
        'custom-red': '#B90000',
        'custom-grey': '#D9D9D9',
        'custom-blue': '#4891FF',
        'custom-green-button': '#268F26',
        'custom-yellow': '#EDAB00',
        'custom-gold': '#D3B574',
        'custom-gold1': '#FFCF67',
        'custom-red1': '#FF2828',
        'custom-amber': '#EFB050',
        'custom-green-button2': '#007069',
        'custom-red2': '#99364D',
        'custom-green-button3': '#369987',
        'custom-red-button': "#B95252",
        'custom-green-button4': '#52B98E',
      },
      fontFamily: {
        primary: "Gilmer-Regular",
        'bold': "Gilmer-Bold",
        'light': "Gilmer-Light",
        'medium': "Gilmer-Medium",
        'heavy': "Gilmer-Heavy",
      },

    },
  },
  plugins: [require("preline/plugin")],
};