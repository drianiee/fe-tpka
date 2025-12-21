export type QuestionPackage = {
  id: number;
  name: string;

  total_questions?: number | null;
  total_duration_minutes?: number | null;

  verbal_category_id?: number | null;
  verbal_num_questions?: number | null;
  verbal_duration_minutes?: number | null;

  quantitative_category_id?: number | null;
  quantitative_num_questions?: number | null;
  quantitative_duration_minutes?: number | null;

  logic_category_id?: number | null;
  logic_num_questions?: number | null;
  logic_duration_minutes?: number | null;

  spatial_category_id?: number | null;
  spatial_num_questions?: number | null;
  spatial_duration_minutes?: number | null;

  file_path?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type CreatePackageRequest = {
  name: string;

  verbal_category_id?: number | null;
  verbal_num_questions?: number | null;
  verbal_duration_minutes?: number | null;

  quantitative_category_id?: number | null;
  quantitative_num_questions?: number | null;
  quantitative_duration_minutes?: number | null;

  logic_category_id?: number | null;
  logic_num_questions?: number | null;
  logic_duration_minutes?: number | null;

  spatial_category_id?: number | null;
  spatial_num_questions?: number | null;
  spatial_duration_minutes?: number | null;

  file?: File | null;
};

export type CreatePackageResponse = {
  message: string;
  package: QuestionPackage;
};
