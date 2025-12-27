import { http } from "@/lib/api/http"
import { API_ENDPOINTS } from "@/lib/api/endpoints"
import type {
  AddParticipantRequest,
  AddParticipantResponse,
  CreateScheduleRequest,
  CreateScheduleResponse,
  RemoveParticipantResponse,
  ScheduleDetail,
  ScheduleListItem,
  PaginatedResponse,
} from "@/lib/types/schedules"

export type ListSchedulesParams = {
  q?: string
  status?: string
  date_from?: string
  date_to?: string
  per_page?: number
  page?: number
}

export type ExportSchedulesResponse<T = ScheduleListItem> = {
  message: string
  mode: "print"
  filters: {
    q?: string | null
    status?: string | null
    date_from?: string | null
    date_to?: string | null
  }
  total: number
  download_url: string
  data?: T[]
}

export const schedulesService = {
  list(params?: ListSchedulesParams): Promise<PaginatedResponse<ScheduleListItem>> {
    return http.get(API_ENDPOINTS.SCHEDULES.BASE, { params }).then((r) => r.data)
  },

  exportExcel(params?: Omit<ListSchedulesParams, "per_page" | "page">): Promise<ExportSchedulesResponse> {
    return http
      .get(API_ENDPOINTS.SCHEDULES.BASE, {
        params: { ...(params ?? {}), print: 1 },
      })
      .then((r) => r.data)
  },

  create(payload: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    return http.post(API_ENDPOINTS.SCHEDULES.BASE, payload).then((r) => r.data)
  },

  detail(id: number | string): Promise<ScheduleDetail> {
    return http.get(API_ENDPOINTS.SCHEDULES.DETAIL(id)).then((r) => r.data)
  },

  addParticipant(
    scheduleId: number | string,
    payload: AddParticipantRequest
  ): Promise<AddParticipantResponse> {
    return http
      .post(API_ENDPOINTS.SCHEDULES.PARTICIPANTS(scheduleId), payload)
      .then((r) => r.data)
  },

  removeParticipant(
    scheduleId: number | string,
    userId: number | string
  ): Promise<RemoveParticipantResponse> {
    return http
      .delete(API_ENDPOINTS.SCHEDULES.PARTICIPANT_DELETE(scheduleId, userId))
      .then((r) => r.data)
  },
}
