// src/components/RequireAuth.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica si el usuario está autenticado y si tiene el rol adecuado
    if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
      // Si no está autenticado o no tiene el rol permitido, redirige a "unauthorized"
      navigate("/unauthorized", { replace: true });
    }
  }, [isAuthenticated, user, allowedRoles, navigate]); // Dependencias de useEffect

  // Si la redirección ya se ha realizado, no renderizamos el contenido
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  // Si tiene el rol adecuado, renderiza los hijos (contenido protegido)
  return children;
};

export default RequireAuth;
