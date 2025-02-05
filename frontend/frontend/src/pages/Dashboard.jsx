import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/unauthorized"); // Redirigir si no está autenticado
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Función para manejar el logout
  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirigir al login después del logout
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Barra de navegación */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-gray-700 dark:text-gray-300">
                Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/settings" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Configuración
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Bienvenido al Dashboard</h1>
        {user ? (
          <p className="mt-4 text-gray-700 dark:text-gray-300">Usuario: {user.email}</p>
        ) : (
          <p className="mt-4 text-gray-700 dark:text-gray-300">Cargando usuario...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
