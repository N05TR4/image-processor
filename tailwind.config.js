/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#4cb749",
          secondary: "#6366F1",
          background: "#F9FAFB",
          accent: "#3730A3",
        },
      },
    },
    plugins: [],
  }