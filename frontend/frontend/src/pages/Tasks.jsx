import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import axios from "axios";

const Tasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
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
      const { data } = await axios.get("http://localhost:3000/tasks", {
        withCredentials: true,
      });
      return data;
    },
  });

  // Obtener proyectos
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/projects", {
        withCredentials: true,
      });
      return data;
    },
  });

  // Obtener usuarios
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/users", {
        withCredentials: true,
      });
      return data;
    },
  });

  // Crear tarea (ADMIN y SUPERVISOR)
  const createTaskMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        "http://localhost:3000/tasks",
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
      queryClient.invalidateQueries(["tasks"]);
      setNewTask({ title: "", description: "", projectId: "", assignedToId: "", priority: "MEDIUM" });
    },
  });

  // Actualizar estado de tarea (solo el usuario asignado)
  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.put(
        `http://localhost:3000/tasks/${id}`,
        { status },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Eliminar tarea (solo ADMIN)
  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/tasks/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  if (tasksLoading || projectsLoading || usersLoading) return <p>Cargando datos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tareas</h1>

      {/* Formulario para crear tarea (solo ADMIN y SUPERVISOR) */}
      {(user?.role === "ADMIN" || user?.role === "SUPERVISOR") && (
        <div className="mb-4 border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Crear Tarea</h2>
          <input
            type="text"
            placeholder="Título de la tarea"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border p-2 mr-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="border p-2 mr-2 w-full mb-2"
          />

          {/* Select para elegir proyecto */}
          <select
            value={newTask.projectId}
            onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
            className="border p-2 w-full mb-2"
          >
            <option value="">Selecciona un Proyecto</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Select para asignar usuario */}
          <select
            value={newTask.assignedToId}
            onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
            className="border p-2 w-full mb-2"
          >
            <option value="">Asignar a un Usuario</option>
            {users?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>

          <button
            onClick={() => createTaskMutation.mutate()}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            disabled={!newTask.title || !newTask.projectId}
          >
            Crear Tarea
          </button>
        </div>
      )}

      {/* Listado de tareas */}
      <ul>
        {tasks?.map((task) => (
          <li key={task.id} className="border p-4 mb-2 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <p className="text-sm text-gray-500">Proyecto: {task.project?.name}</p>
              <p className="text-sm text-gray-500">Asignado a: {task.assignedTo?.name || "Sin asignar"}</p>
              <p className="text-sm">
                Estado:{" "}
                <span className={`font-semibold ${task.status === "COMPLETED" ? "text-green-600" : "text-yellow-500"}`}>
                  {task.status}
                </span>
              </p>
            </div>

            <div>
              {/* Solo el usuario asignado puede actualizar el estado */}
              {user?.id === task.assignedToId && (
                <button
                  onClick={() => {
                    const newStatus = prompt("Nuevo estado (PENDING, IN_PROGRESS, COMPLETED):", task.status);
                    if (newStatus) {
                      updateTaskStatusMutation.mutate({ id: task.id, status: newStatus });
                    }
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cambiar Estado
                </button>
              )}

              {/* Solo ADMIN puede eliminar */}
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => deleteTaskMutation.mutate(task.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
