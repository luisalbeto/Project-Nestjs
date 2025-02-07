import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Ajusta la URL según tu backend
  withCredentials: true, // Para enviar cookies automáticamente
});

export default api;
