import axios from "axios";
import { getToken, clearToken } from "@/lib/utils/storage";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false, // kita pakai Bearer token, bukan cookie SPA
});

// attach Authorization token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle 401 global (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // token invalid/expired
      clearToken();
    }
    return Promise.reject(err);
  }
);
