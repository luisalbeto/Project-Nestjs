  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { useAuth } from "../hooks/useAuth";
  import { useState } from "react";
  import { useTranslation } from "react-i18next";
  import axiosInstance from "../api/axiosInstance";
  import Navbar from "../components/Navbar";
  import { useDarkMode } from '../hooks/useDarkMode';

  const Tasks = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isDark] = useDarkMode();

    const [newTask, setNewTask] = useState({
      title: "",
      description: "",
      projectId: "",
      assignedToId: "",
      priority: "MEDIUM",
    });

    // Obtener tareas
    const { data: tasks, isLoading: tasksLoading } = useQuery({
      queryKey: ["tasks"],
      queryFn: async () => {
        const { data } = await axiosInstance.get("/tasks", { withCredentials: true });
        return data;
      },
    });

    // Obtener proyectos
    const { data: projects, isLoading: projectsLoading } = useQuery({
      queryKey: ["projects"],
      queryFn: async () => {
        const { data } = await axiosInstance.get("/projects", { withCredentials: true });
        return data;
      },
    });

    // Obtener usuarios
    const { data: users, isLoading: usersLoading } = useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const { data } = await axiosInstance.get("/users", { withCredentials: true });
        return data;
      },
    });

    // Mutación para crear tarea
    const createTaskMutation = useMutation({
      mutationFn: async () => {
        const { data } = await axiosInstance.post(
          "/tasks",
          {
            title: newTask.title,
            description: newTask.description,
            projectId: Number(newTask.projectId),
            assignedToId: newTask.assignedToId ? Number(newTask.assignedToId) : null,
            priority: newTask.priority,
          },
          { withCredentials: true }
        );
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        setNewTask({ title: "", description: "", projectId: "", assignedToId: "", priority: "MEDIUM" });
      },
    });

    //  🔹 Mutación para actualizar el estado de la tarea
    const updateTaskStatus = async (taskId) => {
      try {
        await axiosInstance.patch(`/tasks/${taskId}/status`, { status: "COMPLETED" }, { withCredentials: true });
        queryClient.invalidateQueries(["tasks"]); // Refrescar la lista de tareas
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
      }
    };
    
    if (tasksLoading || projectsLoading || usersLoading) return <p>{t("tasks.loading")}</p>;

    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <Navbar />

        <h1 className="text-2xl font-bold mb-4">{t("tasks.management")}</h1>

        {/* Formulario para crear tarea */}
        {(user?.role === "ADMIN" || user?.role === "SUPERVISOR") && (
          <div className="mb-4 border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{t("tasks.create")}</h2>
            <input
              type="text"
              placeholder={t("tasks.titlePlaceholder")}
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="border p-2 w-full mb-2"
            />

            <select
              value={newTask.projectId}
              onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
              className="border p-2 w-full mb-2"
            >
              <option value="">{t("tasks.selectProject")}</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={newTask.assignedToId}
              onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
              className="border p-2 w-full mb-2"
            >
              <option value="">{t("tasks.assignUser")}</option>
              {users?.filter(u => u.role === "USER").map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>

            <button
              onClick={() => createTaskMutation.mutate()}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              disabled={!newTask.title || !newTask.projectId}
            >
              {t("tasks.createButton")}
            </button>
          </div>
        )}

        {/* Lista de tareas */}
        <ul>
  {tasks?.map((task) => (
    <li key={task.id} className={`border p-4 mb-2 flex justify-between items-center rounded`}>
      <div>
        <h2 className="text-lg font-semibold text-gray-500">{task.title}</h2>
        <p>{task.description}</p>
        <p className="text-sm text-gray-500">Proyecto: {task.project?.name}</p>
        <p className="text-sm text-gray-500">Asignado a: {task.assignedTo?.name || "Sin asignar"}</p>
        <p className="text-sm font-bold">Estado: {task.status}</p>
      </div>
      {user?.role === "USER" && task.assignedTo?.id === user.id && task.status === "PENDING" && (
  <button onClick={() => updateTaskStatus(task.id)} className="bg-green-500 text-white px-4 py-2 rounded">
  Marcar como Completado
</button>
      )}
    </li>
  ))}
</ul>
      </div>
    );
  };

  export default Tasks;
