import { http } from "@/lib/api/http"
import { API_ENDPOINTS } from "@/lib/api/endpoints"
import type { QuestionPackage } from "@/lib/types/question-packages"
import type { PaginatedResponse } from "@/lib/types/pagination"

export type ListQuestionPackagesParams = {
  q?: string
  limit?: number
  per_page?: number
  page?: number
  is_active?: boolean
}

function pickPackagesArray(raw: unknown): QuestionPackage[] {
  if (Array.isArray(raw)) return raw as QuestionPackage[]
  if (raw && typeof raw === "object") {
    const r = raw as Partial<PaginatedResponse<QuestionPackage>>
    if (Array.isArray(r.data)) return r.data
  }
  return []
}

export const questionPackagesService = {
  async list(params?: ListQuestionPackagesParams): Promise<QuestionPackage[]> {
    const { data } = await http.get<unknown>(API_ENDPOINTS.QUESTION_PACKAGES.BASE, { params })
    return pickPackagesArray(data)
  },
}
