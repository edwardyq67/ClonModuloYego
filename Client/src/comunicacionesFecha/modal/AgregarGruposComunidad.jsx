import React, { useState } from 'react';
import { UseModal } from '../../store/Modal';

function AgregarGruposComunidad() {
    const [busqueda, setBusqueda] = useState(''); // Estado para la búsqueda
    const setModalContent=UseModal((state=>state.setModalContent))
    const [opciones] = useState([
        'Ninguno',
        'Grupo de WhatsApp 1',
        'Grupo de WhatsApp 2',
        'Comunidad de Yandex',
        'Grupo de Facebook',
        'Comunidad de Discord',
        'Grupo de Telegram',
    ]); // Opciones iniciales
    const [mostrarOpciones, setMostrarOpciones] = useState(false); // Controla si se muestran las opciones
    const [selecciones, setSelecciones] = useState([]); // Arreglo de opciones seleccionadas

    // Filtrar opciones basadas en la búsqueda
    const opcionesFiltradas = opciones.filter(opcion =>
        opcion.toLowerCase().includes(busqueda.toLowerCase()) &&
        !selecciones.includes(opcion) // Excluir opciones ya seleccionadas
    );

    const manejarSeleccion = (opcion) => {
        setSelecciones([...selecciones, opcion]); // Agregar al arreglo de seleccionados
        setBusqueda(''); // Limpiar el campo de búsqueda
        setMostrarOpciones(false); // Ocultar opciones
    };

    const eliminarSeleccion = (opcion) => {
        setSelecciones(selecciones.filter(item => item !== opcion)); // Eliminar opción seleccionada
    };

    return (
        <div className="w-96 grid gap-4">
            <h2 className="text-2xl font-black text-white">Grupos y comunidad</h2>
            <div className="relative">
                <input
                    id="titulo"
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)} // Actualiza el estado de búsqueda
                    onFocus={() => setMostrarOpciones(true)} // Mostrar opciones al enfocar
                    placeholder="Buscar Grupos y comunidad"
                    className="block p-2.5 w-full text-sm outline-none text-gray-900 rounded-lg dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                />
                {mostrarOpciones && (
                    <div className="absolute top-12 left-0 w-full bg-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto z-10">
                        {opcionesFiltradas.length > 0 ? (
                            <ul className="space-y-2">
                                {opcionesFiltradas.map((opcion, index) => (
                                    <li
                                        key={index}
                                        className="text-white p-2 hover:bg-gray-600 rounded-lg cursor-pointer"
                                        onClick={() => manejarSeleccion(opcion)} // Manejar la selección
                                    >
                                        {opcion}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No se encontraron resultados</p>
                        )}
                    </div>
                )}
            </div>
            {selecciones.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-white">Seleccionados:</h3>
                    <ul className="space-y-2">
                        {selecciones.map((opcion, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center text-sm text-green-500 mt-4"
                            >
                                <span>{opcion}</span>
                                <button
                                    onClick={() => eliminarSeleccion(opcion)} // Eliminar la opción
                                    className="text-red-500 hover:text-red-700"
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
                 <div className='flex justify-between items-center'>
                
                <button
                    type="button"
                
                    className='p-2 rounded-lg w-24 text-white font-bold bg-red-500 hover:bg-red-600 transition-colors'
                >
                    Cancelar
                </button>
                <button onClick={()=>setModalContent("Modal de agregar Comunicacion Fleet Yego")} className='p-2 rounded-lg w-24 text-white font-bold bg-blue-500 hover:bg-blue-600 transition-colors'>
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default AgregarGruposComunidad;
