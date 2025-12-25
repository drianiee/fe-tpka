import axios from "axios";
import { getToken } from "@/lib/utils/storage";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000",
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers = config.headers ?? {};
  config.headers.Accept = "application/json";
  return config;
});
