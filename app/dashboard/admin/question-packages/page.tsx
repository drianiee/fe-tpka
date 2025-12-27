"use client";

import { AddQuestionPackageDialog } from "@/components/packages/AddQuestionPackageDialog";
import { QuestionPackagesTable } from "@/components/packages/QuestionPackagesTable";
import { Separator } from "@/components/ui/separator";

export default function AdminPackagesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Paket Soal</h1>
          <p className="text-sm text-muted-foreground">Kelola Paket Soal</p>
        </div>
        <AddQuestionPackageDialog />
      </div>

      <Separator />

      <QuestionPackagesTable />
    </div>
  );
}
