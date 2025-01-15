import { create } from 'zustand';

export const UseTema=create((set)=>({
  isDarkMode: localStorage.getItem("darkMode") === "true", // Inicializar desde localStorage
  setIsDarkMode: (value) => {
    localStorage.setItem("darkMode", value); // Guardar en localStorage
    set({ isDarkMode: value });
  },
}))