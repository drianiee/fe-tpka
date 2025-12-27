// lib/types/question-packages.ts
export type QuestionPackage = {
  id: number
  name: string
  is_active: boolean

  file_path?: string | null

  verbal_category_id?: number | null
  verbal_num_questions?: number | null
  verbal_duration_minutes?: number | null

  quantitative_category_id?: number | null
  quantitative_num_questions?: number | null
  quantitative_duration_minutes?: number | null

  logic_category_id?: number | null
  logic_num_questions?: number | null
  logic_duration_minutes?: number | null

  spatial_category_id?: number | null
  spatial_num_questions?: number | null
  spatial_duration_minutes?: number | null

  total_questions?: number | null
  total_duration_minutes?: number | null

  created_at?: string
  updated_at?: string
}

export type ListQuestionPackagesParams = {
  q?: string
  is_active?: boolean
  per_page?: number
  page?: number
}

export type CreateQuestionPackageRequest = {
  name: string
  is_active?: boolean

  verbal_category_id?: number
  verbal_num_questions?: number
  verbal_duration_minutes?: number

  quantitative_category_id?: number
  quantitative_num_questions?: number
  quantitative_duration_minutes?: number

  logic_category_id?: number
  logic_num_questions?: number
  logic_duration_minutes?: number

  spatial_category_id?: number
  spatial_num_questions?: number
  spatial_duration_minutes?: number

  file?: File | null
}

export type CreateQuestionPackageResponse = {
  message: string
  package: QuestionPackage
}

export type UpdateQuestionPackageStatusRequest = {
  is_active: boolean
}

export type UpdateQuestionPackageStatusResponse = {
  message: string
  package: QuestionPackage
}

export type DeleteQuestionPackageResponse = {
  message: string
}
