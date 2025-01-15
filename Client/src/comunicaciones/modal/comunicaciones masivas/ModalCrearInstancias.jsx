import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { UseActualizar, UseModal } from '../../../store/Modal';
import { createInstance } from '../../../api/api';

function ModalCrearInstancias() {
    const setIsOpen = UseModal((state) => state.setIsOpen);
    const setModalContent = UseModal((state) => state.setModalContent);
    const setIsActualizar = UseActualizar((state) => state.setIsActualizar);

    // Inicializar react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Función para manejar el envío del formulario
    const onSubmit = useCallback(async (data) => {
        try {
            setIsActualizar(true); // Activar el estado de actualización
            await createInstance(data.instanceName); // Crear la instancia
            setModalContent(''); // Limpiar el contenido del modal
            setIsOpen(false); // Cerrar el modal
        } catch (error) {
            console.error('Error al crear la instancia:', error);
            alert("Hubo un error al crear la instancia. Por favor, inténtalo de nuevo.");
        } finally {
            setIsActualizar(false); // Restablecer el estado de actualización
        }
    }, [setIsActualizar, setModalContent, setIsOpen]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
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

export default React.memo(ModalCrearInstancias);