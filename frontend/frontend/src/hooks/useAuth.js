import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const fetchUser = async () => {
  try {
    const { data } = await axiosInstance.get("/auth/me");
    console.log("✅ Usuario autenticado:", data);
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("⚠️ No hay sesión activa. Usuario no autenticado.");
      return null;
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

  
//register

const registerMutation = useMutation({
  mutationFn: async (userData) => {
    console.log("🔄 Registrando usuario con:", userData);
    const { data } = await axiosInstance.post("/auth/register", userData);
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
      const { data } = await axiosInstance.post("/auth/login", credentials, { withCredentials: true });
      console.log("📥 Respuesta del backend:", data);
      return data;
    },
    onSuccess: async (data) => {
      console.log("✅ Login exitoso, actualizando usuario...");
      queryClient.setQueryData(["user"], data.user);

      console.log("📡 Verificando usuario en caché...");
      const updatedUser = queryClient.getQueryData(["user"]);
      console.log("🧑‍💻 Usuario en caché actualizado:", updatedUser);

      if (updatedUser) {
        console.log("🚀 Redirigiendo a /dashboard...");
        navigate("/dashboard", { replace: true });
      } else {
        console.warn("⚠️ Usuario sigue siendo null después del login.");
      }
    },
    onError: (error) => {
      console.error("❌ Error en login:", error.response?.data || error);
    },
  });

   // Logout
 const logoutMutation = useMutation({
  mutationFn: async () => {
    console.log("🔄 Cerrando sesión...");
    await axiosInstance.post("/auth/logout");
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
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
  };
};





