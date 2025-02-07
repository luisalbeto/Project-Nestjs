// src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">Acceso Denegado</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          No tienes permisos para acceder a esta página.
        </p>
        <div className="mt-6">
          <Link to="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400">
            Regresar al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
