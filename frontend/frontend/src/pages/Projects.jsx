import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "../hooks/useDarkMode";

const Projects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isDark] = useDarkMode();
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    ownerId: "",
  });

  // Obtener proyectos
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/projects", {
        withCredentials: true,
      });
      return data;
    },
  });

  // Obtener usuarios
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users", {
        withCredentials: true,
      });
      return data;
    },
  });

  // Crear proyecto
  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(
        "/projects",
        {
          name: newProject.name,
          description: newProject.description,
          owner: { connect: { id: Number(newProject.ownerId) } },
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

  // Eliminar Proyecto
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId) => {
      await axiosInstance.delete(`/projects/${projectId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  if (projectsLoading || usersLoading) return <p>{t("loading")}</p>;

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <Navbar />

      <h1 className="text-2xl font-bold mb-4">{t("projects.title")}</h1>

      {/* Formulario para crear proyecto */}
      {(user?.role === "ADMIN" || user?.role === "SUPERVISOR") && (
        <div className="mb-4 border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{t("projects.create")}</h2>
          <input
            type="text"
            placeholder={t("projects.namePlaceholder")}
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="border p-2 mr-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder={t("projects.descriptionPlaceholder")}
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="border p-2 mr-2 w-full mb-2"
          />

          {/* Select para elegir owner */}
          <select
            value={newProject.ownerId}
            onChange={(e) => setNewProject({ ...newProject, ownerId: e.target.value })}
            className="border p-2 w-full mb-2 text-gray-400"
          >
            <option value="">{t("projects.selectOwner")}</option>
            {users
              ?.filter((u) => u.role === "SUPERVISOR")
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
            {t("projects.createButton")}
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
              <p className="text-sm text-gray-500">
                {t("projects.owner")}: {project.owner?.name}
              </p>
            </div>

            <div>
              {/* Solo el dueño puede editar */}
              {user?.id === project.ownerId && (
                <button
                  onClick={() => {
                    const newName = prompt(t("projects.editPrompt"), project.name);
                    if (newName) {
                      updateProjectMutation.mutate({ id: project.id, name: newName });
                    }
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                  {t("projects.edit")}
                </button>
              )}

              {/* Solo ADMIN puede eliminar */}
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => {
                    if (window.confirm(t("projects.deleteConfirm"))) {
                      deleteProjectMutation.mutate(project.id);
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  {t("projects.delete")}
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
