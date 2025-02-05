import axios from "axios";
import { useAuth } from "../context/AuthContext";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Interceptor para manejar errores de autenticación
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosClient.post("/auth/refresh-token", {}, { withCredentials: true });
        return axiosClient(originalRequest); // Reintentar la solicitud original
      } catch (refreshError) {
        console.error("No se pudo refrescar el token:", refreshError);
        const { logout } = useAuth();
        logout(); // Si falla el refresh, cerrar sesión
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
