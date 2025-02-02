// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import axiosClient from "../utils/axiosClient";

interface AuthContextProps {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.accessToken);
      setUser(response.data.user);
      // Redirigir o manejar según sea necesario
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Manejar errores aquí (ej. mostrar un mensaje)
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Elimina el token
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
