export type ScheduleStatus =
  | "Tes Belum Dimulai"
  | "Tes Akan Segera Dimulai"
  | "Tes Sedang Berlangsung"
  | "Tes Telah Selesai"
  | string;

/* ================= PACKAGES ================= */

export type QuestionPackageLite = {
  id: number;
  name: string;
  is_active?: boolean;
};

/* ================= PARTNER ================= */

export type PartnerLite = {
  id: number;
  name: string;
};

/* ================= LIST ITEM ================= */

export type ScheduleListItem = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  price: string;

  is_partner: boolean;
  partner_id: number | null;
  partner: PartnerLite | null;

  capacity: number;

  moodle_course_id?: number | null;
  moodle_quiz_id?: number | null;
  moodle_quiz_cmid?: number | null;
  provisioned_at?: string | null;

  created_at?: string;
  updated_at?: string;

  quiz_url: string | null;
  status: ScheduleStatus;
  current_participants: number;

  // ✅ INI YANG PENTING
  packages: QuestionPackageLite[];
};

/* ================= DETAIL ================= */

export type ScheduleParticipant = {
  id: number;
  name: string;
  email: string;
  registered_at: string;
};

export type ScheduleDetail = ScheduleListItem & {
  participants: ScheduleParticipant[];
};

/* ================= REQUEST / RESPONSE ================= */

export type CreateScheduleRequest = {
  date: string;
  start_time: string;
  price: number;
  is_partner: boolean;
  capacity: number;
  partner_id?: number;
  package_id?: number | number[];
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
    packages: QuestionPackageLite[];
    users: Array<{ id: number; name: string; email: string }>;
  };
  quiz_url: string | null;
};

export type RemoveParticipantResponse = {
  message: string;
};
