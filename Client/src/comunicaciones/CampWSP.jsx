import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FirstfechaPendienteCached, getWhatsAppSummary, MessageActive, postWspState } from '../api/api';
import { FaPause, FaRegTrashCan, FaEye, FaPlay } from "react-icons/fa6";
import { FaTimesCircle, FaFontAwesomeFlag } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
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

function CampWSP() {
    const [summaryData, setSummaryData] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const setIsOpenSlider = UseSlider((state) => state.setIsOpenSlider);
    const setModalContent = UseModal((state) => state.setModalContent);
    const isActualizar = UseActualizar((state) => state.isActualizar);
    const setIsActualizar = UseActualizar((state) => state.setIsActualizar);
    const setIsOpen = UseModal((state) => state.setIsOpen);
    const [stopInterval, setStopInterval] = useState(false);
    const [valorUltimoMensaje,setValorUltimoMensaje]=useState([])
    // Función para obtener los datos de resumen

    useEffect(() => {
        const timeout = setTimeout(async () => {
            const rest = await VerificaionSendwhatsapp(3)
            console.log(rest)
            console.log(valorUltimoMensaje)
            /*    for (let i = 1; i < valorAnterior.length; i++) {
                 const item = valorAnterior[i];
               await VerificaionSendwhatsapp(3)
           await postWspState(item.idSendmessage, 3);
     
               } */
            setStopInterval(false);
        }, 1 * 60 * 1000); // 1 minutos

        // Limpieza del timeout si el componente se desmonta
        return () => clearTimeout(timeout);
    }, [stopInterval]);

    const fetchSummaryData = useCallback(async () => {
        try {
            setIsOpenSlider(true);
            const data = await getWhatsAppSummary();
            setSummaryData(data);
        } catch (error) {
            console.error("Error fetching summary data:", error);
        } finally {
            setIsOpenSlider(false);
        }
    }, [setIsOpenSlider]);

    const fetchSummaryDatadento = useCallback(async () => {
        try {
            const data = await getWhatsAppSummary();
            setSummaryData(data);
        } catch (error) {
            console.error("Error fetching summary data:", error);
        } 
    }, [setIsOpenSlider]);

    // Cargar datos iniciales y configurar WebSocket
    useEffect(() => {
        fetchSummaryData();

        const ws = new WebSocket("ws://10.10.2.59:8080");

        ws.onopen = () => {
            console.log("Conectado al servidor WebSocket");
        };

        ws.onmessage = () => {
            fetchSummaryDatadento();
        };

        ws.onclose = () => {
            console.log("Desconectado del servidor WebSocket");
        };

        ws.onerror = (error) => {
            console.error("Error WebSocket:", error);
        };

        return () => {
            ws.close();
        };
    }, [fetchSummaryData]);

    // Actualizar datos cuando isActualizar cambia
    useEffect(() => {
        if (isActualizar) {
            fetchSummaryData();
            setIsActualizar(false);
        }
    }, [isActualizar, fetchSummaryData, setIsActualizar]);

    // Filtrar y ordenar los datos
    const filteredData = useMemo(() => {
        const currentDate = new Date();
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(currentDate.getMonth() - 1);

        return summaryData
            .filter((item) => {
                const itemDate = new Date(item.fechaHora);
                return itemDate >= lastMonthDate && itemDate <= currentDate;
            })
            .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
    }, [summaryData]);
   /*  rgba(255,255,255,1)*/
    const estilosPorEstado = useMemo(() => ({
        5: {
            boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)", // Verde esmeralda
            backgroundImage: "radial-gradient(circle, rgba(15, 23, 42, 1) 0%, rgba(16, 185, 129, 0.2) 100%)", // Fondo oscuro con toque de verde
            border: "2px solid rgba(16, 185, 129, 0.5)", // Verde esmeralda
        },
        4: {
            background: "radial-gradient(circle, rgba(15, 23, 42, 1) 0%, rgba(59, 130, 246, 0.2) 100%)", // Fondo oscuro con toque de azul
            border: "2px solid rgba(59, 130, 246, 0.5)", // Azul brillante
        },
        3: {
            background: "radial-gradient(circle, rgba(15, 23, 42, 1) 0%, rgba(250, 204, 21, 0.2) 100%)", // Fondo oscuro con toque de amarillo
            border: "2px solid rgba(250, 204, 21, 0.5)", // Amarillo mostaza
        },
        0: {
            background: "radial-gradient(circle, rgba(15, 23, 42, 1) 0%, rgba(249, 115, 22, 0.2) 100%)", // Fondo oscuro con toque de naranja
            border: "2px solid rgba(249, 115, 22, 0.5)", // Naranja brillante
        }
    }), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await FirstfechaPendienteCached();
                const fechaPendiente = response?.fecha_pendiente;

                const fecha = new Date(fechaPendiente);
                const ahora = new Date();

                if (ahora > fecha) {
                    console.log("¡Ya es hora!");
                    const messages = await MessageActive();

                    if (Array.isArray(messages)) {
                        for (const { idSendmessage } of messages) {
                            await postWspState(idSendmessage, 0);
                            setValorUltimoMensaje(messages[0])
                        }
                    }
                    if (response?.idestado == 0) {
                        await postWspState(response?.idSendmessage, 3);
                    }

                    setStopInterval(true); // Detener el intervalo
                } else {
                    console.log("Aún no es hora.");
                }
            } catch (error) {
                console.error("Error en el intervalo:", error);
            }
        };

        const intervalo = setInterval(async () => {
            if (!stopInterval) {
                await fetchData();
            }
        }, 5000);
        return () => clearInterval(intervalo); // Limpiar el intervalo al desmontar el componente
    }, [stopInterval]);

    // Función para cambiar el estado de la campaña
    const cambioEstado = useCallback(async (idcampania, estado) => {
        try {
            setIsOpenSlider(true);
            await postWspState(idcampania, estado);
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
        } finally {
            setIsOpenSlider(false);
        }
    }, [setIsOpenSlider]);

    // Función para renderizar el botón según el estado
    const renderizarBoton = useCallback((idestado, idcampania) => {
        if (idestado === 0 || idestado === 4) {
            return (
                <FaPause
                    onClick={() => cambioEstado(idcampania, 0)}
                    className="hover:text-ModoOscuro cursor-pointer"
                />
            );
        } else if (idestado === 3) {
            return (
                <FaPlay
                    onClick={() => cambioEstado(idcampania, 3)}
                    className="hover:text-ModoOscuro cursor-pointer"
                />
            );
        }
        return null;
    }, [cambioEstado]);

    // Función para expandir/colapsar el acordeón
    const toggleAccordion = useCallback((id) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    }, []);

    return (
        <div className="tablaGrid">
            <div className="col-span-1 lg:col-span-2 2xl:col-span-3 3xl:col-span-4 items-center justify-between grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex font-semibold gap-5 dark:text-gray-200">
                    <span className='flex items-center gap-2'><div className='w-4 h-4 rounded-full bg-yellow-500'></div>Pausa</span>
                    <span className='flex items-center gap-2'><div className='w-4 h-4 rounded-full bg-orange-500'></div>Pendiente</span>
                    <span className='flex items-center gap-2'><div className='w-4 h-4 rounded-full bg-blue-500'></div>Enviado</span>
                    <span className='flex items-center gap-2'><div className='w-4 h-4 rounded-full bg-green-500'></div>Finalizado</span>
                </div>
                <div className='flex gap-2 justify-end items-center'>
                    <button onClick={() => { setIsOpen(true); setModalContent("Comunicaciones masiva Camp WSP modal crear campaña") }} className="buttonClick">CREAR CAMPAÑA</button>
                    <a href="/plantilla.xlsx" download="plantilla.xlsx">
                        <button className="buttonClick">DESCARGAR PLANTILLA</button>
                    </a>
                </div>
            </div>
            {filteredData.length > 0 ? (
                filteredData.map((wsp) => (
                    <div
                        key={wsp.idcampania}
                        className="shadow-lg text-gray-900 dark:text-gray-200 rounded-lg p-4 font-semibold gap-3 justify-between flex flex-col"
                        style={estilosPorEstado[wsp.idestado] || {}}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <span>{new Date(wsp.fechaHora).toLocaleDateString()}</span>
                                <span>{new Date(wsp.fechaHora).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {renderizarBoton(wsp.idestado, wsp.idcampania)}
                                <FaRegTrashCan
                                    onClick={() => { cambioEstado(wsp.idcampania, 6); setIsActualizar(true); }}
                                    className="dark:text-white hover:text-ModoOscuro cursor-pointer"
                                />
                            </div>
                        </div>

                        <h2 className="font-bold uppercase text-xl ">{wsp.campania}</h2>

                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => toggleAccordion(wsp.idcampania)}
                                className="flex items-center cursor-pointer hover:text-ModoOscuro"
                                aria-expanded={expandedId === wsp.idcampania}
                                aria-controls={`content-${wsp.idcampania}`}
                            >
                                Ver Contenido <FaEye className="ml-1" />
                            </button>
                            {wsp.fechapendiente !== "1900-01-01T00:00:00" && (
                                <span className=" flex gap-2 items-center">
                                    <FaFontAwesomeFlag /> {new Date(wsp.fechapendiente).toLocaleString('es-ES')}
                                </span>
                            )}
                        </div>

                        <div
                            id={`content-${wsp.idcampania}`}
                            className={clsx(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                {
                                    "max-h-96": expandedId === wsp.idcampania,
                                    "max-h-0": expandedId !== wsp.idcampania,
                                }
                            )}
                        >
                            <p className="mt-2">{wsp.mensaje}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="dark:bg-yellow-600 bg-yellow-500 text-yellow-500 rounded-lg">
                                <StatusBadge
                                    icon={MdAccessTimeFilled}
                                    value={wsp.pendiente}
                                />
                            </div>
                            <div className="dark:bg-green-700 bg-green-600 text-green-500 rounded-lg">
                                <StatusBadge
                                    icon={IoCheckmarkCircle}
                                    value={wsp.enviado}
                                />
                            </div>
                            <div className="dark:bg-red-700 bg-red-600 text-red-500 rounded-lg">
                                <StatusBadge
                                    icon={FaTimesCircle}
                                    value={wsp.error}
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
                <p>No se encontraron datos de campañas en el último mes.</p>
            )}
        </div>
    );
}

export default React.memo(CampWSP);