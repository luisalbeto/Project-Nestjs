import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
// Definir el esquema de validación con Zod
const schema = z.object({
  email: z.string().email('Por favor ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { login } = useAuth(); // Obtén la función de login del contexto
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password); // Llama a la función de login
      navigate('/dashboard'); // Redirige al Dashboard después del inicio de sesión exitoso
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un problema con el inicio de sesión. Intenta nuevamente.');
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-400"
        >
          {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};
export default Login;