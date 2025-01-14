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

// Componente reutilizable para los badges de estado (optimizado con React.memo)
const StatusBadge = React.memo(({ icon: Icon, color, value, label, className }) => (
    <span
        className={clsx(
            "flex justify-between items-center font-bold p-2 rounded-lg text-white border-2",
            {
                "bg-yellow-500 border-yellow-500": color === "yellow",
                "bg-green-500 border-green-500": color === "green",
                "bg-red-500 border-red-500": color === "red",
                "bg-gray-500 border-gray-500": color === "gray",
            },
            className
        )}
        style={{
            boxShadow: `0 0 10px ${color === "yellow" ? "rgba(234, 179, 8, 0.5)" :
                color === "green" ? "rgba(5, 150, 105, 0.5)" :
                    color === "red" ? "rgba(239, 68, 68, 0.5)" :
                        "rgba(107, 114, 128, 0.5)"}`,
        }}
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
            await deleteCampaignApi(id);
        } catch (error) {
            console.error("Error deleting campaign:", error);
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
                <div className="flex font-semibold gap-5">
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
                    <button className="buttonClick">DESCARGAR PLANTILLA</button>
                </div>
            </div>

            {/* Lista de campañas */}
            {summaryData.length > 0 ? (
                summaryData.map((wsp) => (
                    <div
                        key={wsp.id}
                        className="border-2 rounded-lg p-4 font-semibold gap-3 justify-between flex flex-col"
                        style={{
                            background: wsp.sin_enviar > 0
                                ? "radial-gradient(circle, rgba(249,250,251,1) 0%, rgba(219,232,254,1) 100%)"
                                : "radial-gradient(circle, rgba(249,250,251,1) 0%, rgba(220,252,232,1) 100%)",
                            border: wsp.sin_enviar > 0
                                ? "2px solid rgba(59, 130, 246, 0.5)"
                                : "2px solid rgba(5, 150, 105, 0.5)",
                            boxShadow: "0 0 15px rgba(5, 150, 105, 0.3)",
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
                                    onClick={() => handleDeleteCampaign(wsp.id)}
                                    className="hover:text-gray-700 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Nombre de la campaña */}
                        <h2 className="font-bold uppercase text-xl text-gray-700">
                            {wsp.nombre_campana}
                        </h2>

                        {/* Botón para expandir/colapsar el mensaje */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => toggleAccordion(wsp.id)}
                                className="flex items-center cursor-pointer hover:text-gray-700 text-gray-600"
                                aria-expanded={expandedId === wsp.id}
                                aria-controls={`content-${wsp.id}`}
                            >
                                Ver Contenido <FaEye className="ml-1" />
                            </button>
                            {/* Mostrar fecha de envío si es válida */}
                            {wsp.fecha_envio_inicio && (
                                <span className="text-gray-600 flex gap-2 items-center">
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
                            <p className="mt-2 text-gray-700 flex gap-2 items-center">
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
                            <p className="mt-2 text-gray-700 flex gap-2 items-center">
                                <strong><FaHourglassStart /></strong> {wsp.promedio_duracion} segundos
                            </p>
                        </div>

                        {/* Badges de estado */}
                        <div className="grid grid-cols-2 gap-2">
                            <StatusBadge
                                icon={MdAccessTimeFilled}
                                color="yellow"
                                value={wsp.sin_enviar}
                                className="border-yellow-500 shadow-yellow-500/50"
                            />
                            <StatusBadge
                                icon={IoCheckmarkCircle}
                                color="green"
                                value={wsp.enviados}
                                className="border-green-500 shadow-green-500/50"
                            />
                            <StatusBadge
                                icon={FaTimesCircle}
                                color="red"
                                value={wsp.fallidos}
                                className="border-red-500 shadow-red-500/50"
                            />
                            <StatusBadge
                                color="gray"
                                value={wsp.total}
                                label="Total"
                                className="border-gray-500 shadow-gray-500/50"
                            />
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