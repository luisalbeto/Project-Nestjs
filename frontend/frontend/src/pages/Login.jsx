import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`mt-1 block w-full border rounded-md p-2 dark:bg-gray-700 dark:text-gray-300 ${
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className={`mt-1 block w-full border rounded-md p-2 dark:bg-gray-700 dark:text-gray-300 ${
              errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-400 transition duration-300"
        >
          {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default Login;
