import  { useEffect } from 'react';
import { fetchInstances } from '../api/api';
import Instancias from './Instancias';
import { useComunicacionesStore, useInstanciaQR } from '../store/Comunicaciones';
import { UseSibar } from '../store/Sibar';
import { UseSlider } from '../store/Modal';
import CampWSP from './CampWSP';
import CampCall from './CampCall';

function Comunicaciones() {

  const valorModulo=UseSibar((state) => state.valorModulo)

  return (
    <>
      {valorModulo == 1 ? (
        <div>
          <Instancias />
        </div>
      ) : valorModulo == 2 ? (
        <div>
          <CampWSP/>
        </div>
      ) : (
        <div><CampCall/></div>
      )}
    </>
  );
}

export default Comunicaciones;