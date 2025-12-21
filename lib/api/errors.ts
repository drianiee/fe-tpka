import type { AxiosError } from "axios";

type LaravelValidationErrors = Record<string, string[] | string>;

type LaravelErrorShape = {
  message?: unknown;
  errors?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLaravelValidationErrors(value: unknown): value is LaravelValidationErrors {
  if (!isRecord(value)) return false;

  // minimal check: key -> (string | string[])
  for (const k of Object.keys(value)) {
    const v = value[k];
    const ok =
      typeof v === "string" ||
      (Array.isArray(v) && v.every((x) => typeof x === "string"));
    if (!ok) return false;
  }
  return true;
}

function isLaravelErrorShape(value: unknown): value is LaravelErrorShape {
  return isRecord(value) && ("message" in value || "errors" in value);
}

/**
 * Laravel umum:
 * - { message: "..." }
 * - { message: "...", errors: { field: ["..."] } }
 * - { errors: { field: ["..."] } }
 */
export function getApiErrorMessage(err: unknown): string {
  const fallback = "Terjadi kesalahan. Coba lagi.";

  const axiosErr = err as AxiosError<unknown>;
  const data = axiosErr?.response?.data;

  if (data === undefined || data === null) {
    return axiosErr?.message || fallback;
  }

  if (typeof data === "string") return data;

  if (isLaravelErrorShape(data)) {
    const msg = typeof data.message === "string" ? data.message : null;

    if (isLaravelValidationErrors(data.errors)) {
      const first = firstValidationError(data.errors);
      if (msg && first) return `${msg} — ${first}`;
      if (msg) return msg;
      if (first) return first;
    }

    if (msg) return msg;
  }

  return fallback;
}

function firstValidationError(errors: LaravelValidationErrors): string | null {
  for (const key of Object.keys(errors)) {
    const v = errors[key];
    if (Array.isArray(v) && v.length > 0) return v[0] ?? null;
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}
