import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
  // Usar useQuery con la nueva forma de pasar un solo objeto
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'], // Clave única para esta consulta
    queryFn: async () => {
      try {
        // Hacer la solicitud sin necesidad de obtener el token manualmente
        const response = await axios.get('http://localhost:3000/auth/me', {
          withCredentials: true, // Permite que las cookies se envíen automáticamente
        });
        return response.data; // Retorna los datos del usuario
      } catch (error) {
        throw new Error('Error al obtener los datos del usuario');
      }
    },
    onError: (error) => {
      if (error.message === 'Token no encontrado') {
        navigate('/'); // Redirige a la página de login si no hay token
      }
    },
  });
  // Manejo de estados de carga y error
  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>; // Mostrar el mensaje de error real
  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      {user && <p>Usuario: {user.email}</p>}
    </div>
  );
};
export default Dashboard;




















