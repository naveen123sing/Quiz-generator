import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request Interceptor (token attach karega)
axiosClient.interceptors.request.use(
  (config) => {
    // if (config.url?.includes("/auth/guest")) {
    //   return config;
    // }
    const token = localStorage.getItem("token");

    if (token && !config.url?.includes("/auth/guest")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (token expire handle)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      const currentPath = window.location.pathname;

      if (currentPath !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
