import React, { useState } from "react";
import { UseModal } from "../../store/Modal";

function AgregarComunicaciones() {
const setModalContent=UseModal((state=>state.setModalContent))

    const [isDefaultChecked, setIsDefaultChecked] = useState(false); // Estado para el primer checkbox
    const [isChecked, setIsChecked] = useState(false); // Estado para el segundo checkbox
    const [tipoSeleccionado, setTipoSeleccionado] = useState(""); // Estado para el tipo seleccionado
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null); // Estado para el archivo seleccionado

    const handleFileUpload = (event) => {
        setArchivoSeleccionado(event.target.files[0]); // Actualiza el estado con el archivo seleccionado
    };

    return (
        <form className="w-96 grid gap-4">
            <h2 className="text-2xl font-black text-white">Crear Comunicación</h2>
            <div className="flex gap-4 absolute right-4 top-20">
                    <div className="flex items-center">
                        <input
                            id="default-checkbox"
                            type="checkbox"
                            checked={isDefaultChecked} // Vinculado al estado
                            onChange={(e) => setIsDefaultChecked(e.target.checked)} // Actualiza el estado
                            className="w-4 h-4 bg-gray-100 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                            htmlFor="default-checkbox"
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            WhatsApp
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="checked-checkbox"
                            type="checkbox"
                            checked={isChecked} // Vinculado al estado
                            onChange={(e) => setIsChecked(e.target.checked)} // Actualiza el estado
                            className="w-4 h-4 bg-gray-100 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                            htmlFor="checked-checkbox"
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            Yandex
                        </label>
                    </div>
                </div>
            <div>
                <label htmlFor="titulo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Titulo
                </label>
                <input
                    id="titulo"
                    type="text"
                    className="block p-2.5 w-full text-sm outline-none text-gray-900 rounded-lg dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="mensaje" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Mensaje
                </label>
                <textarea
                    id="mensaje"
                    rows="4"
                    className="block p-2.5 w-full text-sm outline-none text-gray-900 bg-gray-50 rounded-lg dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Escribe tu mensaje aquí..."
                ></textarea>
            </div>
            <div className="flex justify-between">
                <div className="max-w-sm">
                    <label htmlFor="modo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Modo
                    </label>
                    <select
                        id="modo"
                        className="bg-gray-50 border outline-none text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    >
                        <option value="Otros">Otros</option>
                        <option value="Auto">Auto</option>
                        <option value="Moto">Moto</option>
                        <option value="Carga">Carga</option>
                    </select>
                </div>
                
                <div className="max-w-sm">
                    <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Tipo
                    </label>
                    <select
                        id="tipo"
                        value={tipoSeleccionado}
                        onChange={(e) => setTipoSeleccionado(e.target.value)} // Actualiza el estado del tipo seleccionado
                        className="bg-gray-50 border outline-none text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    >
                        <option value="">Ninguno</option>
                        <option value="Imagen">Imagen</option>
                        <option value="Video">Video</option>
                        <option value="Audio">Audio</option>
                        <option value="PDF">PDF</option>
                    </select>
                </div>
            </div>

            {/* Mostrar campo de carga de archivo según el tipo seleccionado */}
            {tipoSeleccionado && tipoSeleccionado !== "Ninguno" && (
                <div className="flex justify-between gap-2 items-center">
                    <label
                        htmlFor="file-upload"
                        className="font-medium text-gray-900 dark:text-white bg-gray-700 p-2.5 rounded-lg cursor-pointer"
                    >
                        Seleccionar {tipoSeleccionado}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept={
                            tipoSeleccionado === "Imagen"
                                ? "image/*"
                                : tipoSeleccionado === "Video"
                                ? "video/*"
                                : tipoSeleccionado === "Audio"
                                ? "audio/*"
                                : tipoSeleccionado === "PDF"
                                ? ".pdf"
                                : ""
                        }
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-500">
                        {archivoSeleccionado ? archivoSeleccionado.name : "Ningún archivo seleccionado"}
                    </span>
                </div>
            )}
            
             <div className='flex justify-between items-center'>
                
                <button
                    type="button"
                
                    className='p-2 rounded-lg w-24 text-white font-bold bg-red-500 hover:bg-red-600 transition-colors'
                >
                    Cancelar
                </button>
                <button onClick={()=>setModalContent("Modal de agregar Comunicacion Grupos y comunidad agregar")} className='p-2 rounded-lg w-24 text-white font-bold bg-blue-500 hover:bg-blue-600 transition-colors'>
                    Siguiente
                </button>
            </div>
        </form>
    );
}

export default AgregarComunicaciones;
