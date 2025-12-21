import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  CompleteProfileRequest,
  CompleteProfileResponse,
  ResendVerifyRequest,
  ResendVerifyResponse,
} from "@/lib/types/auth";

export class AuthService {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return res.data;
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const res = await api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
    return res.data;
  }

  async me(): Promise<User> {
    const res = await api.get<User>(API_ENDPOINTS.AUTH.ME);
    return res.data;
  }

  async logout(): Promise<{ message: string }> {
    const res = await api.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
    return res.data;
  }

  // Important: complete-profile pakai multipart/form-data
  async completeProfile(
    token: string,
    payload: CompleteProfileRequest
  ): Promise<CompleteProfileResponse> {
    const form = new FormData();
    form.append("id_type", payload.id_type);
    form.append("id_image", payload.id_image);
    form.append("birth_date", payload.birth_date);
    form.append("phone", payload.phone);

    const res = await api.post<CompleteProfileResponse>(
      API_ENDPOINTS.AUTH.COMPLETE_PROFILE,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // biarkan axios set boundary otomatis
        },
      }
    );

    return res.data;
  }

  async resendVerify(payload: ResendVerifyRequest): Promise<ResendVerifyResponse> {
    const res = await api.post<ResendVerifyResponse>(API_ENDPOINTS.AUTH.RESEND_VERIFY, payload);
    return res.data;
  }
}

export const authService = new AuthService();
