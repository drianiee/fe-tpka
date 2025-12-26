// lib/services/packages.service.ts
import { http } from "@/lib/api/http";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export type QuestionPackage = {
  id: number;
  name: string;
  is_active: boolean;
};

export type ListPackagesParams = {
  q?: string;
  limit?: number;
  is_active?: boolean; // optional kalau backend support
};

export const packagesService = {
  async list(params?: ListPackagesParams): Promise<QuestionPackage[]> {
    const { data } = await http.get<QuestionPackage[]>(
      API_ENDPOINTS.QUESTION_PACKAGES.BASE,
      { params }
    );
    return data;
  },

  async updateStatus(id: number, is_active: boolean): Promise<QuestionPackage> {
    const { data } = await http.patch(
      `${API_ENDPOINTS.QUESTION_PACKAGES.BASE}/${id}/status`,
      { is_active }
    );
    // response kamu: { message, package }
    return data.package as QuestionPackage;
  },
};
