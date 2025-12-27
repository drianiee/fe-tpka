"use client";

import { AddOperatorDialog } from "@/components/operators/AddOperatorDialog";
import { OperatorsTable } from "@/components/operators/OperatorsTable";
import { Separator } from "@/components/ui/separator";

export default function AdminOperatorPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Operator</h1>
          <p className="text-sm text-muted-foreground">Kelola Operator</p>
        </div>
        <AddOperatorDialog />
      </div>

      <Separator />

      <OperatorsTable />
    </div>
  );
}
