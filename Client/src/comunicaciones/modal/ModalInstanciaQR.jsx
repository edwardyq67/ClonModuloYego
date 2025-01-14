
import { UseModal } from '../../store/Modal';
import ModalCampCallCrear from './comunicaciones masivas/ModalCampCallCrear';
import ModalCampWSP from './comunicaciones masivas/ModalCampWSP';
import ModalCrearInstancias from './comunicaciones masivas/ModalCrearInstancias';
import ModalInstancia from './comunicaciones masivas/ModalInstancia';
import { MdClose } from "react-icons/md";
function ModalInstanciaQR() {
  // Accede al estado qrBase64 del store
const modalContent=UseModal((state)=>state.modalContent)
const setIsOpen=UseModal((state)=>state.setIsOpen)
const setModalContent=UseModal((state=>state.setModalContent))
  return (
    <div className='top-0 z-50 fixed w-screen h-screen flex justify-center items-center'>
      
      <div className='relative bg-black text-white z-50 gap-5 flex flex-col p-5 pt-10 rounded-xl'>
        <MdClose onClick={()=>{
          setModalContent('');
          setIsOpen(false)
        }} className='text-white absolute top-3 right-3 cursor-pointer' size={20}/>
      {modalContent=="Comunicaciones masiva Instancia modal QR"&&<ModalInstancia/>}
      {modalContent=="Comunicaciones masiva Camp WSP modal crear campaña"&&<ModalCampWSP/>}
      {modalContent=="Comunicaciones masiva Instancias modal crear Instancia"&&<ModalCrearInstancias/>}
      {modalContent=="Comunicaciones masiva Camp Call modal crear campaña"&&<ModalCampCallCrear/>}
      </div>  
       <div className='bg-black w-screen h-screen opacity-40 absolute'></div>
   
    </div>
  );
}

export default ModalInstanciaQR;