import { http } from "@/lib/api/http";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PaginatedResponse } from "@/lib/types/pagination";
import type {
  OperatorListItem,
  OperatorDetailResponse,
  UpdateOperatorStatusResponse,
} from "@/lib/types/operators";

export type ListOperatorsParams = {
  q?: string;
  per_page?: number;
  page?: number;
};

export const operatorsService = {
  list: async (params: ListOperatorsParams) => {
    const res = await http.get<PaginatedResponse<OperatorListItem>>(
      API_ENDPOINTS.ADMIN.OPERATORS,
      { params }
    );
    return res.data;
  },

  detail: async (id: number | string) => {
    const res = await http.get<OperatorDetailResponse>(
      API_ENDPOINTS.ADMIN.OPERATOR_DETAIL(id)
    );
    return res.data;
  },

  updateStatus: async (id: number | string, is_active: boolean) => {
    const res = await http.patch<UpdateOperatorStatusResponse>(
      API_ENDPOINTS.ADMIN.OPERATOR_STATUS(id),
      { is_active }
    );
    return res.data;
  },
};
