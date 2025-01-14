import React, { useEffect, useState, useMemo } from 'react';
import { getWhatsAppSummary, postWspState } from '../api/api';
import { FaPause, FaRegTrashCan, FaEye } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa"; // Importación corregida
import { MdAccessTimeFilled } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FaFontAwesomeFlag } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import clsx from 'clsx'; // Para manejar clases condicionales
import { UseActualizar, UseModal, UseSlider } from '../store/Modal';

// Componente reutilizable para los badges de estado
const StatusBadge = ({ icon: Icon, color, value, label }) => (
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
);

function CampWSP() {
  const [summaryData, setSummaryData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const setIsOpenSlider = UseSlider((state) => state.setIsOpenSlider)
  const setModalContent = UseModal((state) => state.setModalContent);
  const isActualizar=UseActualizar((state)=>state.isActualizar)
  const setIsActualizar=UseActualizar((state)=>state.setIsActualizar)
  const setIsOpen = UseModal((state) => state.setIsOpen);
  const fetchSummaryData = async () => {
    try {
      const data = await getWhatsAppSummary();
      setSummaryData(data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setIsOpenSlider(false);
    }
  };

  useEffect(() => {

    fetchSummaryData();

    // Crear la conexión WebSocket
    const ws = new WebSocket("ws://10.10.2.59:8080");

    // Evento cuando se abre la conexión
    ws.onopen = () => {
      console.log("Conectado al servidor WebSocket");
    };

    // Evento cuando se recibe un mensaje del servidor
    ws.onmessage = (event) => {
      fetchSummaryData(); // Llamar a la función para actualizar los datos
    };

    // Evento cuando se cierra la conexión
    ws.onclose = () => {
      console.log("Desconectado del servidor WebSocket");
    };

    // Manejar errores
    ws.onerror = (error) => {
      console.error("Error WebSocket:", error);
    };

    // Limpiar WebSocket cuando el componente se desmonte
    return () => {
      ws.close();
    };
  }, [setIsOpenSlider]);

  useEffect(() => {
    const fetchActualizar = async () => {
      try {
        setIsOpenSlider(true);
        fetchSummaryData();
      } catch (error) {
        console.error('Error al actualizar las instancias:', error);
      } finally {
        setIsActualizar(false); 
      }
    };
  
    if (isActualizar) {
      fetchActualizar(); // Llamar a la función si `isActualizar` es `true`
    }
  }, [isActualizar]);

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

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const estilosPorEstado = {
    5: {
      boxShadow: "0 0 15px rgba(5, 150, 105, 0.3)",
      backgroundImage:
        "radial-gradient(circle, rgba(249,250,251,1) 0%, rgba(220,252,232,1) 100%)",
      border: "2px solid rgba(5, 150, 105, 0.5)", // Borde verde suave
    },
    4: {
      background:
        "radial-gradient(circle, rgba(249,250,251,1) 0%, rgba(219,232,254,1) 100%)",
      border: "2px solid rgba(59, 130, 246, 0.5)", // Borde azul suave
    },
    3: {
      background: "radial-gradient(circle, rgba(249,250,251,1) 0%, rgba(254,240,195,1) 100%)",
      border: "2px solid rgba(251, 191, 36, 0.5)", // Borde amarillo suave   
    },
    0: {
      background: "radial-gradient(circle, rgba(249,250,251,1) 0%, rgba(255,230,213,1) 100%)",
      border: "2px solid rgba(245, 158, 11, 0.5)", // Borde naranja suave
    }
    // Puedes agregar más estados aquí si es necesario
  };
  const cambioEstado = async (idcampania, estado) => {
    setIsOpenSlider(true);
    await postWspState(idcampania, estado)
  }
  const renderizarBoton = (idestado, idcampania, cambioEstado) => {
    if (idestado === 0 || idestado === 4) {
      return (
        <FaPause
          onClick={() => cambioEstado(idcampania, 0)}
          className="hover:text-gray-700 cursor-pointer"
        />
      );
    } else if (idestado === 3) {
      return (
        <FaPlay
          onClick={() => cambioEstado(idcampania, 3)}
          className="hover:text-gray-700 cursor-pointer"
        />
      );
    }
    return null; // Si no coincide con ningún caso, no renderiza nada
  };
  return (
    <div className="tablaGrid">
      <div className="col-span-1 lg:col-span-2 2xl:col-span-3 3xl:col-span-4 items-center justify-between grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex font-semibold gap-5 ">
          <span className='flex items-center gap-2'><div className='w-4 h-4 rounded-full bg-yellow-500'></div>Pausa</span>
          <span className='flex items-center gap-2'><div className='w-4 h-4 rounded-full bg-orange-500'></div>Pendiente</span>
          <span className='flex items-center gap-2'><div className='w-4 h-4 rounded-full bg-blue-500'></div>Enviado</span>
          <span className='flex items-center gap-2'><div className='w-4 h-4 rounded-full bg-green-500'></div>Finalizado</span>
        </div>
        <div className='flex gap-2 justify-end items-center'>
          <button onClick={() => { setIsOpen(true); setModalContent("Comunicaciones masiva Camp WSP modal crear campaña") }} className="buttonClick">CREAR CAMPAÑA</button>
          <button className="buttonClick">DESCARGAR PLANTILLA</button>
        </div>
      </div>
      {filteredData.length > 0 ? (
        filteredData.map((wsp) => (
          <div
            key={wsp.idcampania}
            className="shadow-lg text-gray-900 rounded-lg p-4 font-semibold gap-3 justify-between flex flex-col"
            style={estilosPorEstado[wsp.idestado] || {}}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2 ">
                <span>{new Date(wsp.fechaHora).toLocaleDateString()}</span>
                <span>{new Date(wsp.fechaHora).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2">
                {
                  renderizarBoton(wsp.idestado, wsp.idcampania, cambioEstado)
                }
                <FaRegTrashCan
                onClick={()=>{cambioEstado(wsp.idcampania, 6);
                  setIsActualizar(true)
                }}
                  className=" hover:text-gray-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Nombre de la campaña */}
            <h2 className="font-bold uppercase text-xl text-gray-700">{wsp.campania}</h2>

            {/* Botón para expandir/colapsar el mensaje */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => toggleAccordion(wsp.idcampania)}
                className="flex items-center cursor-pointer  hover:text-gray-700"
                aria-expanded={expandedId === wsp.idcampania}
                aria-controls={`content-${wsp.idcampania}`}
              >
                Ver Contenido <FaEye className="ml-1" />
              </button>
              {/* Mostrar fecha pendiente si es válida */}
              {wsp.fechapendiente !== "1900-01-01T00:00:00" && (
                <span className="text-gray-600 flex gap-2 items-center">
                  <FaFontAwesomeFlag /> {new Date(wsp.fechapendiente).toLocaleString('es-ES')}
                </span>
              )}
            </div>

            {/* Contenido expandible */}
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
              <p className="mt-2 text-gray-700">{wsp.mensaje}</p>
            </div>

            {/* Badges de estado */}
            <div className="grid grid-cols-2 gap-2">
              <StatusBadge
                icon={MdAccessTimeFilled}
                color="yellow"
                value={wsp.pendiente}
              />
              <StatusBadge
                icon={IoCheckmarkCircle}
                color="green"
                value={wsp.enviado}
              />
              <StatusBadge
                icon={FaTimesCircle} // Ícono corregido
                color="red"
                value={wsp.error}
              />
              <StatusBadge
                color="gray"
                value={wsp.total}
                label="Total"
              />
            </div>
          </div>
        ))
      ) : (
        <p>No se encontraron datos de campañas en el último mes.</p>
      )}
    </div>
  );
}

export default CampWSP;