import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg flex justify-between items-center">
      {/* 🔹 Logo / Título */}
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="flex gap-4">
        {/* 🔹 Botón de Settings */}
        <Link
          to="/settings"
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Settings
        </Link>

        <Link
          to="/projects"
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Projects
        </Link>

        <Link
          to="/tasks"
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Tasks
        </Link>

        {/* 🔹 Botón de Logout */}
        <button
          onClick={() => logout()}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
