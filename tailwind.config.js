module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      white: "#ffffff",
      black: "#1B1B1B",
      semitransparent: "rgba(255, 255, 255, 0.5)",
      grey: {
        100: "#f1f2f8",
      },
      blue: {
        100: "#add8e6",
        200: "#77bbd1",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
