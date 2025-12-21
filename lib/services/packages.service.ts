import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { QuestionPackage, CreatePackageRequest, CreatePackageResponse } from "@/lib/types/packages";

export class PackagesService {
  async list(): Promise<QuestionPackage[]> {
    const res = await api.get<QuestionPackage[]>(API_ENDPOINTS.PACKAGES.BASE);
    return res.data;
  }

  async create(payload: CreatePackageRequest): Promise<CreatePackageResponse> {
    const form = new FormData();
    form.append("name", payload.name);

    const optionalNum = (k: string, v: number | null | undefined) => {
      if (v === undefined || v === null) return;
      form.append(k, String(v));
    };

    optionalNum("verbal_category_id", payload.verbal_category_id);
    optionalNum("verbal_num_questions", payload.verbal_num_questions);
    optionalNum("verbal_duration_minutes", payload.verbal_duration_minutes);

    optionalNum("quantitative_category_id", payload.quantitative_category_id);
    optionalNum("quantitative_num_questions", payload.quantitative_num_questions);
    optionalNum("quantitative_duration_minutes", payload.quantitative_duration_minutes);

    optionalNum("logic_category_id", payload.logic_category_id);
    optionalNum("logic_num_questions", payload.logic_num_questions);
    optionalNum("logic_duration_minutes", payload.logic_duration_minutes);

    optionalNum("spatial_category_id", payload.spatial_category_id);
    optionalNum("spatial_num_questions", payload.spatial_num_questions);
    optionalNum("spatial_duration_minutes", payload.spatial_duration_minutes);

    if (payload.file) form.append("file", payload.file);

    const res = await api.post<CreatePackageResponse>(API_ENDPOINTS.PACKAGES.BASE, form);
    return res.data;
  }

  async detail(id: number | string): Promise<QuestionPackage> {
    const res = await api.get<QuestionPackage>(API_ENDPOINTS.PACKAGES.DETAIL(id));
    return res.data;
  }
}

export const packagesService = new PackagesService();
