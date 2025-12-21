export type UserRole = "peserta" | "operator" | "administrator";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  email_verified_at: string | null;

  id_type?: "ktp" | "ktm" | "sim" | null;
  id_image_path?: string | null;
  birth_date?: string | null; // "YYYY-MM-DD"
  phone?: string | null;
  profile_completed_at?: string | null;

  created_at?: string;
  updated_at?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
  token: string;
};

export type CompleteProfileRequest = {
  id_type: "ktp" | "ktm" | "sim";
  id_image: File;
  birth_date: string; // YYYY-MM-DD
  phone: string;
};

export type CompleteProfileResponse = {
  message: string;
  user: User;
  token: string; // token api normal setelah complete
};

export type ResendVerifyRequest = {
  email: string;
};

export type ResendVerifyResponse = {
  message: string;
};
