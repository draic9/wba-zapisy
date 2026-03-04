/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      // default text / font-sans
      sans: [
        "Inter",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "sans-serif",
      ],
      // headings
      heading: [
        "Bebas Neue",
        "Inter",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "sans-serif",
      ],
    },
    extend: {
      colors: {
        body: {
          DEFAULT: "#f9fafb",
          bg: "#000000",
        },
      },
      textColor: {
        body: "#f9fafb",
      },
      backgroundColor: {
        body: "#000000",
      },
    },
  },
  plugins: [],
};