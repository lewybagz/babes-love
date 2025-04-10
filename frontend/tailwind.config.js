/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#f23fe3",
          50: "#fef1fd",
          100: "#fde4fb",
          200: "#fcc8f7",
          300: "#f99dee",
          400: "#f566e5",
          500: "#f23fe3",
          600: "#db1fc9",
          700: "#ba14a8",
          800: "#991389",
          900: "#7e1570",
          950: "#520045",
        },
      },
      fontFamily: {
        sans: ["Quicksand", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Open Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#333",
            a: {
              color: "#f23fe3",
              "&:hover": {
                color: "#db1fc9",
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
};
