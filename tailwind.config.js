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

        highlight: "hsl(258, 80%, 60%)",
        highlightHover: "hsl(258, 75%, 55%)",
        highlightActive: "hsl(258, 55%, 47%)",

        secondary: "hsl(0, 0%, 20%)",
        secondaryHover: "hsl(0, 0%, 25%)",
        secondaryActive: "hsl(0, 0%, 30%)",

        alert: "hsl(359, 80%, 50%)",
        alertHover: "hsl(359, 75%, 45%)",
        alertActive: "hsl(359, 75%, 37%)",

        success: "hsl(146, 80%, 40%)",
        successHover: "hsl(146, 75%, 35%)",
        successActive: "hsl(146, 55%, 27%)",

        warning: "hsl(37, 91%, 55%)",
        warningHover: "hsl(37, 86%, 50%)",
        warningActive: "hsl(37, 66%, 42%)",
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
