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

      backgroundImage: {
        skeleton: "linear-gradient(270deg, #222, #333, #333, #222)",
      },

      keyframes: {
        popIn: {
          "0%": {
            transform: "scale(0.85)",
          },
          "40%": {
            transform: "scale(1.1)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },

        skeletonLoading: {
          "0%": {
            "background-position": "200% 0",
          },
          to: {
            "background-position": "-200% 0",
          },
        },
      },
      animation: {
        popIn: "popIn 0.25s ease-out",
        skeletonLoading: "skeletonLoading 10s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
