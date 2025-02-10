import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="p-4 flex shadow-lg justify-between items-center transition duration-300 
      bg-blue-300 text-black dark:bg-gray-900 dark:text-white">
      
      {/* 🔹 Logo / Título */}
      <Link to="/dashboard">
        <h1 className="text-xl font-bold">{t("dashboard.welcome")}</h1>
      </Link>

      <div className="flex gap-4 items-center">
        {/* 🔹 Links de navegación */}
        <Link to="/settings" className="btn-nav">{t("settings.title")}</Link>
        <Link to="/projects" className="btn-nav">{t("projects.title")}</Link>
        <Link to="/tasks" className="btn-nav">{t("tasks.management")}</Link>
        <Link to="/users" className="btn-nav">{t("users.management")}</Link>

        {/* 🔹 Botón de Logout */}
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          {t("login.signout")}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
