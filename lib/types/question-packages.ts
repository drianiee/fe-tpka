export type QuestionPackage = {
  id: number;
  name: string;
  total_questions: number | null;
  total_duration_minutes: number | null;
  file_path?: string | null;
  created_at?: string;
  updated_at?: string;
};
