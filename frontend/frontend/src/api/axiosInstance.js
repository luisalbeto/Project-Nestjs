import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Permite enviar cookies
});

// Interceptor para manejar errores 401 y refrescar el accessToken automáticamente
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, la retorna sin cambios
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Intentar refrescar el accessToken
        await axios.post("http://localhost:3000/auth/refresh-token", {}, { withCredentials: true });

        // Reintentar la solicitud original después de renovar el accessToken
        return api(error.config);
      } catch (refreshError) {
        console.error("No se pudo refrescar el token. Redirigiendo al login...");
        window.location.href = "/"; // Redirigir al login si falla el refresh
      }
    }
    return Promise.reject(error);
  }
);

export default api;
