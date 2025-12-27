// lib/services/questionPackages.service.ts
import { http } from "@/lib/api/http";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PaginatedResponse } from "@/lib/types/pagination";
import type {
  QuestionPackage,
  ListQuestionPackagesParams,
  CreateQuestionPackageRequest,
  CreateQuestionPackageResponse,
  UpdateQuestionPackageStatusRequest,
  UpdateQuestionPackageStatusResponse,
  DeleteQuestionPackageResponse,
} from "@/lib/types/question-packages";

function toFormData(payload: CreateQuestionPackageRequest): FormData {
  const fd = new FormData();

  fd.append("name", payload.name);

  if (payload.is_active !== undefined) {
    fd.append("is_active", String(payload.is_active ? 1 : 0));
  }

  const fields: Array<keyof CreateQuestionPackageRequest> = [
    "verbal_category_id",
    "verbal_num_questions",
    "verbal_duration_minutes",
    "quantitative_category_id",
    "quantitative_num_questions",
    "quantitative_duration_minutes",
    "logic_category_id",
    "logic_num_questions",
    "logic_duration_minutes",
    "spatial_category_id",
    "spatial_num_questions",
    "spatial_duration_minutes",
  ];

  for (const key of fields) {
    const v = payload[key];
    if (typeof v === "number") fd.append(String(key), String(v));
  }

  if (payload.file) fd.append("file", payload.file);

  return fd;
}

export const questionPackagesService = {
  list(
    params?: ListQuestionPackagesParams
  ): Promise<PaginatedResponse<QuestionPackage>> {
    return http
      .get(API_ENDPOINTS.QUESTION_PACKAGES.BASE, { params })
      .then((r) => r.data as PaginatedResponse<QuestionPackage>);
  },

  detail(id: number | string): Promise<QuestionPackage> {
    return http
      .get(API_ENDPOINTS.QUESTION_PACKAGES.DETAIL(id))
      .then((r) => r.data as QuestionPackage);
  },

  create(
    payload: CreateQuestionPackageRequest
  ): Promise<CreateQuestionPackageResponse> {
    const fd = toFormData(payload);
    return http
      .post(API_ENDPOINTS.QUESTION_PACKAGES.BASE, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data as CreateQuestionPackageResponse);
  },

  updateStatus(
    id: number | string,
    payload: UpdateQuestionPackageStatusRequest
  ): Promise<UpdateQuestionPackageStatusResponse> {
    return http
      .patch(API_ENDPOINTS.QUESTION_PACKAGES.STATUS(id), payload)
      .then((r) => r.data as UpdateQuestionPackageStatusResponse);
  },

  destroy(id: number | string): Promise<DeleteQuestionPackageResponse> {
    return http
      .delete(API_ENDPOINTS.QUESTION_PACKAGES.DETAIL(id))
      .then((r) => r.data as DeleteQuestionPackageResponse);
  },
};
