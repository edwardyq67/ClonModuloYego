import { useState } from 'react'
import ModuloRegarga from '../Imagenes/modulo/ModuloRegarga.webp'
import ModuloComunicaciones from '../Imagenes/modulo/ModuloComunicaciones.webp'
import ModuloPrestamos from '../Imagenes/modulo/ModuloPrestamos.webp'
import ModuloRegistroConductores from '../Imagenes/modulo/ModuloRegistroConductores.webp'
import ModuloComunicacionesMasivas from '../Imagenes/modulo/ModuloComunicacionesMasivas.webp'
import ModuloEvaluacionPresencial from '../Imagenes/modulo/ModuloEvaluacionPresencial.webp'
import EvaluacionDigital from '../Imagenes/modulo/EvaluacionDigital.webp'
import ModuloANPT from '../Imagenes/modulo/ModuloANPT.webp'
import yegoLogo from '../Imagenes/Todos/yegoLogo.webp'
import { MdDashboard } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import Comunicaciones from '../comunicaciones/Comunicaciones'
import { UseSibar } from '../store/Sibar'
import { UseSlider } from '../store/Modal'
function Modulo() {
    const [NModulo, setNModulo] = useState("Yego")
    const [id, setId] = useState(0)
    const SetSiberNav=UseSibar((state)=>state.setSiberNav)
      //Slider activacion
      const setIsOpenSlider = UseSlider((state) => state.setIsOpenSlider);
    
    const ModulosImagenes = [
        {
            id: 1,
            titulo: "RECARGAS",
            imagen: ModuloRegarga,
        },
        {
            id: 2,
            titulo: "COMUNICACIONES",
            imagen: ModuloComunicaciones,
            nav:[
                {
                    title:"Instancias",
                    icon:<MdDashboard size={20}/>,
                    value:1
                },
                {
                    title:"Camp WSP",
                    icon:<IoLogoWhatsapp size={20}/>,
                    value:2
                },
                {
                    title:"Camp call",
                    icon:<BsTelephone size={20}/>,
                    value:3
                }
            ]
        },
        {
            id: 3,
            titulo: "PRESTAMOS",
            imagen: ModuloPrestamos
        },
        {
            id: 4,
            titulo: "REGISTROS CONDUCTORES",
            imagen: ModuloRegistroConductores
        },
        {
            id: 5,
            titulo: "COMUNICACIONES MASIVAS",
            imagen: ModuloComunicacionesMasivas
        },
        {
            id: 6,
            titulo: "EVALUACIÓN PRESENCIAL",
            imagen: ModuloEvaluacionPresencial
        },
        {
            id: 7,
            titulo: "EVALUACIÓN DIGITAL",
            imagen: EvaluacionDigital
        },
        {
            id: 8,
            titulo: "ANPT",
            imagen: ModuloANPT
        },
    ]
    return (
            <main className='pl-10 pt-10 pb-10 grid gap-6'>
            <div className='flex justify-between'>
                <img className='max-w-[80%] w-[200px] ' src={yegoLogo} alt="logoyegoLogo" />
                {
                    id != 0 && <button onClick={() => {
                        setId(0);
                        setNModulo("Yego");
                        SetSiberNav([])
                    }}>cambio</button>
                }

            </div>
            <div className='border-b-2  border-black w-full font-bold text-2xl p-2'>Módulos de <span className={`${id == 0 ? "text-black" : "text-primario"}`}>{NModulo}</span></div>
            {id == 0 ? <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-5'>
                {
                    ModulosImagenes.map(modulo => (
                        <div key={modulo.id} onClick={() => {
                            setId(modulo.id);
                            setNModulo(modulo.titulo);
                            SetSiberNav(modulo.nav);
                            setIsOpenSlider(true)
                        }} className='bg-white shadow-lg gap-5 transition-all duration-200 hover:scale-[1.02] cursor-pointer rounded-xl flex p-5 justify-around items-center'>
                            <img width={160}
                                loading="lazy"
                                height={160} className='max-w-40 h-auto' src={modulo.imagen} alt="" />
                            <h2 className='font-semibold text-base lg:text-lg'>{modulo.titulo}</h2>
                        </div>
                    ))
                }
            </div> : id==2?<Comunicaciones/>:""}

        </main>
      
    )
}

export default Modulo
