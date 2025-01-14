import React, { useEffect, useState } from "react";
import { IoQrCodeSharp } from "react-icons/io5";
import { FaCircle, FaFileImage } from "react-icons/fa";
import { fetchInstances, generateQrCode, logoutInstance } from "../api/api";
import { IoMdAdd } from "react-icons/io";
import { useInstanciaQR } from "../store/Comunicaciones";
import { FaRegTrashCan } from "react-icons/fa6";
import { UseActualizar, UseModal, UseSlider } from "../store/Modal";

function Instancias() {
  const setQrBase64 = useInstanciaQR((state) => state.setQrBase64);
  const setIsOpen = UseModal((state) => state.setIsOpen);
  const setModalContent = UseModal((state) => state.setModalContent);
  const setIsOpenSlider = UseSlider((state) => state.setIsOpenSlider);
const isActualizar=UseActualizar((state)=>state.isActualizar)
const setIsActualizar=UseActualizar((state)=>state.setIsActualizar)
  // Estado para el término de búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Estado para el filtro de conexión
  const [filtroConexion, setFiltroConexion] = useState("Todos");

  // Estado para las instancias filtradas
  const [instanciasFiltradas, setInstanciasFiltradas] = useState([]);
const [dataInstancia,setdataInstancia]=useState([])
  useEffect(() => {
    const filtrarInstancias = () => {
      try {
        const filtradas = dataInstancia.filter((instancia) => {
          // Verificar si instancia.name existe antes de usarlo
          const coincideNombre = instancia.name
            ? instancia.name.toLowerCase().includes(busqueda.toLowerCase())
            : false;
  
          // Verificar si instancia.ownerJid existe antes de usarlo
          const coincideTelefono = instancia.ownerJid
            ? instancia.ownerJid.split("@")[0].toLowerCase().includes(busqueda.toLowerCase())
            : false;
  
          const coincideBusqueda = coincideNombre || coincideTelefono;
  
          if (filtroConexion === "Todos") {
            return coincideBusqueda;
          } else if (filtroConexion === "Conectado") {
            return coincideBusqueda && instancia.connectionStatus === "open";
          } else if (filtroConexion === "Desconectado") {
            return coincideBusqueda && instancia.connectionStatus !== "open";
          }
  
          return false;
        });
  
        // Ordenar las instancias filtradas por nombre de manera inversa (Z-A)
        const filtradasOrdenadas = filtradas.sort((a, b) => {
          if (a.name > b.name) return -1; // Invertimos el orden
          if (a.name < b.name) return 1;  // Invertimos el orden
          return 0;
        });
  
        setInstanciasFiltradas(filtradasOrdenadas); // Actualiza las instancias filtradas y ordenadas
      } catch (error) {
        console.error("Error filtrando instancias:", error);
      } finally {
        setIsOpenSlider(false); // Cierra el slider de carga
      }
    };
  
    filtrarInstancias();
  }, [busqueda, filtroConexion, dataInstancia]); // Eliminamos setIsOpenSlider de las dependencias

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsOpenSlider(true); // Activar el slider
        const data = await fetchInstances(); // Obtener datos
        setdataInstancia(data); // Actualizar el estado con los datos
      } catch (error) {
        console.error('Error al obtener las instancias:', error);
      } finally {
          setIsOpenSlider(false);
      }
    };
  
    fetchData(); // Llamar a la función para obtener los datos
  }, []);
  
  useEffect(() => {
    const fetchActualizar = async () => {
      try {
        setIsOpenSlider(true);
        const data = await fetchInstances(); 
        setdataInstancia(data); 
      } catch (error) {
        console.error('Error al actualizar las instancias:', error);
      } finally {
        setIsActualizar(false); 
        setIsOpenSlider(false);
      }
    };
  
    if (isActualizar) {
      fetchActualizar(); // Llamar a la función si `isActualizar` es `true`
    }
  }, [isActualizar]);
  const envioQR = async (name) => {
    try {
      const qrData = await generateQrCode(name);
      if (qrData.status === 200 && qrData.base64) {
        setQrBase64(qrData.base64);
      } else {
        throw new Error("No se pudo generar el QR.");
      }
    } catch (error) {
      console.error("Error generando el QR:", error);
    }
  };

  const handleDelete = async (name) => {
    try {
      await logoutInstance(name);

    } catch (error) {
      console.error("Error eliminando la instancia:", error);
    }
  };

  return (
    <div className="tablaGrid">
      <div className="col-span-1 lg:col-span-2 2xl:col-span-3 3xl:col-span-4 items-center justify-between grid grid-cols-1 md:grid-cols-6 gap-2">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)} // Actualiza el término de búsqueda
          className="border border-gray-300 p-2 rounded-lg w-full col-span-4 outline-none"
        />
        <button
          onClick={() => {
            setIsOpen(true);
            setModalContent("Comunicaciones masiva Instancias modal crear Instancia");
          }}
          className="border-gray-300 border p-2 rounded-lg col-span-1 text-black font-bold flex items-center justify-center gap-2"
        >
          <IoMdAdd className="text-black" /> Instancia
        </button>
        <form className="max-w-sm mx-auto col-span-1 w-full outline-none">
          <select
            id="filtro-conexion"
            value={filtroConexion}
            onChange={(e) => setFiltroConexion(e.target.value)} // Actualiza el filtro de conexión
            className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white overflow-hidden"
          >
            <option value="Todos">Todos</option>
            <option value="Conectado">Conectado</option>
            <option value="Desconectado">Desconectado</option>
          </select>
        </form>
      </div>

      {/* Mostrar instancias filtradas */}
      {instanciasFiltradas.map((instancia) => (
        <div
          key={instancia.id}
          className="bg-gray-50 shadow-lg text-black rounded-lg p-4 font-semibold gap-3 flex flex-col"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{instancia.name}</h2>
            {instancia.connectionStatus !== "open" && (
              <IoQrCodeSharp
                className="cursor-pointer"
                onClick={() => {
                  setIsOpen(true); // Activa el modal
                  setModalContent("Comunicaciones masiva Instancia modal QR"); // Valor del modal, estado global
                  envioQR(instancia.name); // Usar la API para obtener el QR
                }}
              />
            )}
          </div>
          <div className="flex gap-2 items-center">
            {instancia.profilePicUrl ? (
              <img
                width={60}
                className="rounded-full"
                src={instancia.profilePicUrl}
                alt="Profile"
                onError={(e) => {
                  e.target.style.display = "none"; // Oculta la imagen si no se puede cargar
                }}
              />
            ) : (
              <FaFileImage className="text-gray-400 w-12 h-12" />
            )}
            <div>
              <h3>Yego</h3>
              {instancia.ownerJid ? instancia.ownerJid.split("@")[0] : "Sin Numero"}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <button
                className={`flex justify-start items-center gap-2 flex-1 bg-gray-200 p-2 rounded-lg`}
              >
                <h4
                  className={`${
                    instancia.connectionStatus === "open"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {instancia.connectionStatus === "open"
                    ? "Disponible"
                    : "No Disponible"}
                </h4>
                <FaCircle
                  className={`${
                    instancia.connectionStatus === "open"
                      ? "text-green-500"
                      : "text-red-500"
                  } w-2 h-2`}
                />
              </button>
            </div>
            <FaRegTrashCan
              onClick={() => {handleDelete(instancia.name),setIsActualizar(true)}}
              className="cursor-pointer"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Instancias;