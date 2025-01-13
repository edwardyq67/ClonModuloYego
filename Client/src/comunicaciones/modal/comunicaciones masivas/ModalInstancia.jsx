import React from 'react'
import { IoMdClose } from "react-icons/io";
import { UseModal } from '../../../store/Modal';
import { useInstanciaQR } from '../../../store/Comunicaciones';

function ModalInstancia() {
      const setIsOpen=UseModal((state)=> state.setIsOpen)
      const qrBase64 = useInstanciaQR((state) => state.qrBase64);
    return (
        <div>
            <IoMdClose onClick={() => setIsOpen(false)} className='absolute right-5 top-5 cursor-pointer' size={20} />
            <p className=' font-bold text-center text-lg'>Código QR de Conexión</p>
            {qrBase64 && <img src={qrBase64} alt="Código QR" />}
        </div>
    )
}

export default ModalInstancia
