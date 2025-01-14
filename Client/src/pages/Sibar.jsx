import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { BsFillDoorClosedFill } from "react-icons/bs";
import { AccordionItem } from "../components/AccordionItem";
import { UsePixelarSiber, UseSibar } from "../store/Sibar";
import { UseSlider } from "../store/Modal";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const setValorModulo = UseSibar((state) => state.setValorModulo);
  const pixelesSiber = UsePixelarSiber((state) => state.pixelesSiber);
  const setPixelSiber = UsePixelarSiber((state) => state.setPixelSiber);
  const setIsOpenSlider=UseSlider((state)=>state.setIsOpenSlider)
  const siberNav = UseSibar((state) => state.siberNav);


  const settings = [
    {
      title: "Clous",
      icon: <BsFillDoorClosedFill size={20} />,
    },
  ];
const navigate = useNavigate(); 
  const salir = () => {
    // Obtener la función de navegación
  
    // Eliminar datos del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('Permisos');
    localStorage.removeItem('PermisosEspeciales');

    navigate('/');
  };

  return (
    <>
      <div
        id="drawer-navigation"
        onMouseEnter={() =>setPixelSiber(true)}
        onMouseLeave={() =>setPixelSiber(false)}
        className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 flex flex-col justify-between overflow-y-auto transition-transform shadow-xl bg-white dark:bg-gray-800 ${
          pixelesSiber ? "translate-x-0" : "-translate-x-48"
        }`}
        tabIndex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <div>
          <div
            id="drawer-navigation-label"
            className={`${pixelesSiber ? "justify-start" : "justify-end"} flex gap-2 text-base font-semibold text-gray-500 dark:text-gray-400`}
          >
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
            <ul className="space-y-2 font-medium">
              {siberNav.map((item) => (
                <li key={item.title}>
                  {item.options ? (
                    pixelesSiber ? (
                      <AccordionItem title={item.title} icon={item.icon}>
                        <ul className="pl-4 grid gap-2">
                          {item.options.map((sub, idx) => (
                            <li
                              key={idx}
                              className="cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg py-2 px-3"
                            >
                              {sub.value}
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>
                    ) : (
                      <div className="justify-end flex w-full items-center p-2 text-gray-500 hover:text-gray-900 dark:group-hover:text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        {item.icon}
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        setValorModulo(item.value)
                        setIsOpenSlider(true)
                      }}
                      className={`flex ${
                        pixelesSiber ? "justify-start" : "justify-end"
                      } w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                    >
                      <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        {item.icon}
                      </div>
                      {pixelesSiber && (
                        <span className="ml-3">{item.title}</span>
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul onClick={()=>salir()} className="space-y-2 font-medium border-t-2 border-gray-200 pt-3">
          {settings.map((item) => (
            <li key={item.title}>
              <button
                className={`flex ${
                  pixelesSiber ? "justify-start" : "justify-end"
                } w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  {item.icon}
                </div>
                {pixelesSiber && <span className="ml-3">{item.title}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
