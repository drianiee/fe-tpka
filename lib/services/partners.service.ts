// lib/services/partners.service.ts
import { http } from "@/lib/api/http";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  PartnerListItem,
  CreatePartnerRequest,
  CreatePartnerResponse,
} from "@/lib/types/partners";

export type ListPartnersParams = {
  q?: string;
  limit?: number;
};

export const partnersService = {
  async list(params?: ListPartnersParams): Promise<PartnerListItem[]> {
    const { data } = await http.get<PartnerListItem[]>(
      API_ENDPOINTS.PARTNERS.BASE,
      { params }
    );
    return data;
  },

  async create(payload: CreatePartnerRequest): Promise<CreatePartnerResponse> {
    // ✅ POST /api/partners
    const { data } = await http.post<CreatePartnerResponse>(
      API_ENDPOINTS.PARTNERS.BASE,
      payload
    );
    return data;
  },
};
