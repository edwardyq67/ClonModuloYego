import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { IoMdAdd } from 'react-icons/io';
import { fetchComunicaciones } from '../api/api';
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt, FaEye, FaCopy } from "react-icons/fa";
import { IoImages, IoDocumentText, IoVideocam, IoMusicalNote, IoCloseCircleOutline } from "react-icons/io5";
import { UseModal } from '../store/Modal';


function Registro() {
    const setModalContent=UseModal((state=>state.setModalContent))
    const setIsOpen=UseModal((state)=>state.setIsOpen)
    const [busqueda, setBusqueda] = useState("");
    const [data, setData] = useState([]);
    const [expandedId, setExpandedId] = useState(null); // Estado para manejar el acordeón

    useEffect(() => {
        const obtenerComunicaciones = async () => {
            try {
                const result = await fetchComunicaciones();
                setData(result.data.comunicaciones || []); // Aseguramos que comunicaciones esté definido
            } catch (error) {
                console.error("Error al obtener las comunicaciones:", error);
            }
        };

        obtenerComunicaciones();
    }, []);

    useEffect(() => {
        // Usar jQuery para filtrar los resultados cuando cambie la búsqueda
        const handleFilter = () => {
            $(".buttonClickleft").each(function () {
                const titulo = $(this).find("h3").text().toLowerCase();
                const dias = $(this)
                    .find("ul li")
                    .map((_, el) => $(el).text().toLowerCase())
                    .get();

                if (
                    titulo.includes(busqueda.toLowerCase()) || // Coincide con el título
                    dias.some(dia => dia.includes(busqueda.toLowerCase())) // Coincide con los días
                ) {
                    $(this).show(); // Mostrar si coincide
                } else {
                    $(this).hide(); // Ocultar si no coincide
                }
            });
        };

        handleFilter();
    }, [busqueda]);

    const toggleAccordion = (idComunicacion) => {
        setExpandedId(expandedId === idComunicacion ? null : idComunicacion); // Alterna entre expandir o contraer
    };

    return (
        <div className="tablaGrid">
            <div className="col-span-1 lg:col-span-2 2xl:col-span-3 3xl:col-span-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4  grid gap-2">
                <input
                    type="text"
                    placeholder="Buscar por título o día"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="border border-zinc-300 dark:border-ModoOscuro p-2 rounded-lg col-span-1 lg:col-span-1 xl:col-span-3 outline-none dark:bg-ModoOscuro dark:text-white"
                />
                <button onClick={()=>{setIsOpen(true),setModalContent("Modal de agregar comunicaciones")}} className="buttonClick">
                    <IoMdAdd /> Agregar
                </button>
            </div>

            {data.map(programado => (
                <div
                    key={programado.idComunicacion} // Usar idComunicacion como clave
                    className="buttonClickleft relative items-start flex flex-col"
                >
                    <div className="absolute flex bottom-2 right-2 gap-2">
                        <div className="dark:text-white hover:text-ModoOscuro cursor-pointer">
                            <FiEdit />
                        </div>
                        <div className="dark:text-white hover:text-ModoOscuro cursor-pointer">
                            <FaTrashAlt />
                        </div>
                    </div>

                    <h3 className="text-lg font-bold">{programado.titulo}</h3>

                    <div className="flex justify-between w-full">
                        <button
                            onClick={() => {toggleAccordion(programado.idComunicacion)}} // Usar idComunicacion para controlar el acordeón
                            className="flex items-center cursor-pointer mt-2"
                            aria-expanded={expandedId === programado.idComunicacion}
                            aria-controls={`content-${programado.idComunicacion}`}
                        >
                            Ver Contenido <FaEye className="ml-1" />
                        </button>

                        {expandedId === programado.idComunicacion && (
                            <button
                                onClick={() => navigator.clipboard.writeText(programado.mensaje)}
                                className="dark:text-zinc-200 hover:text-ModoOscuro cursor-pointer flex gap-2 items-center mt-2"
                            >
                                <FaCopy />
                                Copiar
                            </button>
                        )}
                    </div>

                    <div
                        id={`content-${programado.idComunicacion}`}
                        className={`custom-scrollbar overflow-x-hidden transition-all duration-300 ease-in-out ${expandedId === programado.idComunicacion ? 'max-h-32' : 'max-h-0'
                            }`}
                    >
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-zinc-600 dark:text-zinc-400 max-w-96 pr-4">
                                {programado.mensaje}
                            </p>
                        </div>
                    </div>
                    {expandedId === programado.idComunicacion && (
                        <div className="flex justify-between w-full">
                            <div className=' flex gap-4 font-medium text-zinc-100'>
                                <span><b className='text-white'>Modo: </b> {programado.modo}</span>
                                <span><b className='text-white'>Tipo: </b> {programado.tipo == "" ? "Sin tipo" : programado.tipo}</span>
                            </div>
                            {programado.archivo && (
                                <a
                                    href={programado.archivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dark:text-zinc-200 hover:text-ModoOscuro flex items-center gap-2"
                                >
                                    {programado.tipo === "Imagen" && (
                                        <>
                                            <IoImages /> Imagen
                                        </>
                                    )}
                                    {programado.tipo === "PDF" && (
                                        <>
                                            <IoDocumentText /> PDF
                                        </>
                                    )}
                                    {programado.tipo === "Video" && (
                                        <>
                                            <IoVideocam /> Video
                                        </>
                                    )}
                                    {programado.tipo === "Audio" && (
                                        <>
                                            <IoMusicalNote /> Audio
                                        </>
                                    )}
                                    {programado.tipo === "Ninguno" && (
                                        <>
                                            <IoCloseCircleOutline /> Ninguno
                                        </>
                                    )}
                                </a>
                            )}

                        </div>
                    )}
                    {programado.info?.diasHoras?.length > 0 ? (
                        <ul className="flex gap-2 mt-2">
                            {programado.info.diasHoras.map(dias => (
                                <li key={dias.id} className="text-sm font-extralight text-zinc-400">
                                    {dias.dian.substring(0, 3)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay días programados</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Registro;
