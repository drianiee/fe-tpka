import { Badge } from "@/components/ui/badge";

/* ================= STRING STATUS (TES) ================= */

function TesStatus(status: string) {
  if (status === "Tes Sedang Berlangsung") return "destructive";
  if (status === "Tes Telah Selesai") return "secondary";
  return "default";
}

/* ================= BOOLEAN STATUS (PARTNER) ================= */

function BooleanStatusVariant(isActive: boolean) {
  return isActive ? "default" : "secondary";
}

function BooleanStatusLabel(isActive: boolean) {
  return isActive ? "Aktif" : "Tidak Aktif";
}

/* ================= BADGE ================= */

export function StatusBadge({
  status,
}: {
  status: string | boolean | undefined | null;
}) {
  // boolean / undefined / null → treat as false by default
  if (typeof status === "boolean" || status == null) {
    const isActive = status === true;
    return (
      <Badge variant={BooleanStatusVariant(isActive)}>
        {BooleanStatusLabel(isActive)}
      </Badge>
    );
  }

  // string → tes status
  return <Badge variant={TesStatus(status)}>{status}</Badge>;
}
