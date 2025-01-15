import React, { useEffect, useState, useCallback } from 'react';
import { deleteCampaignApi, getCallSummary } from '../api/api';
import { FaRegTrashCan, FaEye } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FaHourglassStart } from "react-icons/fa6";
import { LuAudioLines } from "react-icons/lu";
import { FaFontAwesomeFlag } from "react-icons/fa";
import clsx from 'clsx';
import { UseActualizar, UseModal, UseSlider } from '../store/Modal';

// Componente reutilizable para los badges de estado
const StatusBadge = React.memo(({ icon: Icon, color, value, label }) => (
    <span
        className={clsx(
            "flex justify-between items-center font-bold p-2 rounded-lg text-white",
            {
                "bg-yellow-500": color === "yellow",
                "bg-green-500": color === "green",
                "bg-red-500": color === "red",
                "bg-gray-900": color === "gray",
            }
        )}
    >
        {Icon && <Icon />} {label && <h3>{label}</h3>} {value}
    </span>
));

function CampCall() {
    const setModalContent = UseModal((state) => state.setModalContent);
    const setIsOpen = UseModal((state) => state.setIsOpen);
    const [summaryData, setSummaryData] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const setIsOpenSlider = UseSlider((state) => state.setIsOpenSlider);
    const isActualizar = UseActualizar((state) => state.isActualizar);
    const setIsActualizar = UseActualizar((state) => state.setIsActualizar);

    // Función para obtener los datos de resumen
    const fetchData = useCallback(async () => {
        try {
            const data = await getCallSummary();
            const invertedData = data.reverse();
            setSummaryData(invertedData);
        } catch (error) {
            console.error("Error fetching summary data:", error);
        }
    }, []);

    // Cargar datos iniciales y configurar actualización automática
    useEffect(() => {
        const loadData = async () => {
            setIsOpenSlider(true); // Activar el slider solo durante la carga inicial
            await fetchData();
            setIsOpenSlider(false);
        };

        loadData(); // Cargar datos iniciales

        const intervalId = setInterval(fetchData, 5000); // Actualizar cada 5 segundos

        return () => clearInterval(intervalId); // Limpiar intervalo al desmontar
    }, [fetchData, setIsOpenSlider]);

    // Actualizar datos cuando isActualizar cambia
    useEffect(() => {
        if (isActualizar) {
            fetchData();
            setIsActualizar(false); // Restablecer el estado de actualización
        }
    }, [isActualizar, fetchData, setIsActualizar]);

    // Función para eliminar una campaña
    const handleDeleteCampaign = useCallback(async (id) => {
        try {
            setIsActualizar(true);
            setIsOpenSlider(true)
            await deleteCampaignApi(id);
            await fetchData();
        } catch (error) {
            console.error("Error deleting campaign:", error);
        } finally {
            setIsOpenSlider(false)
        }
    }, [setIsActualizar]);

    // Función para expandir/colapsar el acordeón
    const toggleAccordion = useCallback((id) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    }, []);

    return (
        <div className="tablaGrid">
            {/* Encabezado con botones y leyenda */}
            <div className="col-span-1 lg:col-span-2 2xl:col-span-3 3xl:col-span-4 items-center justify-between grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex font-semibold gap-5 dark:text-gray-200">
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        Enviado
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        Finalizado
                    </span>
                </div>
                <div className="flex gap-2 justify-end items-center">
                    <button
                        onClick={() => { setIsOpen(true); setModalContent("Comunicaciones masiva Camp Call modal crear campaña") }}
                        className="buttonClick"
                    >
                        CREAR CAMPAÑA
                    </button>
                    <a href="/plantillaCall.xlsx" download="plantillaCall.xlsx">
                        <button className="buttonClick">DESCARGAR PLANTILLA</button>
                    </a>
                </div>
            </div>

            {/* Lista de campañas */}
            {summaryData.length > 0 ? (
                summaryData.map((wsp) => (
                    <div
                        key={wsp.id}
                        className="text-gray-900 dark:text-gray-200 border-2 rounded-lg p-4 font-semibold gap-3 justify-between flex flex-col"
                        style={{
                            background: wsp.sin_enviar > 0
                                ? "radial-gradient(circle, rgba(15, 23, 42, 1) 0%, rgba(59, 130, 246, 0.2) 100%)"
                                : "radial-gradient(circle, rgba(15, 23, 42, 1) 0%, rgba(16, 185, 129, 0.2) 100%)",
                            border: wsp.sin_enviar > 0
                                ? "2px solid rgba(59, 130, 246, 0.5)"
                                : "2px solid rgba(16, 185, 129, 0.5)",
                        }}
                    >
                        {/* Encabezado de la tarjeta */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <span>{new Date(wsp.fecha_creacion).toLocaleDateString()}</span>
                                <span>{new Date(wsp.fecha_creacion).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaRegTrashCan
                                    onClick={() => { handleDeleteCampaign(wsp.id) }}
                                    className="hover:cursor-pointer hover:text-white"
                                />
                            </div>
                        </div>

                        {/* Nombre de la campaña */}
                        <h2 className="font-bold uppercase text-xl ">
                            {wsp.nombre_campana}
                        </h2>

                        {/* Botón para expandir/colapsar el mensaje */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => toggleAccordion(wsp.id)}
                                className="flex items-center cursor-pointer "
                                aria-expanded={expandedId === wsp.id}
                                aria-controls={`content-${wsp.id}`}
                            >
                                Ver Contenido <FaEye className="ml-1" />
                            </button>
                            {/* Mostrar fecha de envío si es válida */}
                            {wsp.fecha_envio_inicio && (
                                <span className=" flex gap-2 items-center">
                                    <FaFontAwesomeFlag />
                                    {new Date(wsp.fecha_envio_inicio).toLocaleString('es-ES')}
                                </span>
                            )}
                        </div>

                        {/* Contenido expandible */}
                        <div
                            id={`content-${wsp.id}`}
                            className={clsx(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                {
                                    "max-h-96": expandedId === wsp.id,
                                    "max-h-0": expandedId !== wsp.id,
                                }
                            )}
                        >
                            <p className="mt-2  flex gap-2 items-center">
                                <strong><LuAudioLines /></strong>{" "}
                                <a
                                    href={wsp.audio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Escuchar audio
                                </a>
                            </p>
                            <p className="mt-2  flex gap-2 items-center">
                                <strong><FaHourglassStart /></strong> {wsp.promedio_duracion} segundos
                            </p>
                        </div>
  <div className="grid grid-cols-2 gap-2">
                            <div className="dark:bg-yellow-600 bg-yellow-500 text-yellow-500 rounded-lg">
                                <StatusBadge
                                    icon={MdAccessTimeFilled}
                                    value={wsp.sin_enviar}
                                />
                            </div>
                            <div className="dark:bg-green-700 bg-green-600 text-green-500 rounded-lg">
                                <StatusBadge
                                    icon={IoCheckmarkCircle}
                                    value={wsp.enviados}
                                />
                            </div>
                            <div className="dark:bg-red-700 bg-red-600 text-red-500 rounded-lg">
                                <StatusBadge
                                    icon={FaTimesCircle}
                                    value={wsp.fallidos}
                                />
                            </div>
                            <div className="dark:bg-gray-700 bg-gray-600 text-gray-400 rounded-lg">
                                <StatusBadge
                                    value={wsp.total}
                                    label="Total"
                                />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No se encontraron datos de campañas en el último mes.</p>
            )}
        </div>
    );
}

export default React.memo(CampCall);