/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#003a2f",
          container: "#0b5345",
          fixed: "#afefdc",
          "fixed-dim": "#93d3c1",
          light: "#145a4a",
        },
        secondary: {
          DEFAULT: "#855300",
          container: "#fea619",
          fixed: "#ffddb8",
          "fixed-dim": "#ffb95f",
          dark: "#653e00",
        },
        tertiary: {
          DEFAULT: "#003847",
          container: "#005065",
          light: "#73c3e2",
        },
        surface: {
          DEFAULT: "#faf8ff",
          dim: "#d2d9f4",
          bright: "#faf8ff",
          container: "#eaedff",
          "container-low": "#f2f3ff",
          "container-lowest": "#ffffff",
          "container-high": "#e2e7ff",
          "container-highest": "#dae2fd",
        },
        "on-surface": "#131b2e",
        "on-surface-variant": "#3f4945",
        outline: "#707975",
        "outline-variant": "#bfc9c4",
      },
      fontFamily: {
        headline: ['"Public Sans"', 'sans-serif'],
        body: ['"Source Sans 3"', '"Public Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 58, 47, 0.05)",
        cardHover: "0 8px 24px rgba(0, 58, 47, 0.10)",
      }
    },
  },
  plugins: [],
}
