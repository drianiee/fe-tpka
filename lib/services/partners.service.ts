// lib/services/partners.service.ts
import { http } from "@/lib/api/http";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Partner } from "@/lib/types/partners";

export type ListPartnersParams = {
  q?: string;
  limit?: number;
};

export const partnersService = {
  async list(params?: ListPartnersParams): Promise<Partner[]> {
    const { data } = await http.get<Partner[]>(
      API_ENDPOINTS.PARTNERS.BASE,
      { params }
    );
    return data;
  },
};
