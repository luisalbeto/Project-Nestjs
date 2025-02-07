import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";

const Settings = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useDarkMode();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-10">
      <div className="container max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">{t("settings.title")}</h1>

        {/* Sección de Idioma */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{t("settings.language")}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => changeLanguage("es")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              🇪🇸 {t("settings.spanish")}
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              🇺🇸 {t("settings.english")}
            </button>
          </div>
        </div>

        {/* Sección de Modo Oscuro */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{t("settings.theme")}</h2>
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-lg transition hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {isDark ? t("settings.lightMode") : t("settings.darkMode")}
          </button>
        </div>

        {/* Botón para volver al Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
        >
          {t("settings.back")}
        </button>
      </div>
    </div>
  );
};

export default Settings;
