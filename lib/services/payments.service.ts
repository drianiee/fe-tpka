import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CreatePaymentRequest, CreatePaymentResponse } from "@/lib/types/payments";

export class PaymentsService {
  async createMidtrans(payload: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    const res = await api.post<CreatePaymentResponse>(API_ENDPOINTS.PAYMENTS.MIDTRANS_CREATE, payload);
    return res.data;
  }

  async payBySchedule(scheduleId: number | string, amount: number): Promise<CreatePaymentResponse> {
    const res = await api.post<CreatePaymentResponse>(API_ENDPOINTS.PAYMENTS.PAY_BY_SCHEDULE(scheduleId), {
      schedule_id: Number(scheduleId),
      amount,
    });
    return res.data;
  }
}

export const paymentsService = new PaymentsService();
