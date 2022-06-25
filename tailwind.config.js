/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#000",
        accentOne: "#111",
        accentTwo: "#333",
        accentFour: "#EAEAEA",
        foreground: "#fff",

        highlight: "#8b5cf6",
        error: "#F33",
        success: "#0070F3",
        warning: "#F5A623",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
