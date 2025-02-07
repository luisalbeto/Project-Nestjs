import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* 🔹 Barra de navegación */}
      <Navbar />

      {/* 🔹 Contenido principal */}
      <main className="flex-1 flex justify-center items-center bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold">Bienvenido al Dashboard</h2>
      </main>
    </div>
  );
};

export default Dashboard;
