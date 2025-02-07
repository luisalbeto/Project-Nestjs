import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Función para configurar el interceptor con una función de logout externa
export const setupAxiosInterceptors = (onLogout: () => void) => {
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
          onLogout(); // Llamar a la función de logout proporcionada
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosClient;
