import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { registerCampaign } from '../../../api/api';
import { UseActualizar, UseModal } from '../../../store/Modal';

function ModalCampWSP() {
    const setIsOpen = UseModal((state) => state.setIsOpen);
    const setModalContent = UseModal((state) => state.setModalContent);
    const setIsActualizar = UseActualizar((state) => state.setIsActualizar);

    const [programarActiva, setProgramarActiva] = useState(false);
    const [programarFecha, setProgramarFecha] = useState({ fecha: '', hora: '' });
    const [formatoData, setFormatoData] = useState('');
    const [archivoExcel, setArchivoExcel] = useState(null);
    const [telefonosNombres, setTelefonosNombres] = useState([]);
    const [selectedType, setSelectedType] = useState('texto');
    const [selectedFileImagenVideo, setSelectedFileImagenVideo] = useState(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const contenido = watch("contenido", "");

    // Manejar cambios en el input de fecha y hora
    const handleDateChange = useCallback((e) => {
        const { name, value } = e.target;
        setProgramarFecha((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    // Manejar cambios en el tipo de campaña
    const handleTypeChange = useCallback((e) => {
        setSelectedType(e.target.value);
        setSelectedFileImagenVideo(null); // Limpiar el archivo seleccionado al cambiar el tipo
    }, []);

    // Manejar la carga del archivo Excel y convertirlo a JSON
    const handleFileUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);

            const validRows = rows.filter((row) => row.Telefono);
            const telefonosNombresArray = validRows.map((row) => ({
                Tenvio: String(row.Telefono),
                Nevio: row.Nombre ? String(row.Nombre) : "",
            }));

            setArchivoExcel(file);
            setTelefonosNombres(telefonosNombresArray);
        };
        reader.readAsArrayBuffer(file);
    }, []);

    // Manejar la carga de archivos de imagen/video/PDF
    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileImagenVideo(file);
        }
    }, []);

    // Actualizar formatoData cuando fecha y hora estén completos
    useEffect(() => {
        if (programarFecha.fecha && programarFecha.hora) {
            const { fecha, hora } = programarFecha;
            const isoDate = `${fecha}T${hora}:00`;
            setFormatoData(isoDate);
        } else {
            setFormatoData('');
        }
    }, [programarFecha.fecha, programarFecha.hora]);

    // Función para manejar el clic del botón de programación
    const handleButtonClick = useCallback(() => {
        if (programarActiva && programarFecha.fecha && programarFecha.hora) {
            setProgramarFecha({ fecha: '', hora: '' });
            setProgramarActiva(false);
        } else {
            setProgramarActiva(!programarActiva);
        }
    }, [programarActiva, programarFecha.fecha, programarFecha.hora]);

    // Función para enviar el formulario
    const onSubmit = useCallback(async (data) => {
        try {
            setIsActualizar(true);
            const formData = {
                campania: data.Campania,
                titulo: data.campaignTitle || '',
                mensaje: data.contenido,
                tipo: data.Tipo,
                cantidad: telefonosNombres.length,
                media: selectedFileImagenVideo || "",
                telefonosNombres,
                fecha_pendiente: formatoData || '',
            };
            await registerCampaign(formData);
        } catch (error) {
            alert("Hubo un error al registrar la campaña. Por favor, inténtalo de nuevo.");
        } finally {
            setModalContent('');
            setIsOpen(false);
        }
    }, [telefonosNombres, selectedFileImagenVideo, formatoData, setIsActualizar, setModalContent, setIsOpen]);

    // Texto del botón de programación
    const formattedProgramarFecha = !programarActiva
        ? "Programar"
        : programarFecha.fecha && programarFecha.hora
            ? "Limpiar campo"
            : "Programar";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 text-black'>
            <div className="flex items-center min-w-96 text-base justify-between">
                <h2 className="text-2xl font-black text-white">Crear Campaña</h2>
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className='bg-red-600 font-semibold text-white py-2 px-4 rounded-lg transition-colors'
                >
                    {formattedProgramarFecha}
                </button>
            </div>
            {programarActiva && (
                <div className="input-date flex justify-between">
                    <input
                        type="date"
                        name="fecha"
                        className="date-input p-2 rounded-lg border border-ModoOscuro bg-ModoOscuro text-white"
                        onChange={handleDateChange}
                        value={programarFecha.fecha}
                    />
                    <input
                        type="time"
                        name="hora"
                        className="date-input p-2 border rounded-lg border-ModoOscuro bg-ModoOscuro text-white"
                        onChange={handleDateChange}
                        value={programarFecha.hora}
                    />
                </div>
            )}
            <div className='flex flex-col'>
                <label htmlFor="Campania" className='mb-2 font-black text-gray-400'>Nombre de la Campaña</label>
                <input
                    type="text"
                    id="Campania"
                    placeholder='Nombre de la Campaña'
                    className='p-2.5 rounded-lg outline-none text-sm bg-ModoOscuro text-white'
                    {...register("Campania", { required: "Este campo es obligatorio" })}
                />
                {errors.Campania && (
                    <span className="text-red-500 text-sm">{errors.Campania.message}</span>
                )}
            </div>
            <div>
                <label htmlFor="Tipo" className="block font-black mb-2 text-base text-gray-400">Tipo de Campaña</label>
                <select
                    id="Tipo"
                    className="bg-ModoOscuro outline-none border border-ModoOscuro text-white text-sm rounded-lg block w-full p-2.5"
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
                            className="fileInputImagenVideo bg-ModoOscuro text-gray-400 py-2 px-4 rounded-lg cursor-pointer text-sm font-semibold"
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
                        <span className="file-selected text-sm text-slate-500 mt-2">
                            {selectedFileImagenVideo ? selectedFileImagenVideo.name : "Sin archivos seleccionados"}
                        </span>
                    </div>
                )}
            </div>
            {(selectedType === "imagen" || selectedType === "video" || selectedType === "pdf") && (
                <div className="flex flex-col">
                    <label htmlFor="campaignTitle" className="block font-black mb-2 text-base text-gray-400">
                        Título de la Campaña
                        <span className="text-sm text-slate-500">
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
                        className="p-2.5 rounded-lg outline-none border border-ModoOscuro bg-ModoOscuro text-sm text-white"
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
                <label htmlFor="contenido" className="block mb-2 font-black text-base text-gray-400">Contenido de la Campaña</label>
                <textarea
                    id="contenido"
                    rows="4"
                    maxLength={500}
                    placeholder="Escribe el contenido de tu campaña"
                    className="block p-2.5 outline-none w-full text-sm bg-ModoOscuro rounded-lg border text-white border-ModoOscuro focus:ring-blue-500"
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
                <span className='font-black text-base text-gray-400'>Adjuntar Archivo Excel</span>
                <div className='flex justify-between'>
                    <div className="custom-file-upload">
                        <label htmlFor="file-upload" className="file-label bg-ModoOscuro font-semibold text-slate-300 py-2 px-4 rounded-lg cursor-pointer ">
                            SELECCIONAR EXCEL
                        </label>
                        <input onChange={handleFileUpload} id="file-upload" type="file" accept=".xlsx,.xls" className="hidden" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className=' text-sm text-slate-500'>{archivoExcel ? archivoExcel.name : "archivo excel"}</span>
                        {archivoExcel && (
                            <span className="text-sm text-slate-500">
                                {telefonosNombres.length} personas
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex justify-between items-center mt-2'>
                <button type="submit" className='p-2 rounded-lg w-24 text-white font-bold bg-green-600'>Enviar</button>
                <button onClick={() => {
                    setModalContent('');
                    setIsOpen(false)
                }} type="button" className='p-2 rounded-lg w-24 text-white font-bold bg-red-600'>Cancelar</button>
            </div>
        </form>
    );
}

export default React.memo(ModalCampWSP);