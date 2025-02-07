import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  email: z.string().email("Debe ser un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function Login() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    login(data, {
      onError: (error) => {
        //console.error("❌ Error en login:", error.response?.data || error);

        if (error.response?.status === 401) {
          setError("email", { message: "Correo o contraseña incorrectos" });
          setError("password", { message: "Correo o contraseña incorrectos" });
        } else {
          setError("email", { message: "Error desconocido, intenta nuevamente" });
        }
      },
    });
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow-lg rounded">
        <h2 className="text-xl font-bold mb-4 dark:text-black">Iniciar Sesión</h2>

        <label className="block dark:text-black">Correo Electrónico</label>
        <input {...register("email")} className="border p-2 w-full dark:text-black" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <label className="block mt-4 dark:text-black">Contraseña</label>
        <input type="password" {...register("password")} className="border p-2 w-full dark:text-black" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <button type="submit" className="bg-blue-500 text-white mt-4 p-2 w-full dark:text-black">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

