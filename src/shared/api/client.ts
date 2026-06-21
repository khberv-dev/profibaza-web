// src/shared/api/client.ts
import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "./types";
import { getAuthToken, useAuthStore } from "../stores/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://profibaza.uz/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
    config.headers = new AxiosHeaders(config.headers);
  }
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<any>) => {
    // авто-логаут на 401
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    const data = error.response?.data;
    const lang = (localStorage.getItem("i18nextLng") || "uz").split("-")[0];

    const serverMsg =
      typeof data === "string"
        ? data
        : data?.[lang] || data?.message || error.message || "Unexpected error";

    const e: ApiError = {
      status: error.response?.status ?? 0,
      message: serverMsg,
      details: data,
    };
    return Promise.reject(e);
  }
);
