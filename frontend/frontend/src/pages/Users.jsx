import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../hooks/useDarkMode";
import { useTranslation } from "react-i18next";

const Users = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDark] = useDarkMode();
  const { t } = useTranslation();

  // Obtener lista de usuarios
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/users", {
        withCredentials: true,
      });
      return data;
    },
  });

  // Mutación para eliminar usuario
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      await axios.delete(`http://localhost:3000/users/${userId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  // Mutación para editar usuario (solo cambio de rol)
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      await axios.put(
        `http://localhost:3000/users/${userId}`,
        { role: newRole },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  if (isLoading) return <p>{t("loading")}</p>;

  // Redirigir si no es ADMIN
  if (user?.role !== "ADMIN") {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">{t("users.management")}</h1>
      <ul>
        {users?.map((u) => (
          <li
            key={u.id}
            className={`border p-4 mb-2 flex justify-between items-center ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <div>
              <h2 className="text-lg font-semibold">{u.name}</h2>
              <p>{u.email}</p>
              <p className="text-sm text-gray-500">{t("users.role")}: {u.role}</p>
            </div>

            <div>
              {/* Botón para cambiar rol */}
              <select
                value={u.role}
                onChange={(e) =>
                  updateUserMutation.mutate({ userId: u.id, newRole: e.target.value })
                }
                className="border p-2 rounded mr-2"
              >
                <option value="USER">{t("users.roles.user")}</option>
                <option value="SUPERVISOR">{t("users.roles.supervisor")}</option>
                <option value="ADMIN">{t("users.roles.admin")}</option>
              </select>

              {/* Botón para eliminar usuario */}
              <button
                onClick={() =>
                  window.confirm(t("users.deleteConfirm")) && deleteUserMutation.mutate(u.id)
                }
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {t("users.delete")}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
