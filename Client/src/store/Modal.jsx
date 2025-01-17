import { create } from 'zustand';

export const UseModal = create((set) => ({
    isOpen: false, // Estado inicial del modal
    setIsOpen: (open) => set({ isOpen: open }), // Método para actualizar el estado `isOpen`
    modalContent: "", // Contenido inicial del modal
    setModalContent: (content) => set({ modalContent: content }), // Método para actualizar el contenido del modal
}));
//carga
export const UseSlider = create((set) => ({
    isOpenSlider: false,
    setIsOpenSlider: (value) => set({ isOpenSlider: value }), 
  }));

  export const UseActualizar=create((set) => ({
    isActualizar: false,
    setIsActualizar: (value) => set({ isActualizar: value }), 
  }));
//modal para forzar detencion
  export const UseModalLogin=create((set)=>({
    isModalLogin: false,
    setIsModalLogin: (value) => set({ isModalLogin: value }), 
  }))
//guardar el login si hay error 409
export const useLogin409 = create((set) => ({
  useUsername: "", 
  setUsername: (value) => set({ useUsername: value }), 

  usePassword:"",
  setPassword: (value) => set({ usePassword: value }), 
}));