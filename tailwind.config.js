/** @type {import('tailwindcss').Config} */
const mono = ["var(--term-font)", "ui-monospace", "monospace"];
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: mono,
        serif: mono,
        mono: mono,
      },
      // Default hairline border for the terminal theme
      borderColor: {
        DEFAULT: "var(--term-border)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
