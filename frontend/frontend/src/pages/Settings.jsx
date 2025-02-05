import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDarkMode } from "../hooks/useDarkMode";

const Settings = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useDarkMode();

  // Obtener datos del usuario autenticado
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/me", {
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        navigate("/"); // Redirigir al login si no está autenticado
      }
    },
  });

  // Función para cambiar idioma
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  // Manejo de estados de carga y error
  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-2xl font-bold">{t("settings.title")}</h1>

      {/* Botones para cambiar idioma */}
      <div className="mt-4">
        <button onClick={() => changeLanguage("es")} className="mx-2 p-2 bg-blue-500 text-white rounded">
          🇪🇸 Español
        </button>
        <button onClick={() => changeLanguage("en")} className="mx-2 p-2 bg-green-500 text-white rounded">
          🇺🇸 English
        </button>
      </div>

      {/* Botón para cambiar tema */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
      >
        {isDark ? t("settings.lightMode") : t("settings.darkMode")}
      </button>

      {/* Botón para regresar al Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        {t("settings.back")}
      </button>
    </div>
  );
};

export default Settings;
