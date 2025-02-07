import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Función para obtener el usuario autenticado
const fetchUser = async () => {
  try {
    const { data } = await axios.get("/auth/me", { withCredentials: true });
    console.log("✅ Usuario autenticado:", data);
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("⚠️ No hay sesión activa. Usuario no autenticado.");
      return null; // Devolvemos null en caso de 401 para evitar errores en la UI
    }
    console.error("❌ Error obteniendo usuario:", error.response?.data || error);
    throw error;
  }
};

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Obtener usuario actual
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  // Registro de usuario
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      console.log("🔄 Registrando usuario con:", userData);
      const { data } = await axios.post("/auth/register", userData, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: (data) => {
      console.log("✅ Registro exitoso:", data);
      navigate("/"); // Redirige al login tras registro exitoso
    },
    onError: (error) => {
      console.error("❌ Error en registro:", error.response?.data || error);
    },
  });

  // Login
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      console.log("🔄 Iniciando login con:", credentials);
      const { data } = await axios.post("/auth/login", credentials, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: async (data) => {
      console.log("✅ Login exitoso:", data);
      await queryClient.invalidateQueries(["user"]); // Refresca el usuario autenticado
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("❌ Error en login:", error.response?.data || error);
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("🔄 Cerrando sesión...");
      await axios.post("/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      console.log("✅ Logout exitoso");
      queryClient.setQueryData(["user"], null);
      navigate("/");
    },
    onError: (error) => {
      console.error("❌ Error en logout:", error.response?.data || error);
    },
  });

  return {
    user,
    isLoading,
    register: registerMutation.mutate, // Agregamos la función de registro
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
};
