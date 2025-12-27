import { http } from "@/lib/api/http"
import { API_ENDPOINTS } from "@/lib/api/endpoints"
import type {
  PartnerListItem,
  CreatePartnerRequest,
  CreatePartnerResponse,
} from "@/lib/types/partners"
import type { PaginatedResponse } from "@/lib/types/pagination"

export type ListPartnersParams = {
  q?: string
  limit?: number
  per_page?: number
  page?: number
  is_active?: boolean
}

function pickPartnersArray(raw: unknown): PartnerListItem[] {
  if (Array.isArray(raw)) return raw as PartnerListItem[]
  if (raw && typeof raw === "object") {
    const r = raw as Partial<PaginatedResponse<PartnerListItem>>
    if (Array.isArray(r.data)) return r.data
  }
  return []
}

export const partnersService = {
  async list(params?: ListPartnersParams): Promise<PartnerListItem[]> {
    const { data } = await http.get<unknown>(API_ENDPOINTS.PARTNERS.BASE, { params })
    return pickPartnersArray(data)
  },

  async create(payload: CreatePartnerRequest): Promise<CreatePartnerResponse> {
    const { data } = await http.post<CreatePartnerResponse>(
      API_ENDPOINTS.PARTNERS.BASE,
      payload
    )
    return data
  },
}
