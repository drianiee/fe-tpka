import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  TestSchedule,
  CreateScheduleRequest,
  CreateScheduleResponse,
  AddParticipantRequest,
  AddParticipantResponse,
} from "@/lib/types/schedules";
import type { ParticipantRegisterResponse } from "@/lib/types/payments";

export class SchedulesService {
  async list(): Promise<TestSchedule[]> {
    const res = await api.get<TestSchedule[]>(API_ENDPOINTS.SCHEDULES.BASE);
    return res.data;
  }

  async detail(id: number | string): Promise<TestSchedule> {
    const res = await api.get<TestSchedule>(API_ENDPOINTS.SCHEDULES.DETAIL(id));
    return res.data;
  }

  async create(payload: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    const res = await api.post<CreateScheduleResponse>(API_ENDPOINTS.SCHEDULES.BASE, payload);
    return res.data;
  }

  async provision(scheduleId: number | string): Promise<{ message: string; schedule: TestSchedule }> {
    const res = await api.post<{ message: string; schedule: TestSchedule }>(
      API_ENDPOINTS.SCHEDULES.PROVISION(scheduleId)
    );
    return res.data;
  }

  async addParticipant(
    scheduleId: number | string,
    payload: AddParticipantRequest
  ): Promise<AddParticipantResponse> {
    const res = await api.post<AddParticipantResponse>(
      API_ENDPOINTS.SCHEDULES.PARTICIPANTS_ADD(scheduleId),
      payload
    );
    return res.data;
  }

  async removeParticipant(scheduleId: number | string, userId: number | string): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(
      API_ENDPOINTS.SCHEDULES.PARTICIPANTS_REMOVE(scheduleId, userId)
    );
    return res.data;
  }

  // peserta - register ke jadwal (midtrans createTransaction di backend)
  async participantRegister(scheduleId: number | string): Promise<ParticipantRegisterResponse> {
    const res = await api.post<ParticipantRegisterResponse>(
      API_ENDPOINTS.SCHEDULES.PARTICIPANT_REGISTER(scheduleId)
    );
    return res.data;
  }

  async participantUpcoming(): Promise<TestSchedule[]> {
    const res = await api.get<TestSchedule[]>(API_ENDPOINTS.SCHEDULES.PARTICIPANT_BASE);
    return res.data;
  }
}

export const schedulesService = new SchedulesService();
