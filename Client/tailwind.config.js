module.exports = {
  darkMode: "class", // Modo oscuro basado en clases
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Asegúrate de que Tailwind escanee todos tus archivos
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px', // Define el breakpoint 3xl
      },
      colors: {
        primario: '#ff0d0d', // Define el color personalizado "primario"
        ModoOscuro: '#374151' // Define el color personalizado "ModoOscuro"
      },
    },
  },
  plugins: [],
};