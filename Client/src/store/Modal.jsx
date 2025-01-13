import { create } from 'zustand';

export const UseModal = create((set) => ({
    isOpen: false, // Estado inicial del modal
    setIsOpen: (open) => set({ isOpen: open }), // Método para actualizar el estado `isOpen`
    modalContent: "", // Contenido inicial del modal
    setModalContent: (content) => set({ modalContent: content }), // Método para actualizar el contenido del modal
}));

export const UseSlider = create((set) => ({
    isOpenSlider: false,
    setIsOpenSlider: (value) => set({ isOpenSlider: value }), 
  }));