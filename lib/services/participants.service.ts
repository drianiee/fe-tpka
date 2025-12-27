import { http } from "@/lib/api/http";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PaginatedResponse } from "@/lib/types/pagination";
import type { ParticipantListItem, ParticipantDetailResponse } from "@/lib/types/participants";

export type ListParticipantsParams = {
  q?: string;
  per_page?: number;
  page?: number;
};

export const participantsService = {
  list: async (params: ListParticipantsParams) => {
    const res = await http.get<PaginatedResponse<ParticipantListItem>>(
      API_ENDPOINTS.PARTICIPANTS.BASE,
      { params }
    );
    return res.data;
  },

  detail: async (id: number | string) => {
    const res = await http.get<ParticipantDetailResponse>(
      API_ENDPOINTS.PARTICIPANTS.DETAIL(id)
    );
    return res.data;
  },
};
