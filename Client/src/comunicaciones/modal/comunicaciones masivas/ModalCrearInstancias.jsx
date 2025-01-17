import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UseActualizar, UseModal } from '../../../store/Modal';
import { createInstance } from '../../../api/api';

function ModalCrearInstancias() {
    const [imgQR, setImgQR] = useState(null);
    const [cargando, setCargando] = useState(true); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const [segundosRestantes, setSegundosRestantes] = useState(20); // Contador de segundos

    const setIsOpen = UseModal((state) => state.setIsOpen);
    const setModalContent = UseModal((state) => state.setModalContent);
    const setIsActualizar = UseActualizar((state) => state.setIsActualizar);

    // Inicializar react-hook-form
    const { handleSubmit } = useForm();

    useEffect(() => {
        const fetchQR = async () => {
            try {
                const response = await createInstance();

                // Crear URL del QR desde el blob recibido
                const qrBlob = new Blob([response.data], { type: "image/png" });
                const qrUrl = URL.createObjectURL(qrBlob);
                setImgQR(qrUrl); // Actualizar el estado con la URL del QR
                setError(null); // Limpiar errores si la solicitud es exitosa
            } catch (error) {
                console.error("Error al crear la instancia o generar el QR:", error);
                setError("No se pudo generar el código QR. Inténtalo de nuevo."); // Mostrar mensaje de error
            } finally {
                setCargando(false); // Finalizar el estado de carga
            }
        };

        fetchQR(); // Llamar a la función asíncrona

        // Configurar el intervalo para actualizar el QR cada 20 segundos
        const intervalo = setInterval(() => {
            setSegundosRestantes(20); // Reiniciar el contador
            fetchQR(); // Volver a generar el QR
        }, 20000); // 20 segundos

        // Limpieza de la URL del objeto y del intervalo cuando el componente se desmonta
        return () => {
            clearInterval(intervalo); // Detener el intervalo
            if (imgQR) {
                URL.revokeObjectURL(imgQR); // Liberar la URL del objeto
            }
        };
    }, []); // Dependencias vacías para que se ejecute solo una vez

    // Contador de segundos
    useEffect(() => {
        const intervaloContador = setInterval(() => {
            setSegundosRestantes((prev) => (prev > 0 ? prev - 1 : 20)); // Decrementar el contador
        }, 1000); // Actualizar cada segundo

        // Limpieza del intervalo del contador
        return () => clearInterval(intervaloContador);
    }, []);

    // Función para manejar el envío del formulario
    const onSubmit = useCallback(async () => {
        try {
            setIsActualizar(true); // Activar el estado de actualización
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
                Escanea este código QR
            </label>

            {/* Mostrar el código QR o mensajes de carga/error */}
            {cargando ? (
                <p className="text-center text-white">Cargando código QR...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <>
                    <img src={imgQR} alt="Código QR" className="mx-auto" />
                    <p className="text-center font-semibold text-white w-96">
                        Faltan {segundosRestantes} segundos para la próxima actualización.
                    </p>
                </>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between gap-4">
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
                    Siguiente
                </button>
            </div>
        </form>
    );
}

export default React.memo(ModalCrearInstancias);