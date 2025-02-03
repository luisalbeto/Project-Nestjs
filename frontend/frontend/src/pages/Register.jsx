import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from '../utils/axiosClient'; // Asegúrate de que este archivo esté configurado correctamente
import { useNavigate } from 'react-router-dom';
// Definir el esquema de validación con Zod
const schema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  email: z.string().email({ message: 'Por favor ingresa un correo electrónico válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  role: z.enum(['USER', 'ADMIN', 'SUPERVISOR'], { message: 'Selecciona un rol válido' }),
});
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      // Realizar la solicitud al backend
      await axiosClient.post('http://localhost:3000/auth/register', data); // Cambia esto según tu endpoint
      navigate('/'); // Redirigir al login después del registro exitoso
    } catch (error) {
      console.error('Error al registrarse:', error);
      alert('Hubo un problema con el registro. Intenta nuevamente.');
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Registro</h2>
        {/* Campo Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        {/* Campo Email */}
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
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        {/* Campo Contraseña */}
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
        {/* Campo Rol */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="role">
            Rol
          </label>
          <select
            id="role"
            {...register('role')}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona un rol</option>
            <option value="USER">Usuario</option>
            <option value="SUPERVISOR">SUPERVISOR</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
        </div>
        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-400"
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};
export default Register;