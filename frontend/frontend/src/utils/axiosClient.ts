// src/utils/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Usa la variable de entorno
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las solicitudes si está presente
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
