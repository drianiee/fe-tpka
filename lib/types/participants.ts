export type ParticipantListItem = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  profile_completed_at?: string | null;
  created_at?: string;
};

export type Participant = ParticipantListItem;

export type ParticipantScheduleItem = {
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;

  status_jadwal: string; // "Tes Belum Dimulai", dst
  quiz_url?: string | null;

  is_partner: boolean;
  partner?: { id: number; name: string } | null;

  participant_status: string; // "peserta terdaftar", dst
  accessed_at?: string | null;
  finished_at?: string | null;
  registered_at?: string | null;

  capacity: number;
  current_participants: number;
};

export type ParticipantDetailResponse = {
  participant: Participant;
  schedules: ParticipantScheduleItem[];
  total_schedules: number;
};
