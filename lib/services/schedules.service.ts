// lib/services/schedules.service.ts

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
  async list(): Promise<ScheduleListItem[]> {
    const { data } = await http.get<ScheduleListItem[]>(
      API_ENDPOINTS.SCHEDULES.BASE
    );
    return data;
  },

  async create(payload: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    const { data } = await http.post<CreateScheduleResponse>(
      API_ENDPOINTS.SCHEDULES.BASE,
      payload
    );
    return data;
  },

  async detail(id: number | string): Promise<ScheduleDetail> {
    const { data } = await http.get<ScheduleDetail>(
      API_ENDPOINTS.SCHEDULES.DETAIL(id)
    );
    return data;
  },

  async addParticipant(
    scheduleId: number | string,
    payload: AddParticipantRequest
  ): Promise<AddParticipantResponse> {
    const { data } = await http.post<AddParticipantResponse>(
      API_ENDPOINTS.SCHEDULES.PARTICIPANTS(scheduleId),
      payload
    );
    return data;
  },

  async removeParticipant(
    scheduleId: number | string,
    userId: number | string
  ): Promise<RemoveParticipantResponse> {
    const { data } = await http.delete<RemoveParticipantResponse>(
      API_ENDPOINTS.SCHEDULES.PARTICIPANT_DELETE(scheduleId, userId)
    );
    return data;
  },
};
