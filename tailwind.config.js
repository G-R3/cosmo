/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          neutral: "#f3f4f6",
        },
      },
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#f43f5e",
          secondary: "#f3f4f6",
          accent: "#8b5cf6",
          neutral: "#1c1917",
          "base-100": "#000000",
          info: "#38bdf8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#f43f5e",
        },
      },
    ],
  },
};
