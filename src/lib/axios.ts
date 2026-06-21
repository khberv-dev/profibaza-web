import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://profibaza.uz/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // обработка 401/429/и т.д.
    return Promise.reject(err);
  }
);
