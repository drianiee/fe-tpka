export type DashboardTotals = {
  participants: number;
};

export type LatestSchedule = {
  id: number;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:mm:ss" atau "HH:mm" tergantung backend cast
  end_time: string;
  price: string; // karena Laravel decimal sering jadi string
  is_partner: boolean;
  capacity: number;
  current_participants: number; // dari withCount alias
  status?: string; // appends di model
  quiz_url?: string | null;
};

export type DashboardResponse = {
  totals: DashboardTotals;
  latest_schedules: LatestSchedule[];
};
