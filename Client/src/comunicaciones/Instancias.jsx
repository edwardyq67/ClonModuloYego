import React, { useEffect, useState, useCallback } from "react";
import { IoQrCodeSharp } from "react-icons/io5";
import { FaCircle, FaFileImage } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
import { fetchInstances, generateQrCode, logoutInstance } from "../api/api";
import { useInstanciaQR } from "../store/Comunicaciones";
import { UseActualizar, UseModal, UseSlider } from "../store/Modal";

function Instancias() {
    const setQrBase64 = useInstanciaQR((state) => state.setQrBase64);
    const setIsOpen = UseModal((state) => state.setIsOpen);
    const setModalContent = UseModal((state) => state.setModalContent);
    const setIsOpenSlider = UseSlider((state) => state.setIsOpenSlider);
    const isActualizar = UseActualizar((state) => state.isActualizar);
    const setIsActualizar = UseActualizar((state) => state.setIsActualizar);

    const [busqueda, setBusqueda] = useState("");
    const [filtroConexion, setFiltroConexion] = useState("Todos");
    const [instanciasFiltradas, setInstanciasFiltradas] = useState([]);
    const [dataInstancia, setDataInstancia] = useState([]);

    // Función para obtener las instancias
    const fetchData = useCallback(async () => {
        try {
            setIsOpenSlider(true);
            const data = await fetchInstances();
            setDataInstancia(data);
        } catch (error) {
            console.error('Error al obtener las instancias:', error);
        } finally {
            setIsOpenSlider(false);
        }
    }, [setIsOpenSlider]);

    // Cargar datos iniciales
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Actualizar datos cuando isActualizar cambia
    useEffect(() => {
        if (isActualizar) {
            fetchData();
            setIsActualizar(false);
        }
    }, [isActualizar, fetchData, setIsActualizar]);

    // Filtrar y ordenar las instancias
    useEffect(() => {
        const filtrarInstancias = () => {
            try {
                const filtradas = dataInstancia.filter((instancia) => {
                    const coincideNombre = instancia.name
                        ? instancia.name.toLowerCase().includes(busqueda.toLowerCase())
                        : false;

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

                const filtradasOrdenadas = filtradas.sort((a, b) => {
                    if (a.name > b.name) return -1;
                    if (a.name < b.name) return 1;
                    return 0;
                });

                setInstanciasFiltradas(filtradasOrdenadas);
            } catch (error) {
                console.error("Error filtrando instancias:", error);
            }
        };

        filtrarInstancias();
    }, [busqueda, filtroConexion, dataInstancia]);

    // Función para generar el QR
    const envioQR = useCallback(async (name) => {
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
    }, [setQrBase64]);

    // Función para eliminar una instancia
    const handleDelete = useCallback(async (name) => {
        try {
            await logoutInstance(name);
            setIsActualizar(true); // Actualizar la lista después de eliminar
        } catch (error) {
            console.error("Error eliminando la instancia:", error);
        }
    }, [setIsActualizar]);

    return (
        <div className="tablaGrid">
            <div className="col-span-1 lg:col-span-2 2xl:col-span-3 3xl:col-span-4 items-center justify-between grid grid-cols-1 md:grid-cols-6 gap-2">
                <input
                    type="text"
                    placeholder="Buscar"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="border border-gray-300 dark:border-ModoOscuro p-2 rounded-lg w-full col-span-4 outline-none dark:bg-ModoOscuro dark:text-white"
                />
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setModalContent("Comunicaciones masiva Instancias modal crear Instancia");
                    }}
                    className="border-gray-300 dark:border-ModoOscuro border p-2 rounded-lg col-span-1 dark:bg-ModoOscuro text-black dark:text-white font-semibold flex items-center justify-center gap-2"
                >
                    <IoMdAdd  /> Instancia
                </button>
                <form className="max-w-sm mx-auto col-span-1 w-full outline-none">
                    <select
                        id="filtro-conexion"
                        value={filtroConexion}
                        onChange={(e) => setFiltroConexion(e.target.value)}
                        className="bg-gray-50 border font-semibold border-gray-300 dark:border-ModoOscuro outline-none text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-ModoOscuro dark:border-gray-600 dark:placeholder-gray-400 dark:text-white overflow-hidden"
                    >
                        <option value="Todos">Todos</option>
                        <option value="Conectado">Conectado</option>
                        <option value="Desconectado">Desconectado</option>
                    </select>
                </form>
            </div>

            {instanciasFiltradas.map((instancia) => (
                <div
                    key={instancia.id}
                    className="bg-gray-50 dark:bg-ModoOscuro dark:text-white shadow-lg text-black rounded-lg p-4 font-semibold gap-3 flex flex-col"
                >
                    <div className="flex justify-between items-center">
                    </div>
                    <div className="flex gap-2 items-center">
                        {instancia.profilePicUrl ? (
                            <img
                                width={60}
                                className="rounded-full"
                                src={instancia.profilePicUrl}
                                alt="Profile"
                                onError={(e) => {
                                    e.target.style.display = "none";
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
                                className={`flex justify-start items-center gap-2 flex-1 dark:bg-ModoOscuro px-2 rounded-lg`}
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
                            onClick={() => handleDelete(instancia.name)}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default React.memo(Instancias);