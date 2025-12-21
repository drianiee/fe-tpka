import type { User } from "@/lib/types/auth";

export type QuestionPackageLite = {
  id: number;
  name: string;
};

export type TestSchedule = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  price: string;
  is_partner: boolean;
  capacity: number;

  package_id?: number | null;
  package?: QuestionPackageLite | null;

  moodle_course_id?: number | null;
  moodle_quiz_id?: number | null;
  moodle_quiz_cmid?: number | null;
  provisioned_at?: string | null;

  current_participants?: number;
  status?: string;
  quiz_url?: string | null;

  users?: Pick<User, "id" | "name" | "email">[];
};

export type CreateScheduleRequest = {
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  price: number;
  is_partner: boolean;
  capacity: number;
  package_id?: number | null;
  package_ids?: number[]; // optional
};

export type CreateScheduleResponse = {
  message: string;
  schedule: TestSchedule;
};

export type AddParticipantRequest = {
  user_id: number;
};

export type AddParticipantResponse = {
  message: string;
  schedule: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    price: string;
    is_partner: boolean;
    capacity: number;
    current_participants: number;
    status: string;
    package: QuestionPackageLite | null;
    users: Pick<User, "id" | "name" | "email">[];
  };
  quiz_url: string | null;
};
