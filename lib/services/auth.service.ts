import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
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
}

export const authService = new AuthService();
