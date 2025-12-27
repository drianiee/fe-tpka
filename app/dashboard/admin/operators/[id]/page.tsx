"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { OperatorDetailCard } from "@/components/operators/OperatorDetailCard";

export default function AdminOperatorDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Detail Operator</h1>
        <p className="text-sm text-muted-foreground">
          Lihat informasi operator dan ubah status aktif/nonaktif
        </p>
      </div>

      <Separator />

      <OperatorDetailCard id={id} />
    </div>
  );
}
