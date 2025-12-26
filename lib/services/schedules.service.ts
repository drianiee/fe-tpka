import { http } from "@/lib/api/http";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  AddParticipantRequest,
  AddParticipantResponse,
  CreateScheduleRequest,
  CreateScheduleResponse,
  RemoveParticipantResponse,
  ScheduleDetail,
  ScheduleListItem,
} from "@/lib/types/schedules";

export const schedulesService = {
  list(): Promise<ScheduleListItem[]> {
    return http
      .get(API_ENDPOINTS.SCHEDULES.BASE)
      .then((r) => r.data);
  }, // TODO belum bikin limit dan pagination

  create(payload: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    return http
      .post(API_ENDPOINTS.SCHEDULES.BASE, payload)
      .then((r) => r.data);
  },

  detail(id: number | string): Promise<ScheduleDetail> {
    return http
      .get(API_ENDPOINTS.SCHEDULES.DETAIL(id))
      .then((r) => r.data);
  },

  addParticipant(
    scheduleId: number | string,
    payload: AddParticipantRequest
  ): Promise<AddParticipantResponse> {
    return http
      .post(API_ENDPOINTS.SCHEDULES.PARTICIPANTS(scheduleId), payload)
      .then((r) => r.data);
  },

  removeParticipant(
    scheduleId: number | string,
    userId: number | string
  ): Promise<RemoveParticipantResponse> {
    return http
      .delete(API_ENDPOINTS.SCHEDULES.PARTICIPANT_DELETE(scheduleId, userId))
      .then((r) => r.data);
  },
};
