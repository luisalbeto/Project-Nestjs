import axios from 'axios';
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Usa variable de entorno
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // :fuego: Permite que el navegador envíe cookies HTTP-Only automáticamente
});
// Interceptor de respuesta para manejar errores de autenticación y refrescar tokens
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Si obtenemos un error 401 y no hemos intentado ya refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Intentar obtener un nuevo access token usando el refresh token
        const refreshResponse = await axiosClient.get('/auth/refresh'); // Asegúrate de que esta ruta sea válida en tu backend
        // Si la respuesta es exitosa, reintenta la solicitud original
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('No se pudo refrescar el token:', refreshError);
        window.location.href = '/login'; // Redirigir al login si falla el refresh
      }
    }
    // Si el error no fue un 401 o hubo otro tipo de error, rechazamos la promesa
    return Promise.reject(error);
  }
);
export default axiosClient;









