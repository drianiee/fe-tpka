import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { DashboardResponse } from "@/lib/types/dashboard";

export class DashboardService {
  async getDashboard(limit = 10): Promise<DashboardResponse> {
    const res = await api.get<DashboardResponse>(API_ENDPOINTS.DASHBOARD.BASE, {
      params: { limit },
    });
    return res.data;
  }
}

export const dashboardService = new DashboardService();
