import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // 👈 Importante para que las cookies se envíen automáticamente
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    if (response?.status === 401 && !config._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axiosInstance.post("/auth/refresh-token"); // 👈 El backend responderá con una nueva cookie

          onRefreshed();
          isRefreshing = false;
        } catch (err) {
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push(() => {
          config._retry = true;
          resolve(axiosInstance(config)); // 👈 Reintenta la solicitud original
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
