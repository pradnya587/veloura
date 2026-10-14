/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2430",
        bone: "#EDE7DD",
        amber: "#C99A3E",
        sage: "#6B7A5E",
        clay: "#B65C43",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
