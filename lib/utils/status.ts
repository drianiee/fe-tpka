export function TesStatus(status: string) {
  if (status === "Tes Sedang Berlangsung") return "destructive";
  if (status === "Tes Telah Selesai") return "secondary";
  return "default";
}