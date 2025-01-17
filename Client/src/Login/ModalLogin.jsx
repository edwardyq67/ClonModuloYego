import React, { useState } from 'react';
import { MdClose } from "react-icons/md";
import { useLogin409, UseModalLogin } from '../store/Modal';
import { fozarDetencion, IniciarSecion } from '../api/api';
import { useNavigate } from 'react-router-dom';

function ModalLogin() {
    const setIsModalLogin = UseModalLogin((state) => state.setIsModalLogin);
    const useUsername = useLogin409((state) => state.useUsername);
    const usePassword = useLogin409((state) => state.usePassword);
    const navigate = useNavigate();

    const [estado, setEstado] = useState(1);
    const [password, setPassword] = useState('');

    const onsubmit = async () => {
        try {
            // Llama a las APIs con los valores correspondientes
            await fozarDetencion(useUsername, password);
            const response = await IniciarSecion(useUsername, usePassword);

            // Guarda los datos en el localStorage
            if (response?.data?.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('Permisos', JSON.stringify(response.data.permissionsByRole || []));
                localStorage.setItem('PermisosEspeciales', JSON.stringify(response.data.permisosEspeciales || []));
            }
            setIsModalLogin(false)
            // Redirige al usuario al módulo
            navigate('/modulo');

        } catch (error) {
            console.error("Error durante el inicio de sesión o la detención:", error);
        }
    };

    return (
        <div className="top-0 z-20 absolute w-screen h-screen flex justify-center items-center">
            <div className="relative text-center bg-slate-800 text-white z-20 gap-5 flex flex-col p-5 pt-10 rounded-xl">
                <div
                    onClick={() => setIsModalLogin(false)}
                    className="absolute top-5 right-5 cursor-pointer"
                >
                    <MdClose size={22} />
                </div>
                <h2 className="font-bold text-2xl uppercase">Forzar detención</h2>
                <p>Al forzar detención cerrarás las cuentas de otros dispositivos</p>
                <div className="flex justify-around gap-2">
                    <button
                        className={`w-full p-2.5 rounded-lg ${estado === 1 ? "hover:bg-slate-600 bg-slate-700" : "bg-slate-700"
                            }`}
                        onClick={() => setEstado(2)}
                    >
                        Sí
                    </button>
                    <button
                        onClick={() => setIsModalLogin(false)}
                        className={`w-full p-2.5 rounded-lg ${estado === 1 ? "bg-slate-700 hover:bg-slate-600" : ""
                            }`}
                    >
                        No
                    </button>
                </div>
                {estado === 2 && (
                    <div className="flex flex-col gap-2">
                        <h2 className="font-semibold">Contraseña maestra</h2>
                        <input
                            type="password"
                            className="bg-slate-700 p-2.5 rounded-lg w-full mb-2 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {password.trim() !== "" && (
                            <button
                                onClick={onsubmit}
                                className="hover:bg-slate-600 bg-slate-700 w-full rounded-lg p-2.5"
                            >
                                Continuar
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="bg-black w-screen h-screen opacity-40 absolute"></div>
        </div>
    );
}

export default ModalLogin;
