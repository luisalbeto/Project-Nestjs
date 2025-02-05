import React, { createContext, useContext } from "react";
import axiosClient from "../utils/axiosClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  // Obtener usuario autenticado con useQuery
  const { data: userData, isLoading } = useQuery<User | null>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosClient.get<{ user: User }>("auth/me");
      return response.data.user;
    },
    retry: false, // Evita bucles infinitos
  });

  const user: User | null = userData ?? null;
  const isAuthenticated = !!user;

  // Mutación para login
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await axiosClient.post<{ user: User }>("auth/login", {
        email,
        password,
      });
      return response.data.user;
    },
    onSuccess: () => {
      navigate("/dashboard"); // Redirige al dashboard después de login exitoso
    },
    onError: (error) => {
      console.error("Error al iniciar sesión:", error);
    },
  });

  // Mutación para logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.post("auth/logout");
    },
    onSuccess: () => {
      navigate("/"); // Redirige a login después del logout
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login: async (email: string, password: string) => {
          return await loginMutation.mutateAsync({ email, password });
        },
        logout: logoutMutation.mutateAsync,
        error: loginMutation.error?.message || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
