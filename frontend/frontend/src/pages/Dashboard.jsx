import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../hooks/useDarkMode";
import { useTranslation } from "react-i18next";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const [isDark] = useDarkMode();
  const { t } = useTranslation();

  // Consultas para obtener estadísticas
  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/projects", { withCredentials: true });
      return data;
    },
  });

  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/tasks", { withCredentials: true });
      return data;
    },
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users", { withCredentials: true });
      return data;
    },
  });

  return (
    <div className={`h-screen flex flex-col ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* 🔹 Barra de navegación */}
      <Navbar />

      {/* 🔹 Contenido principal */}
      <main className="flex-1 flex flex-col justify-center items-center p-6">
        <h2 className="text-2xl font-semibold mb-4">{t("dashboard.welcome")}</h2>

        {/* 🔹 Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="p-6 border rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold">{t("dashboard.projects")}</h3>
            <p className="text-3xl">{loadingProjects ? t("dashboard.loading") : projects?.length}</p>
          </div>

          <div className="p-6 border rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold">{t("dashboard.tasks")}</h3>
            <p className="text-3xl">{loadingTasks ? t("dashboard.loading") : tasks?.length}</p>
          </div>

          <div className="p-6 border rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold">{t("dashboard.users")}</h3>
            <p className="text-3xl">{loadingUsers ? t("dashboard.loading") : users?.length}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
