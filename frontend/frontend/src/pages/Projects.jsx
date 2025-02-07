import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import axios from "axios";

const Projects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    ownerId: "", // Nuevo estado para el ownerId
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

  // Crear proyecto (solo ADMIN y SUPERVISOR)
  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        "http://localhost:3000/projects",
        {
          name: newProject.name,
          description: newProject.description,
          owner: { connect: { id: Number(newProject.ownerId) } }, // Asignamos el owner desde el select
        },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setNewProject({ name: "", description: "", ownerId: "" });
    },
  });

  if (projectsLoading || usersLoading) return <p>Cargando datos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Proyectos</h1>

      {/* Formulario para crear proyecto (solo ADMIN y SUPERVISOR) */}
      {(user?.role === "ADMIN" || user?.role === "SUPERVISOR") && (
        <div className="mb-4 border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Crear Proyecto</h2>
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="border p-2 mr-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="border p-2 mr-2 w-full mb-2"
          />

          {/* Select para elegir owner */}
          <select
            value={newProject.ownerId}
            onChange={(e) => setNewProject({ ...newProject, ownerId: e.target.value })}
            className="border p-2 w-full mb-2"
          >
            <option value="">Selecciona un Supervisor</option>
            {users
              ?.filter((u) => u.role === "ADMIN") // Filtramos solo SUPERVISORES
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
          </select>

          <button
            onClick={() => createProjectMutation.mutate()}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            disabled={!newProject.name || !newProject.ownerId}
          >
            Crear Proyecto
          </button>
        </div>
      )}

      {/* Listado de proyectos */}
      <ul>
        {projects?.map((project) => (
          <li key={project.id} className="border p-4 mb-2 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p>{project.description}</p>
              <p className="text-sm text-gray-500">Dueño: {project.owner?.name}</p>
            </div>

            <div>
              {/* Solo el dueño (SUPERVISOR) puede editar */}
              {user?.id === project.ownerId && user?.role === "SUPERVISOR" && (
                <button
                  onClick={() => {
                    const newName = prompt("Nuevo nombre:", project.name);
                    if (newName) {
                      updateProjectMutation.mutate({ id: project.id, name: newName });
                    }
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                  Editar
                </button>
              )}

              {/* Solo ADMIN puede eliminar */}
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => deleteProjectMutation.mutate(project.id)}
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

export default Projects;
