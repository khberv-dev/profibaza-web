// src/shared/api/client.ts
import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "./types";

export const TOKEN_KEY = "pb_token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
    config.headers = new AxiosHeaders(config.headers);
  }
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<any>) => {
    const data = error.response?.data;
    const lang = (localStorage.getItem("i18nextLng") || "ru").split("-")[0];

    const serverMsg =
      typeof data === "string"
        ? data
        : data?.[lang] || data?.message || error.message || "Unexpected error";

    const e: ApiError = {
      status: error.response?.status ?? 0,
      message: serverMsg, // 👈 уже человекочитаемое
      details: data,
    };
    return Promise.reject(e);
  }
);
