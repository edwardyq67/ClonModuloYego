import axios from "axios";
import { UseSlider } from "../store/Modal";

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

  export const logoutInstance = async (instanceName) => {
    try {
      const response = await axios.delete(
        `${API_URL}/logout-instance/${instanceName}`
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
