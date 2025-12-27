"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { ParticipantDetailCard } from "@/components/participants/ParticipantDetailCard";

export default function AdminParticipantDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Detail Peserta</h1>
        <p className="text-sm text-muted-foreground">
          Informasi peserta dan daftar jadwal tes yang diikuti
        </p>
      </div>

      <Separator />

      <ParticipantDetailCard id={id} />
    </div>
  );
}
