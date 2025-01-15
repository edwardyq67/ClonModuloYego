import axios from "axios";

// Base URL para la API
const API_URL = "http://10.10.2.59:5000/api";

export const fetchInstances = async () => {
  try {
    const response = await axios.get(`${API_URL}/instances`);
    return response.data;
  } catch (error) {
    console.error("Error al recuperar instancias:", error);
    throw error;
  } 
}

  // Función para generar el QR de una instancia
export const generateQrCode = async (instanceName) => {
    try {
      const response = await axios.get(`${API_URL}/generate-qr/${instanceName}`);
      return response.data; // Se espera que esto devuelva el base64
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error.response?.data || error;
    }
  };

  export const createInstance = async (instanceName) => {
    try {
      const response = await axios.post(`${API_URL}/create-instance`, {
        instanceName,
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear la instancia:", error);
      throw error;
    }
  };

  export const logoutInstance = async (instanceName) => {
    try {
      const response = await axios.delete(
        `${API_URL}/delete-instance/${instanceName}`
      );
      return response.data;
    } catch (error) {
      console.error("Error logging out instance:", error);
      throw error.response?.data || error;
    }
  }; 

// Función para obtener el resumen de WhatsApp usando la API local
export const getWhatsAppSummary = async () => {
  try {
    // Añadir el parámetro empresa con valor 'Monterrico'
    const response = await axios.get(`${API_URL}/send-whatsapp/resumen`, {
      params: {
        empresa: "Yego",
      },
    });

    // const response = await axios.get('http://10.10.10.10:5000/api/sendwhatsapp/resumen');
    return response.data;
  } catch (error) {
    console.error("Error al obtener el resumen de WhatsApp:", error);
    throw error.response?.data || error;
  }
};

export const getCallSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/send-call/resumenCall`);
    // const response = await axios.get('http://5.161.42.50:3000/campaigns');
    return response.data;
  } catch (error) {
    console.error("Error fetching WhatsApp summary:", error);
    throw error.response?.data || error;
  }
};

// Función para registrar una campaña de WhatsApp usando la API local
export const registerCampaign = async (formData) => {
  try {
      const { campania, titulo, mensaje, tipo, cantidad, telefonosNombres, media, fecha_pendiente } = formData;
      let imgUrl = ""; // URL de la imagen (inicialmente vacía)

      // Si el tipo es "imagen", "video" o "pdf" y media no está vacío, subir el archivo
      if ((tipo === "imagen" || tipo === "video" || tipo === "pdf") && media) {
          const formImg = new FormData();
          formImg.append("bucket", "masivo");
          formImg.append("file", media);

          // Subir el archivo al servidor
          const imgResponse = await axios.post(
              "https://cloud.3w.pe/media2",
              formImg,
              {
                  headers: {
                      "Content-Type": "multipart/form-data", // Asegúrate de configurar el encabezado
                  },
              }
          );
          // Obtener la URL del archivo subido
          imgUrl = imgResponse.data.url;
      }

      // Crear el cuerpo de la solicitud
      const requestBody = {
          Campania: campania,
          Titulo: titulo,
          Mensaje: mensaje,
          Tipo: tipo,
          Cantidad: cantidad,
          Empresa: "Yego",
          TelefonosNombres: telefonosNombres,
          Media: imgUrl, // Usar la URL del archivo subido
          fecha_pendiente: fecha_pendiente,
      };

      // Enviar la solicitud para registrar la campaña
      const response = await axios.post(
          `${API_URL}/send-whatsapp/registro`,
          requestBody,
          {
              headers: {
                  "Content-Type": "application/json",
              },
          }
      );

      return response.data;
  } catch (error) {
      console.error(
          "Error registering campaign:",
          error.response?.data || error.message
      );
      throw error.response?.data || error;
  }
};

export const postWspState = async (idcampania, estado) => {
  try {
    const response = await axios.post(`${API_URL}/send-whatsapp/estado`, {
      idcampania: idcampania,
      estado: estado,
    });
    return response.data;
  } catch (error) {
    console.error("Error change whatasapp status:", error);
    throw error.response?.data || error;
  }
};


export const registerCamapaingCall = async (campaign, numbers, audio_url) => {
  try {
    let audioURL = "";

    // Crear un FormData y agregar el archivo de audio
    const formData = new FormData();
    formData.append("bucket", "dify");
    formData.append("file", audio_url);

    // Subir el archivo de audio al servidor
    const uploadResponse = await axios.post(
      "https://cloud.3w.pe/media2",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Configurar el encabezado correcto
        },
      }
    );

    // Obtener la URL del archivo subido
    audioURL = uploadResponse.data.url;

    // Mostrar en consola los datos que se enviarán al servidor
    console.log("Datos a enviar:", {
      campaign: campaign.Campania, // Asegúrate de que campaign sea un objeto con la propiedad Campania
      numbers: numbers,
      audio_url: audioURL,
    });

    // Enviar los datos de la campaña, números y URL del audio al servidor
    const callResponse = await axios.post("http://5.161.42.50:3000/start-call", {
      campaign: campaign.Campania, // Asegúrate de que campaign sea un objeto con la propiedad Campania
      numbers: numbers,
      audio_url: audioURL,
    });

    // Retornar la respuesta del servidor
    return callResponse.data;

  } catch (error) {
    console.error("Error al registrar la campaña:", error);
    throw error.response?.data || error; // Lanzar el error para que pueda ser manejado externamente
  }
};

export const deleteCampaignApi = async (itemId) => {
  try {
    const responseDeleteCam = await axios.delete(
      `http://5.161.42.50:3000/campaigns/deleteCampaign`,
      {
        data: { idCampaign: itemId }, // Pasamos 'idCampaign' en el cuerpo de la solicitud
      }
    );

    return responseDeleteCam.data;
  } catch (error) {
    console.log("Error en eliminar campaña: ", error);
    return {
      success: 3,
      message: "Error alFirstfechaPendienteCached conectar con la API. Intenta de nuevo.",
    };
  }
};

export const FirstfechaPendienteCached = async () => {
  try {
    const response = await axios.get(
      `http://188.245.38.255:5000/api/sendwhatsapp/FirstfechaPendienteCached`
    );
    return response.data[0];
  } catch (error) {
    console.error("Error al recuperar instancias:", error);
    throw error;
  }
};

export const MessageActive = async () => {
  try {
    const response = await axios.get(
      `http://188.245.38.255:5000/api/sendwhatsapp/MessageActive`
    );
    return response.data;
  } catch (error) {
    console.error("Error al recuperar instancias:", error);
    throw error;
  }
};

export const VerificaionSendwhatsapp=async(value)=>{
  try {
    const response = await axios.get(
      `http://188.245.38.255:5000/api/sendwhatsapp/MessagePause/${value}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al recuperar instancias:", error);
    throw error;
  }
}

export const SalirSeccion = async (id, token) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/logout`, // Endpoint de cierre de sesión
      {
        data: { idloginClient: id }, // Datos a enviar en el cuerpo de la solicitud
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en el header
          "Content-Type": "application/json", // Especificar el tipo de contenido
        },
      }
    );
    return response.data; // Retornar la respuesta del servidor
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error; // Relanzar el error para manejarlo en el lugar donde se llama a SalirSeccion
  }
};