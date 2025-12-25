export function formatRupiah(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);
}

export function hhmm(time: string): string {
  // "13:00:00" -> "13:00"
  if (!time) return "-";
  return time.slice(0, 5);
}
