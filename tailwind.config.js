/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#000",
        foreground: "#F5F6F7",
        darkOne: "#161616",
        darkTwo: "#333",
        grayAlt: "#888",
        whiteAlt: "#fff",

        highlight: "#8b5cf6",
        error: "#F33",
        success: "#0070F3",
        warning: "#F5A623",
      },

      backgroundImage: {
        skeletonDark: "linear-gradient(90deg, #222, #333, #333, #222)",
        skeleton: "linear-gradient(90deg,#cfcfcf, #dcdcdc,#dcdcdc, #cfcfcf)",
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
        skeletonLoading: "skeletonLoading 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
