import './App.css';
import { lazy, Suspense } from 'react'; // Importa lazy y Suspense
import { HashRouter, Route, Routes } from 'react-router-dom';
import { UsePixelarSiber } from './store/Sibar';
import { UseModal, UseModalLogin, UseSlider } from './store/Modal';
import Modal from './comunicaciones/modal/Modal';
import Slider from './components/Slider';
import ProtectedRoutes from './ProtectedRoutes'; // Importa el componente ProtectedRoutes
import ModalLogin from './Login/ModalLogin';

// Carga dinámica de componentes
const Login = lazy(() => import('./Login/Login'));
const Modulo = lazy(() => import('./pages/Modulo'));
const Sibar = lazy(() => import('./pages/Sibar'));

function App() {
  const pixelesSiber = UsePixelarSiber((state) => state.pixelesSiber);
  const isOpen = UseModal((state) => state.isOpen); // Modal de activación
  const isOpenSlider = UseSlider((state) => state.isOpenSlider); // Modal Slider
  const isModalLogin=UseModalLogin((state)=>state.isModalLogin)
  const anchoSibar = pixelesSiber ? '200px' : '10px';

  // Estilos en línea para el contenedor principal
  const styles = {
    container: {
      position: 'absolute',
      top: '0px',
      right: '0px',
      margin: 'auto ',
      padding: '0px 40px',
      width: `calc(100% - ${anchoSibar})`, // Ancho dinámico basado en el estado
      transition: 'margin-left 0.3s ease, width 0.3s ease',
      height: '100vh',
    },
  };
  return (
    <HashRouter>
      <Suspense fallback={<div>Cargando...</div>}>
        <div>
          {isModalLogin&&<ModalLogin />}
          <Routes>
            {/* Ruta pública (Login) */}
            <Route path="/" element={<Login />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoutes />}>
              <Route
                path="/modulo"
                element={
                  <div className='flex bg-[#0F172A]'>
                    <Sibar />
                    {isOpen && <Modal />}
                    {isOpenSlider && <Slider />}
                    <div className='bg-[#0F172A]' style={styles.container}>
                      <Modulo />
                    </div>
                  </div>
                }
              />
            </Route>
          </Routes>
        </div>

      </Suspense>
    </HashRouter>
  );
}

export default App;