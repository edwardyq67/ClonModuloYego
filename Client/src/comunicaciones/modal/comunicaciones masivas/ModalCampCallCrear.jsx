import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { UseActualizar, UseModal, UseSlider } from '../../../store/Modal';
import { registerCamapaingCall } from '../../../api/api';

function ModalCampCallCrear() {
    const setIsOpen = UseModal((state) => state.setIsOpen);
    const setModalContent = UseModal((state) => state.setModalContent);
    const setIsActualizar = UseActualizar((state) => state.setIsActualizar)
    const setIsOpenSlider = UseSlider((state) => state.setIsOpenSlider)

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [archivoExcel, setArchivoExcel] = useState(null);
    const [archivoAudio, setArchivoAudio] = useState(null);
    const [TelefonosNombres, setTelefonosNombres] = useState([]);

    // Función para manejar el envío del formulario
    const onSubmit = async (data) => {
        try {
            setIsOpenSlider(true); // Activar el slider de carga
            setIsActualizar(true); // Indicar que se está actualizando
    
            // Llamar a la función para registrar la campaña
            await registerCamapaingCall(data, TelefonosNombres, archivoAudio);
    
            // Cerrar el modal y restablecer el contenido
            setModalContent('');
            setIsOpen(false);
        } catch (error) {
            console.error("Error al registrar la campaña:", error);
            alert("Hubo un error al registrar la campaña. Por favor, inténtalo de nuevo.");
        } finally {
            setIsOpenSlider(false); // Desactivar el slider de carga
            setIsActualizar(true); // Restablecer el estado de actualización
        }
    };

    // Función para manejar la carga de archivos Excel
    const handleFileUploadExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);

            // Filtra solo los registros que tienen un teléfono y convierte el teléfono a string
            const telefonosArray = rows
                .filter((row) => row.Telefono) // Filtra solo por teléfono
                .map((row) => String(row.Telefono)); // Convierte el teléfono a string

            // Eliminar duplicados
            const telefonosUnicos = [...new Set(telefonosArray)];

            setArchivoExcel(file); // Guardar el archivo en el estado
            setTelefonosNombres(telefonosUnicos); // Guardar el array de teléfonos en el estado
        };
        reader.readAsArrayBuffer(file);
    };

    // Función para manejar la carga de archivos de audio
    const handleFileUploadAudio = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setArchivoAudio(file); // Guardar el archivo en el estado
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 text-black'>
            <h2 className="text-2xl font-black text-white">Crear Campaña</h2>
            <div className='flex flex-col'>
                <label htmlFor="Campania" className='mb-2 font-black text-white'>Nombre de la Campaña</label>
                <input
                    type="text"
                    id="Campania"
                    placeholder='Nombre de la Campaña'
                    className='p-2.5 rounded-lg outline-none text-sm'
                    {...register('Campania', { required: 'Este campo es obligatorio' })}
                />
                {errors.Campania && (
                    <span className="text-red-500 text-sm">{errors.Campania.message}</span>
                )}
            </div>

            {/* Sección para adjuntar archivo Excel */}
            <div className='flex flex-col gap-3'>
                <span className='font-black text-base text-white'>Adjuntar Archivo Excel</span>
                <div className='flex justify-between'>
                    <div className="custom-file-upload">
                        <label htmlFor="file-upload-excel" className="file-label bg-gray-600 font-semibold text-white py-2 px-4 rounded-lg cursor-pointer">
                            SELECCIONAR EXCEL
                        </label>
                        <input
                            onChange={handleFileUploadExcel}
                            id="file-upload-excel"
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                        />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className='text-sm text-gray-500'>{archivoExcel ? archivoExcel.name : 'Ningún archivo seleccionado'}</span>
                        {archivoExcel && (
                            <span className="text-sm text-gray-500">
                                {TelefonosNombres.length} personas
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Sección para adjuntar archivo de audio */}
            <div className='flex flex-col gap-3 max-w-96 min-w-96'>
                <span className='font-black text-base text-white'>Adjuntar Audio (WAV)</span>
                <div className='flex justify-between '>
                    <div className="custom-file-upload">
                        <label htmlFor="file-upload-audio" className="file-label bg-gray-600 font-semibold text-white py-2 px-4 rounded-lg cursor-pointer">
                            SELECCIONAR AUDIO
                        </label>
                        <input
                            onChange={handleFileUploadAudio}
                            id="file-upload-audio"
                            type="file"
                            accept=".wav"
                            className="hidden"
                        />
                    </div>
                    <div className="flex flex-col items-end ">
                        <span className='text-sm text-gray-500'>{archivoAudio ? archivoAudio.name : 'Ningún archivo seleccionado'}</span>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className='flex justify-between items-center'>
                <button type="submit" className='p-2 rounded-lg w-24 text-white font-bold bg-green-500 hover:bg-green-600 transition-colors'>
                    Enviar
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setModalContent('');
                        setIsOpen(false);
                    }}
                    className='p-2 rounded-lg w-24 text-white font-bold bg-red-500 hover:bg-red-600 transition-colors'
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}

export default ModalCampCallCrear;