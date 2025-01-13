import { create } from 'zustand';

export const UseSibar = create((set) => ({
    valorModulo: 1,
    setValorModulo: (nav) => set({ valorModulo: nav }), 

    siberNav: [], // Inicializado como un arreglo vacío
    setSiberNav: (nav) => set({ siberNav: nav || [] }), // Asegurar que siempre sea un arreglo
}));
export const UsePixelarSiber = create((set) => ({
    pixelesSiber: false,
    setPixelSiber: () => set((state) => ({ pixelesSiber: !state.pixelesSiber })), // Cambiar `valor` por `pixelesSiber`
  }));
  