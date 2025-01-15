import { IoIosArrowForward } from "react-icons/io";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { AccordionItem } from "../components/AccordionItem";
import { UsePixelarSiber, UseSibar } from "../store/Sibar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseTema } from "../store/EstadoTotal";
import { SalirSeccion } from "../api/api";

function Sidebar() {
  const setValorModulo = UseSibar((state) => state.setValorModulo);
  const valorModulo=UseSibar((state)=>state.valorModulo)
  const pixelesSiber = UsePixelarSiber((state) => state.pixelesSiber);
  const setPixelSiber = UsePixelarSiber((state) => state.setPixelSiber);
  const siberNav = UseSibar((state) => state.siberNav);
  const { isDarkMode, setIsDarkMode } = UseTema(); // Obtener el estado y la función para actualizarlo
  const [ignoreHover, setIgnoreHover] = useState(false);

  const navigate = useNavigate();

  // Efecto para aplicar la clase `dark` en el elemento <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#0F172A"; // Fondo oscuro
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "white"; // Fondo claro
    }
  }, [isDarkMode]);

  // Función para alternar entre modo oscuro y claro
  const handleToggle = () => {
    setIsDarkMode(!isDarkMode); // Cambiar el estado
  };

  // Función para cerrar sesión
  const salir = async () => { // Hacer la función "salir" asíncrona
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
  
    if (token) {
      try {
        // Dividir el JWT en sus partes (header, payload, signature)
        const [, payload] = token.split(".");
  
        // Decodificar el payload (Base64Url)
        const decodedPayload = decodeBase64Url(payload);
  
        // Convertir el payload decodificado (cadena JSON) a un objeto
        const payloadObject = JSON.parse(decodedPayload);
  
        // Mostrar el contenido del token en consola
        console.log("Token Decodificado:", payloadObject);
  
        // Obtener el idUsuario del payload
        const idUsuario = payloadObject.idUsuario;
  
        // Llamar a la función SalirSeccion con idUsuario y token
        await SalirSeccion(idUsuario, token); // Usar await si SalirSeccion es asíncrona
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    } else {
      console.log("No se encontró ningún token en localStorage.");
    }
  };
  
  // Función para decodificar Base64Url
  const decodeBase64Url = (str) => {
    // Reemplazar caracteres de Base64Url
    str = str.replace(/-/g, "+").replace(/_/g, "/");
  
    // Añadir relleno si es necesario
    switch (str.length % 4) {
      case 0:
        break;
      case 2:
        str += "==";
        break;
      case 3:
        str += "=";
        break;
      default:
        throw new Error("Cadena Base64Url inválida");
    }
  
    // Decodificar usando atob
    return decodeURIComponent(escape(atob(str)));
  };
  

  return (
    <>
      <div
        id="drawer-navigation"
        onMouseEnter={() => !ignoreHover && setPixelSiber(true)}
        onMouseLeave={() => !ignoreHover && setPixelSiber(false)}
        className={`fixed top-0 left-0 z-20 w-64 h-screen p-3 flex flex-col justify-between overflow-y-auto transition-transform shadow-xl bg-white dark:bg-gray-800 ${
          pixelesSiber ? "translate-x-0" : "-translate-x-48"
        }`}
        tabIndex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <div>
          <div
            id="drawer-navigation-label"
            className={`${
              pixelesSiber ? "justify-start" : "justify-end"
            } flex gap-2 pt-3 text-base font-semibold text-gray-500 dark:text-gray-400`}
          >
            <div className={`${pixelesSiber ? "absolute" : "hidden"} top-3 right-3 cursor-pointer`}>
              <IoIosArrowForward
                size={20}
                onClick={() => {
                  setIgnoreHover(!ignoreHover);
                  setPixelSiber(true);
                }}
              />
            </div>

            <img
              className="w-10 h-10 rounded"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="Default avatar"
              loading="lazy"
              width={40}
              height={40}
            />
            <div className={`${pixelesSiber ? "flex" : "hidden"} flex-col`}>
              <h2 className="mb-0">Edward Yllanes</h2>
              <span className="text-sm -mt-1">Platino</span>
            </div>
          </div>

          <div className="py-4 overflow-y-auto">
            <ul className={`${pixelesSiber?'items-start':'items-end flex flex-col'} space-y-2 font-medium  `}>
              {siberNav.map((item) => (
                <li key={item.title}>
                  {item.options ? (
                    pixelesSiber ? (
                      <AccordionItem title={item.title} icon={item.icon}>
                        <ul className="pl-4 grid gap-2 ">
                          {item.options.map((sub, idx) => (
                            <li
                              key={idx}
                              className="cursor-pointer text-ModoOscuro dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-ModoOscuro rounded-lg py-2 px-3"
                            >
                              {sub.value}
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>
                    ) : (
                      <div className="justify-end flex w-full items-center p-2 text-gray-500 hover:text-gray-900 dark:group-hover:text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-ModoOscuro group">
                        {item.icon}
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => setValorModulo(item.value)}
                      className={`flex ${
                        pixelesSiber ? "justify-start w-full" : "justify-end"
                      } ${valorModulo==item.value&&"dark:bg-gray-700"} 
                      items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-ModoOscuro group`}
                    >
                      <div className={`${valorModulo==item.value&&"dark:text-white"} w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white`}>
                        {item.icon}
                      </div>
                      {pixelesSiber && <span className="ml-3">{item.title}</span>}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="space-y-2 font-medium">
        {/*   <li>
            <label
              className={`${
                pixelesSiber ? "justify-start p-2" : "justify-end"
              } inline-flex items-center cursor-pointer w-full rounded-lg`}
            >
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={isDarkMode}
                onChange={handleToggle}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-ModoOscuro peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-500"></div>
              {pixelesSiber && (
                <span className="ms-3 text-base font-medium text-gray-900 dark:text-white">
                  {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
                </span>
              )}
            </label>
          </li> */}
          <li onClick={salir}>
            <button
              className={`flex ${
                pixelesSiber ? "justify-start" : "justify-end"
              } w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-ModoOscuro group`}
            >
              <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <FaArrowRightFromBracket  size={22} />
              </div>
              {pixelesSiber && <span className="ml-3">Cerrar sesión</span>}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;