/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        richblack: {
          5: "#F1F2FF",
          25: "#DBDDEA",
          100: "#AFB2BF",
          200: "#999DAA",
          700: "#2C333F",
          800: "#161D29",
          900: "#000814",
        },
        blue: {
          100: "#47AC5",
        },
        pink: {
          200: "#EF476F",
          500: "#FF69B4",
        },
        yellow: {
          50: "#FFD60A",
        },
        orange: {
          500: "#FFA07A",
        },
        purple: {
          500: "#7A288A",
        },
        blue: {
          500: "#3498DB",
        },
      },
    },
  },
  plugins: [],
};
