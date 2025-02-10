import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ROLES = ["ADMIN", "SUPERVISOR", "USER"];

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    role: z.enum(["ADMIN", "SUPERVISOR", "USER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

const Register = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const { register: registerUser } = useAuth();

  const onSubmit = (data) => {
    registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          {t("register.title")}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">{t("register.name")}</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            {errors.name && <p className="text-red-500 text-sm">{t(errors.name.message)}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">{t("register.email")}</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            {errors.email && <p className="text-red-500 text-sm">{t(errors.email.message)}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">{t("register.password")}</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            {errors.password && <p className="text-red-500 text-sm">{t(errors.password.message)}</p>}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">{t("register.confirmPassword")}</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{t(errors.confirmPassword.message)}</p>}
          </div>

          {/* Seleccionar Rol */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">{t("register.role")}</label>
            <select
              {...register("role")}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">{t("register.selectRole")}</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {t(`roles.${role.toLowerCase()}`)}
                </option>
              ))}
            </select>
            {errors.role && <p className="text-red-500 text-sm">{t(errors.role.message)}</p>}
          </div>

          {/* Botón de Registro */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t("register.submit")}
          </button>

          {/* Enlace a Login */}
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            {t("register.alreadyHaveAccount")}{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              {t("register.login")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
