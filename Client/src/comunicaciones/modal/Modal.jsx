
import AgregarComunicaciones from '../../comunicacionesFecha/modal/AgregarComunicaciones';
import AgregarGruposComunidad from '../../comunicacionesFecha/modal/AgregarGruposComunidad';
import { UseModal } from '../../store/Modal';
import ModalCampCallCrear from './comunicaciones masivas/ModalCampCallCrear';
import ModalCampWSP from './comunicaciones masivas/ModalCampWSP';
import ModalCrearInstancias from './comunicaciones masivas/ModalCrearInstancias';
import ModalInstancia from './comunicaciones masivas/ModalInstancia';
import { MdClose } from "react-icons/md";
function Modal() {
  // Accede al estado qrBase64 del store
const modalContent=UseModal((state)=>state.modalContent)
const setIsOpen=UseModal((state)=>state.setIsOpen)
const setModalContent=UseModal((state=>state.setModalContent))
console.log(modalContent)
  return (
    <div className='top-0 z-20 fixed w-screen h-screen flex justify-center items-center'>
      <div className='relative bg-gray-800 text-white z-20 gap-5 flex flex-col p-5 pt-10 rounded-xl'>
        <MdClose onClick={()=>{
          setModalContent('');
          setIsOpen(false)
        }} className='text-white absolute top-3 right-3 cursor-pointer' size={20}/>
      {/* comunicacion masiva */}
      {modalContent=="Comunicaciones masiva Instancia modal QR"&&<ModalInstancia/>}
      {modalContent=="Comunicaciones masiva Camp WSP modal crear campaña"&&<ModalCampWSP/>}
      {modalContent=="Comunicaciones masiva Instancias modal crear Instancia"&&<ModalCrearInstancias/>}
      {modalContent=="Comunicaciones masiva Camp Call modal crear campaña"&&<ModalCampCallCrear/>}
      {/* Comunicacion */}
      {modalContent=="Modal de agregar comunicaciones"&&<AgregarComunicaciones/>}
      {modalContent=="Modal de agregar Comunicacion Grupos y comunidad agregar"&&<AgregarGruposComunidad/>}
      </div>  
       <div className='bg-black w-screen h-screen opacity-40 absolute'></div>
   
    </div>
  );
}

export default Modal;