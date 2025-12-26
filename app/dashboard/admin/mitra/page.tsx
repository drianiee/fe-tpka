"use client";

import { AddPartnerDialog } from "@/components/partners/AddPartnerDialog";
import { PartnersTable } from "@/components/partners/PartnersTable";
import { Separator } from "@/components/ui/separator";

export default function AdminMitraPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Mitra</h1>
          <p className="text-sm text-muted-foreground">Kelola Mitra</p>
        </div>
        <AddPartnerDialog />
      </div>

      <Separator />

      <PartnersTable />
    </div>
  );
}
