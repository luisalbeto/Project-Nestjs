import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useDarkMode } from "./hooks/useDarkMode";
import { useAuth } from "./context/AuthContext"; // Importar AuthContext
import RequireAuth from "./components/RequireAuth"; // Importar RequireAuth
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Unauthorized from "./pages/Unauthorized"; // Importar la página Unauthorized

const App = () => {
  const [isDark] = useDarkMode(); // Aplicar el tema oscuro
  const { user, isLoading } = useAuth(); // Obtener usuario autenticado desde el contexto
  if (isLoading) return <p>Cargando...</p>; // Mostrar mientras se verifica autenticación

  return (
    <I18nextProvider i18n={i18n}>
      <div className={isDark ? "dark" : ""}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

          {/* Rutas protegidas por autenticación */}
          <Route element={<RequireAuth allowedRoles={["USER", "ADMIN", "SUPERVISOR"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Ruta de acceso denegado */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </I18nextProvider>
  );
};

export default App;
