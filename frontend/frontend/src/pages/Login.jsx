import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { login } = useAuth();
  const { t } = useTranslation();
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
        if (error.response?.status === 401) {
          setError("email", { message: t("login.invalidCredentials") });
          setError("password", { message: t("login.invalidCredentials") });
        } else {
          setError("email", { message: t("login.unknownError") });
        }
      },
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          {t("login.title")}
        </h2>

        <label className="block text-gray-700 dark:text-gray-300">
          {t("login.email")}
        </label>
        <input
          {...register("email")}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <label className="block mt-4 text-gray-700 dark:text-gray-300">
          {t("login.password")}
        </label>
        <input
          type="password"
          {...register("password")}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white mt-4 p-2 w-full rounded hover:bg-blue-600 transition"
        >
          {t("login.submit")}
        </button>

        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mt-4">
          {t("login.noAccount")}{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            {t("login.register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
