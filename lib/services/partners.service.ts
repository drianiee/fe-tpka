import { http } from "@/lib/api/http"
import { API_ENDPOINTS } from "@/lib/api/endpoints"
import type { PartnerListItem, CreatePartnerRequest, CreatePartnerResponse } from "@/lib/types/partners"
import type { PaginatedResponse } from "@/lib/types/pagination"

export type ListPartnersParams = {
  q?: string
  per_page?: number
  page?: number
}

export const partnersService = {
  async list(params?: ListPartnersParams): Promise<PaginatedResponse<PartnerListItem>> {
    const { data } = await http.get<PaginatedResponse<PartnerListItem>>(API_ENDPOINTS.PARTNERS.BASE, { params })
    return data
  },

  async create(payload: CreatePartnerRequest): Promise<CreatePartnerResponse> {
    const { data } = await http.post<CreatePartnerResponse>(API_ENDPOINTS.PARTNERS.BASE, payload)
    return data
  },
}
