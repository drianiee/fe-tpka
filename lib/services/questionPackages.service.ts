import { http } from "@/lib/api/http";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { QuestionPackage } from "@/lib/types/question-packages";

export const questionPackagesService = {
  async list(params?: { q?: string; limit?: number }) {
    const { data } = await http.get<QuestionPackage[]>(
      API_ENDPOINTS.QUESTION_PACKAGES.BASE,
      { params }
    );
    return data;
  },
};
