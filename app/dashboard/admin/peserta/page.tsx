"use client";

import { Separator } from "@/components/ui/separator";
import { ParticipantsTable } from "@/components/participants/ParticipantsTable";

export default function AdminParticipantsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Peserta</h1>
        <p className="text-sm text-muted-foreground">Kelola dan lihat data peserta</p>
      </div>

      <Separator />

      <ParticipantsTable />
    </div>
  );
}
