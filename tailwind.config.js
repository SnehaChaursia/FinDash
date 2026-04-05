/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Teal-green accent inspired by Groww-style fintech UIs (not affiliated).
        brand: {
          50: "#ecfdf7",
          100: "#d0f5e8",
          200: "#a3e8d4",
          300: "#6dd4ba",
          400: "#35b898",
          500: "#00b386",
          600: "#009975",
          700: "#007a5e",
          800: "#06614c",
          900: "#06503f",
        },
        surface: {
          DEFAULT: "#f6f7f8",
          muted: "#eef0f2",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.06)",
        "card-sm": "0 1px 2px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
};

