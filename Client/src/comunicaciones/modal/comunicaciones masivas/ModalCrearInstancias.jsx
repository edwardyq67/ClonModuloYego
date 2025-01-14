import React from 'react';
import { useForm } from 'react-hook-form'; // Importar useForm
import axios from 'axios'; // Importar axios
import { UseActualizar, UseModal } from '../../../store/Modal';
import { createInstance } from '../../../api/api';

// Definir la URL de la API (ajusta esto según tu entorno)
const API_URL = 'https://api.ejemplo.com';

function ModalCrearInstancias() {
  const setIsOpen = UseModal((state) => state.setIsOpen);
  const setModalContent = UseModal((state) => state.setModalContent);
const setIsActualizar=UseActualizar((state)=>state.setIsActualizar)
  // Inicializar react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Función para manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      // Llamar a la API para crear la instancia
      setIsActualizar(true)
      await createInstance(data.instanceName);
      // Cerrar el modal y limpiar el contenido
      setModalContent('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error al crear la instancia:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <label htmlFor="instanceName" className="text-center block font-black mb-2 text-2xl text-white">
          Crear Nueva Instancia
        </label>
        <input
          type="text"
          id="instanceName"
          placeholder="Nombre de la Instancia"
          className="p-2.5 rounded-lg outline-none border text-black border-gray-300 text-sm max-w-[80vw] w-96"
          {...register('instanceName', {
            required: 'Este campo es obligatorio', // Mensaje de error si el campo está vacío
          })}
        />
        {errors.instanceName && (
          <span className="text-red-500 text-sm">{errors.instanceName.message}</span>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between gap-4 mt-6">
        <button
          type="button"
          onClick={() => {
            setModalContent('');
            setIsOpen(false);
          }}
          className="p-2 rounded-lg w-24 text-white font-bold bg-red-500 hover:bg-red-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="p-2 rounded-lg w-24 text-white font-bold bg-green-500 hover:bg-green-600 transition-colors"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}

export default ModalCrearInstancias;