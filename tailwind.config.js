/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#018EDE",
          "blue-hover": "#0177ba",
          "blue-light": "#EBF6FD",
          navy: "#0C3D4C",
          "navy-light": "#154f61",
          bg: "#F5FBFF",
          card: "#FFFFFF",
          border: "#E2EEF5",
          success: "#00BE61",
          error: "#EF4444",
          warning: "#F59E0B",
          text: "#0C3D4C",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["Roboto", "Rubik", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        heading: ["Rubik", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(12, 61, 76, 0.06), 0 4px 16px -2px rgba(12, 61, 76, 0.04)",
        "card-hover": "0 8px 24px -4px rgba(12, 61, 76, 0.1), 0 4px 12px -2px rgba(12, 61, 76, 0.06)",
        modal: "0 20px 25px -5px rgba(12, 61, 76, 0.1), 0 10px 10px -5px rgba(12, 61, 76, 0.04)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
