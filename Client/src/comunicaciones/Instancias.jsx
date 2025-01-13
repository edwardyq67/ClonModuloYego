import React, { useEffect, useState } from "react";
import { IoQrCodeSharp } from "react-icons/io5";
import { FaCircle, FaFileImage } from "react-icons/fa";
import { generateQrCode, logoutInstance } from "../api/api";
import { IoMdAdd } from "react-icons/io";
import { useInstanciaQR } from "../store/Comunicaciones";
import { FaRegTrashCan } from "react-icons/fa6";
import { UseModal, UseSlider } from "../store/Modal";

function Instancias() {
  const setQrBase64 = useInstanciaQR((state) => state.setQrBase64);
  const dataInstancia = useInstanciaQR((state) => state.dataInstancia);
  const setIsOpen = UseModal((state) => state.setIsOpen);
  const setModalContent = UseModal((state) => state.setModalContent);
  const setIsOpenSlider = UseSlider((state) => state.setIsOpenSlider);

  // Estado para el término de búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Estado para el filtro de conexión
  const [filtroConexion, setFiltroConexion] = useState("Todos");

  // Estado para las instancias filtradas
  const [instanciasFiltradas, setInstanciasFiltradas] = useState([]);

  // Efecto para filtrar las instancias
  useEffect(() => {
    const filtrarInstancias = () => {
      try {
        const filtradas = dataInstancia.filter((instancia) => {
          const coincideNombre = instancia.name
            .toLowerCase()
            .includes(busqueda.toLowerCase());

          const coincideTelefono = instancia.ownerJid
            .split("@")[0]
            .toLowerCase()
            .includes(busqueda.toLowerCase());

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

        setInstanciasFiltradas(filtradas); // Actualiza las instancias filtradas
      } catch (error) {
        console.error("Error filtrando instancias:", error);
      } finally {
        setIsOpenSlider(false); // Cierra el slider de carga
      }
    };

    filtrarInstancias();
  }, [busqueda, filtroConexion, dataInstancia, setIsOpenSlider]);

  const envioQR = async (name) => {
    try {
      const qrData = await generateQrCode(name);
      if (qrData.status === 200 && qrData.base64) {
        setQrBase64(qrData.base64);
      }
    } catch (error) {
      console.error("Error generando el QR:", error);
    }
  };

  const handleDelete = async (name) => {
    try {
      const logoutResponse = await logoutInstance(name);
      if (logoutResponse.status !== "SUCCESS") {
        throw new Error("Error al cerrar la sesión de la instancia.");
      }
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
        <button className="border-gray-300 border p-2 rounded-lg col-span-1 text-black font-bold flex items-center justify-center gap-2">
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
              />
            ) : (
              <FaFileImage className="text-gray-400 w-12 h-12" />
            )}
            <div>
              <h3>Yego</h3>
              {instancia.ownerJid.split("@")[0]}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <button
                className={`flex justify-start items-center gap-2 flex-1 bg-gray-200 p-2 rounded-lg`}
              >
                <h4
                  className={`${
                    instancia.connectionStatus == "open"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {instancia.connectionStatus == "open"
                    ? "Disponible"
                    : "No Disponible"}
                </h4>
                <FaCircle
                  className={`${
                    instancia.connectionStatus == "open"
                      ? "text-green-500"
                      : "text-red-500"
                  } w-2 h-2`}
                />
              </button>
            </div>
            <FaRegTrashCan
              onClick={() => handleDelete(instancia.name)}
              className="cursor-pointer"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Instancias;