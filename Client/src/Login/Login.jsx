
import estrella from '../Imagenes/Todos/estrella.webp'
import yegoLogo from '../Imagenes/Todos/yegoLogo.webp'
import { useNavigate } from 'react-router-dom';
function Login() {
    const navigate = useNavigate()
    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 h-screen'>

            <div className='hidden lg:flex flex-col items-center justify-center bg-gray-100 p-4'>
                <p className='text-primario font-bold text-center max-w-[700px] mb-8 text-xl'>
                    LOS GRANDES LOGROS DE CUALQUIER PERSONA GENERALMENTE DEPENDEN DE MUCHAS MANOS, CORAZONES Y MENTES
                </p>
                <img
                    className='max-w-[80%] w-[500px]'
                    src={estrella}
                    alt="Imagen decorativa"
                    width={500}
                    height={500}
                    loading="lazy"
                />
            </div>

            <div className='bg-primario flex items-center justify-center p-4'>
                <div className='bg-white flex-col flex justify-evenly rounded-lg h-[70vh] lg:h-[60vh] max-w-[450px] w-full lg:w-[80%] shadow-xl p-4'>
                    <picture className='w-full flex justify-center items-center'>
                        <img width={160}
                            loading="lazy"
                            height={160} className='max-w-[80%] w-[200px]' src={yegoLogo} alt="logoyegoLogo" />
                    </picture>
                    <form action="" className='flex flex-col gap-5 mx-auto text-center w-[90%]'>
                        <div className='relative'>
                            <label htmlFor="usuario" className='sr-only'>Usuario</label>
                            <input
                                id="usuario"
                                type='text'
                                placeholder='Usuario'
                                className='input-personalizado'
                                aria-label="Campo de usuario"
                            />
                        </div>
                        <div className='relative'>
                            <label htmlFor="contraseña" className='sr-only'>Contraseña</label>
                            <input
                                id="contraseña"
                                type='password'
                                placeholder='Contraseña'
                                className='input-personalizado'
                                aria-label="Campo de contraseña"
                            />
                        </div>
                        <div className='mx-auto'>
                            <span className='flex items-center text-sm gap-4'>
                                Has olvidado tu contraseña
                                <button
                                    type="button"
                                    className='bg-[#10186d] py-1 px-2 text-white rounded-xl'
                                    aria-label="Notificar a IT sobre contraseña olvidada"
                                >
                                    Notificar a IT
                                </button>
                            </span>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => navigate('/modulo')}
                                className='bg-[#fff946] py-2 px-4 rounded-xl text-black font-bold shadow-md hover:bg-[#f4ef48] transition-all duration-200'
                                aria-label="Ingresar al sistema"
                            >
                                INGRESAR
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;