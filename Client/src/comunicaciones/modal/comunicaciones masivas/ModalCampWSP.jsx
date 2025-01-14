import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { registerCampaign } from '../../../api/api';
import { UseActualizar, UseModal } from '../../../store/Modal';

function ModalCampWSP() {
    const setIsOpen = UseModal((state) => state.setIsOpen)
    const setModalContent = UseModal((state => state.setModalContent))
    const setIsActualizar = UseActualizar((state) => state.setIsActualizar)

    const [programarActiva, setProgramarActiva] = useState(false);
    const [programarFecha, setProgramarFecha] = useState({ fecha: '', hora: '' });
    const [formatoData, setFormatoData] = useState('');
    const [archivoExcel, setArchivoExcel] = useState(null);
    const [TelefonosNombres, setTelefonosNombres] = useState([]); // Estado para almacenar el JSON del Excel
    const [selectedType, setSelectedType] = useState('texto'); // Estado para el tipo de campaña
    const [selectedFileImagenVideo, setSelectedFileImagenVideo] = useState(null); // Estado para el archivo de imagen/video/PDF

    // Configuración de React Hook Form
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const contenido = watch("contenido", ""); // Observar el campo "contenido"

    // Manejar cambios en el input de fecha
    const handleDateChange = (e) => {
        const fecha = e.target.value;
        setProgramarFecha((prev) => ({
            ...prev,
            fecha,
        }));
    };

    // Manejar cambios en el input de hora
    const handleTimeChange = (e) => {
        const hora = e.target.value;
        setProgramarFecha((prev) => ({
            ...prev,
            hora,
        }));
    };

    // Manejar cambios en el tipo de campaña
    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        setSelectedFileImagenVideo(null); // Limpiar el archivo seleccionado al cambiar el tipo
    };

    // Manejar la carga del archivo Excel y convertirlo a JSON
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);

            // Asegurarse de que cada `Telefono` sea una cadena y si no tiene un nombre asignado, usar una cadena vacía
            const validRows = rows.filter((row) => row.Telefono); // Filtra solo por teléfono
            const telefonosNombresArray = validRows.map((row) => ({
                Tenvio: String(row.Telefono),
                Nevio: row.Nombre ? String(row.Nombre) : "", // Si 'Nombre' no existe, asignar una cadena vacía
            }));

            setArchivoExcel(file); // Guardar el archivo en el estado
            setTelefonosNombres(telefonosNombresArray); // Guardar el JSON en el estado
        };
        reader.readAsArrayBuffer(file);
    };

    // Manejar la carga de archivos de imagen/video/PDF
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileImagenVideo(file); // Guardar el archivo completo, no solo el nombre
        }
    };

    // Actualizar formatoData cuando fecha y hora estén completos
    useEffect(() => {
        if (programarFecha.fecha && programarFecha.hora) {
            const { fecha, hora } = programarFecha;
            const isoDate = `${fecha}T${hora}:00`; // Crear fecha en formato ISO
            setFormatoData(isoDate);
        } else {
            setFormatoData(''); // Limpiar si falta fecha o hora
        }
    }, [programarFecha.fecha, programarFecha.hora]);

    // Función para manejar el clic del botón
    const handleButtonClick = () => {
        if (programarActiva && programarFecha.fecha && programarFecha.hora) {
            // Limpiar campos y desactivar programarActiva
            setProgramarFecha({ fecha: '', hora: '' });
            setProgramarActiva(false);
        } else {
            // Activar programarActiva
            setProgramarActiva(!programarActiva);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsActualizar(true)
            const formData = {
                campania: data.Campania,
                titulo: data.campaignTitle || '',
                mensaje: data.contenido,
                tipo: data.Tipo,
                cantidad: TelefonosNombres.length,
                media: selectedFileImagenVideo || "",
                telefonosNombres: TelefonosNombres,
                fecha_pendiente: formatoData || '',
            };
            await registerCampaign(formData)
        } catch (error) {
            alert("Hubo un error al registrar la campaña. Por favor, inténtalo de nuevo.");
        } finally {
            setModalContent('');
            setIsOpen(false)
        }
    };

    // Texto del botón
    const formattedProgramarFecha = !programarActiva
        ? "Programar"
        : programarFecha.fecha && programarFecha.hora
            ? "Limpiar campo"
            : "Programar";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 text-black'>
            <div className="flex items-center min-w-96 text-base justify-between">
                <h2 className="text-2xl font-black text-white">Crear Campaña</h2>
                <button
                    type="button" // Evita que el botón envíe el formulario
                    onClick={handleButtonClick}
                    className='bg-primario text-white py-2 px-4 rounded-lg hover:bg-primario transition-colors'
                >
                    {formattedProgramarFecha}
                </button>
            </div>
            {programarActiva && (
                <div className="input-date flex justify-between">
                    <input
                        type="date"
                        className="date-input p-2 border rounded-lg"
                        onChange={handleDateChange}
                        value={programarFecha.fecha}
                    />
                    <input
                        type="time"
                        className="date-input p-2 border rounded-lg"
                        onChange={handleTimeChange}
                        value={programarFecha.hora}
                    />
                </div>
            )}
            <div className='flex flex-col'>
                <label htmlFor="Campania" className='mb-2 font-black text-white'>Nombre de la Campaña</label>
                <input
                    type="text"
                    id="Campania"
                    placeholder='Nombre de la Campaña'
                    className='p-2.5 rounded-lg outline-none text-sm'
                    {...register("Campania", { required: "Este campo es obligatorio" })}
                />
                {errors.Campania && (
                    <span className="text-red-500 text-sm">{errors.Campania.message}</span>
                )}
            </div>
            <div>
                <label htmlFor="Tipo" className="block font-black mb-2 text-base text-white">Tipo de Campaña</label>
                <select
                    id="Tipo"
                    className="bg-gray-50 outline-none border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                    {...register("Tipo", { required: "Este campo es obligatorio" })}
                    onChange={handleTypeChange}
                >
                    <option value="texto">Texto</option>
                    <option value="imagen">Imagen</option>
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                </select>
                {errors.Tipo && (
                    <span className="text-red-500 text-sm">{errors.Tipo.message}</span>
                )}
                {(selectedType === "imagen" || selectedType === "video" || selectedType === "pdf") && (
                    <div className="divfileInputImagenVideo mt-4 flex justify-between max-w-96">
                        <label
                            className="fileInputImagenVideo bg-gray-600 text-white py-2 px-4 rounded-lg cursor-pointer text-sm font-semibold"
                            htmlFor="file-upload-imagen-video"
                        >
                            SELECCIONAR {selectedType.toUpperCase()}
                        </label>
                        <input
                            onChange={handleFileChange}
                            type="file"
                            id="file-upload-imagen-video"
                            accept={
                                selectedType === "imagen"
                                    ? "image/*"
                                    : selectedType === "video"
                                        ? "video/*"
                                        : "application/pdf"
                            }
                            className="hidden"
                        />
                        <span className="file-selected text-sm text-gray-500 mt-2">
                            {selectedFileImagenVideo ? selectedFileImagenVideo.name : "Sin archivos seleccionados"}
                        </span>
                    </div>
                )}
            </div>
            {(selectedType === "imagen" || selectedType === "video" || selectedType === "pdf") && (
                <div className="flex flex-col">
                    <label htmlFor="campaignTitle" className="block font-black mb-2 text-base text-white">
                        Título de la Campaña
                        <span className="text-sm text-gray-500">
                            {` (Para ${selectedType === "imagen"
                                ? "Imagen"
                                : selectedType === "video"
                                    ? "Video"
                                    : "PDF"
                                })`}
                        </span>
                    </label>
                    <input
                        type="text"
                        id="campaignTitle"
                        placeholder="Título de la Campaña"
                        className="p-2.5 rounded-lg outline-none border border-gray-300 text-sm"
                        {...register("campaignTitle", {
                            required: selectedType !== "texto" ? "Este campo es obligatorio" : false,
                        })}
                    />
                    {errors.campaignTitle && (
                        <span className="text-red-500 text-sm">{errors.campaignTitle.message}</span>
                    )}
                </div>
            )}
            <div>
                <label htmlFor="contenido" className="block mb-2 font-black text-base text-white">Contenido de la Campaña</label>
                <textarea
                    id="contenido"
                    rows="4"
                    maxLength={500}
                    placeholder="Escribe el contenido de tu campaña"
                    className="block p-2.5 outline-none w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500"
                    {...register("contenido", {
                        required: "Este campo es obligatorio",
                        maxLength: {
                            value: 500,
                            message: "El contenido no puede exceder los 500 caracteres",
                        },
                    })}
                />
                <div className="text-sm text-gray-500 mt-1">
                    {contenido.length}/500 caracteres
                </div>
                {errors.contenido && (
                    <span className="text-red-500 text-sm">{errors.contenido.message}</span>
                )}
            </div>
            <div className='flex flex-col gap-3'>
                <span className='font-black text-base text-white'>Adjuntar Archivo Excel</span>
                <div className='flex justify-between'>
                    <div className="custom-file-upload">
                        <label htmlFor="file-upload" className="file-label bg-gray-600 font-semibold text-white py-2 px-4 rounded-lg cursor-pointer ">
                            SELECCIONAR EXCEL
                        </label>
                        <input onChange={handleFileUpload} id="file-upload" type="file" accept=".xlsx,.xls" className="hidden" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className=' text-sm text-gray-500'>{archivoExcel ? archivoExcel.name : "archivo excel"}</span>
                        {archivoExcel && (
                            <span className="text-sm text-gray-500">
                                {TelefonosNombres.length} personas
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex justify-between items-center mt-5'>
                <button type="submit" className='p-2 rounded-lg w-24 text-white font-bold bg-green-500'>Enviar</button>
                <button onClick={() => {
                    setModalContent('');
                    setIsOpen(false)
                }} type="button" className='p-2 rounded-lg w-24 text-white font-bold bg-red-500'>Cancelar</button>
            </div>
        </form>
    );
}

export default ModalCampWSP;