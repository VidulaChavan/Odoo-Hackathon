import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Connects directly to your backend entry port
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT token into requests if it exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;