// lib/types/schedules.ts

export type ScheduleStatus =
  | "Tes Belum Dimulai"
  | "Tes Akan Segera Dimulai"
  | "Tes Sedang Berlangsung"
  | "Tes Telah Selesai"
  | string;

export type QuestionPackageLite = {
  id: number;
  name: string;
};

export type ScheduleListItem = {
  id: number;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:mm:ss"
  end_time: string; // "HH:mm:ss"
  price: string; // "150000.00"

  // di list kamu ada ini, tapi di detail contoh terbaru kamu tidak ada.
  // jadi bikin optional supaya ga konflik.
  is_partner?: boolean;

  capacity: number;
  package_id?: number | null;

  moodle_course_id?: number | null;
  moodle_quiz_id?: number | null;
  moodle_quiz_cmid?: number | null;
  provisioned_at?: string | null;

  created_at?: string;
  updated_at?: string;

  quiz_url: string | null;
  status: ScheduleStatus;
  package: QuestionPackageLite | null;
};

export type ScheduleParticipant = {
  id: number;
  name: string;
  email: string;
  registered_at: string; // ISO string
};

export type ScheduleDetail = ScheduleListItem & {
  current_participants: number;
  participants: ScheduleParticipant[];
};

export type CreateScheduleRequest = {
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:mm" (sesuai request kamu)
  price: number;
  is_partner: boolean;
  capacity: number;
  package_id?: number;
  package_ids?: number[];
};

export type CreateScheduleResponse = {
  message: string;
  schedule: ScheduleDetail;
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
    status: ScheduleStatus;
    package: QuestionPackageLite | null;
    users: Array<{ id: number; name: string; email: string }>;
  };
  quiz_url: string | null;
};

export type RemoveParticipantResponse = {
  message: string;
};
