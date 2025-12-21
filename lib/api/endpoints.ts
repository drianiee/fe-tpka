export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/me",
    LOGOUT: "/api/logout",
  },
  DASHBOARD: {
    BASE: "/api/dashboard",
  },
} as const;
