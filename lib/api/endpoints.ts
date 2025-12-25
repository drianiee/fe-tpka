export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/me",
    LOGOUT: "/api/logout",
    COMPLETE_PROFILE: "/api/auth/complete-profile",
    RESEND_VERIFY: "/api/auth/email/resend",
  },

  DASHBOARD: {
    BASE: "/api/dashboard",
  },

  SCHEDULES: {
    BASE: "/api/schedules",
    DETAIL: (id: number | string) => `/api/schedules/${id}`,
    PARTICIPANTS: (scheduleId: number | string) =>
      `/api/schedules/${scheduleId}/participants`,
    PARTICIPANT_DELETE: (scheduleId: number | string, userId: number | string) =>
      `/api/schedules/${scheduleId}/participants/${userId}`,
    PROVISION: (scheduleId: number | string) => `/api/schedules/${scheduleId}/provision`,
  },

  PACKAGES: {
    BASE: "/api/question-packages",
    DETAIL: (id: number | string) => `/api/question-packages/${id}`,
  },

  PAYMENTS: {
    MIDTRANS_CREATE: "/api/payments/midtrans/create",
    MIDTRANS_CALLBACK: "/api/payments/midtrans/callback",
    // peserta bayar by schedule
    PAY_BY_SCHEDULE: (scheduleId: number | string) =>
      `/api/participant/schedules/${scheduleId}/pay`,
  },
} as const;
