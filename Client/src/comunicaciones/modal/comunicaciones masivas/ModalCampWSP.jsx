import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';

function ModalCampWSP() {
    const [programarActiva, setProgramarActiva] = useState(false);
    const [programarFecha, setProgramarFecha] = useState({ fecha: '', hora: '' });
    const [formatoData, setFormatoData] = useState('');
    const [archivoExcel, setArchivoExcel] = useState(null);
    const [TelefonosNombres, setTelefonosNombres] = useState([]); // Estado para almacenar el JSON del Excel

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

    // Función para manejar el envío del formulario
    const onSubmit = (data) => {
        const formData = {
            Campania: data.Campania,
            Titulo: data.Titulo || '', // Si no hay título, asignar una cadena vacía
            Mensaje: data.contenido,
            Tipo: data.Tipo,
            Cantidad: TelefonosNombres.length, // Cantidad de registros en el archivo Excel
            Empresa: "Yego", // Valor fijo
            Media: "", // Valor fijo
            TelefonosNombres: TelefonosNombres, // Datos del archivo Excel
            fecha_pendiente: formatoData || '', // Fecha programada o cadena vacía
        };
        console.log('Datos del formulario:', formData);
        console.log('Excel convertido a JSON:', TelefonosNombres); // Mostrar el JSON del Excel en la consola
    };

    // Texto del botón
    const formattedProgramarFecha = !programarActiva
        ? "Programar"
        : programarFecha.fecha && programarFecha.hora
            ? "Limpiar campo"
            : "Programar";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 text-black'>
            <div className="flex items-center w-96 text-base justify-between">
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
                    className='p-2.5 rounded-lg outline-none'
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
                >
                    <option value="texto">Texto</option>
                    <option value="imagen">Imagen</option>
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                </select>
                {errors.Tipo && (
                    <span className="text-red-500 text-sm">{errors.Tipo.message}</span>
                )}
            </div>
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
            <span className='font-black text-base text-white'>Adjuntar Archivo Excel</span>
            <div className='flex justify-between'>
                <div className="custom-file-upload">
                    <label htmlFor="file-upload" className="file-label">
                        Seleccionar Excel
                    </label>
                    <input onChange={handleFileUpload} id="file-upload" type="file" accept=".xlsx,.xls" />
                </div>
                <span className='text-white font-bold'>archivo excel</span>
            </div>

            <div className='flex justify-between items-center mt-5'>
                <button type="submit" className='p-2 rounded-lg w-24 text-white font-bold bg-green-500'>Enviar</button>
                <button type="button" className='p-2 rounded-lg w-24 text-white font-bold bg-red-500'>Cancelar</button>
            </div>
        </form>
    );
}

export default ModalCampWSP;